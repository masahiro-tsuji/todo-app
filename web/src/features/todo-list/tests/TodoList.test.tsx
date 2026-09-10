import '@testing-library/jest-dom';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfirmDialogProvider, MuiProvider } from '@/components';
import { formatToYYYYMMDDHHmm } from '@/utils';

import { TodoList } from '../index';

const mockTodos = Array(5)
  .fill(0)
  .map((_, i) => ({
    id: String(i),
    title: `タイトル${i}`,
    detail: `詳細${i}`,
    createdAt: `2026-01-0${i + 1}T10:00:00.000Z`,
  }));

const mockSoftDelete = jest.fn();

jest.mock('@/hooks/useGetTodos', () => ({
  useGetTodos: () => ({ data: mockTodos }),
}));

jest.mock('@/hooks/useUpdateTodo', () => ({
  useUpdateTodo: () => ({ updateTodo: jest.fn(), isPendingUpdateTodo: false }),
}));

jest.mock('@/hooks/useSoftDelete', () => ({
  useSoftDelete: () => ({ softDelete: mockSoftDelete, isPendingSoftDelete: false }),
}));

const renderTodoList = () => {
  return render(
    <ConfirmDialogProvider>
      <MuiProvider>
        <TodoList />
      </MuiProvider>
    </ConfirmDialogProvider>,
  );
};

describe('TodoList コンポーネントのテスト', () => {
  beforeEach(() => {
    mockSoftDelete.mockClear();
  });

  test('TODO一覧が表示されること', () => {
    renderTodoList();
    mockTodos.forEach((element) => {
      expect(screen.getByText(element.title)).toBeInTheDocument();
    });
  });

  test('詳細が表示されること', () => {
    renderTodoList();
    mockTodos.forEach((element) => {
      expect(screen.getByText(element.detail)).toBeInTheDocument();
    });
  });

  test('作成日が表示されること', () => {
    renderTodoList();
    mockTodos.forEach((element) => {
      expect(screen.getByText(formatToYYYYMMDDHHmm(element.createdAt))).toBeInTheDocument();
    });
  });

  test('各TODOに編集・削除ボタンが表示されること', () => {
    renderTodoList();
    mockTodos.forEach((element) => {
      expect(screen.getByRole('button', { name: `${element.title}を編集` })).toBeInTheDocument();
    });
    mockTodos.forEach((element) => {
      expect(screen.getByRole('button', { name: `${element.title}を削除` })).toBeInTheDocument();
    });
  });

  test('削除ボタンで確認後にsoftDeleteが呼ばれること', async () => {
    const user = userEvent.setup();
    renderTodoList();
    const target = mockTodos[4];

    await user.click(screen.getByRole('button', { name: `${target.title}を削除` }));

    await waitFor(() => {
      expect(screen.getByText(`「${target.title}」をゴミ箱に移動しますか？`)).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'OK' }));

    await waitFor(() => {
      expect(mockSoftDelete).toHaveBeenCalledWith(target.id);
    });
  });

  test('softDeleteが失敗した場合は確認ダイアログが閉じないこと', async () => {
    mockSoftDelete.mockRejectedValueOnce(new Error('failed'));
    const user = userEvent.setup();
    renderTodoList();
    const target = mockTodos[4];

    await user.click(screen.getByRole('button', { name: `${target.title}を削除` }));

    await waitFor(() => {
      expect(screen.getByText(`「${target.title}」をゴミ箱に移動しますか？`)).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'OK' }));

    await waitFor(() => {
      expect(mockSoftDelete).toHaveBeenCalledWith(target.id);
    });
    expect(screen.getByText(`「${target.title}」をゴミ箱に移動しますか？`)).toBeInTheDocument();
  });

  test('編集ボタンをクリックすると編集ダイアログが表示されること', async () => {
    const user = userEvent.setup();
    renderTodoList();
    const target = mockTodos[0];

    await user.click(screen.getByRole('button', { name: `${target.title}を編集` }));

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByRole('heading', { name: 'TODO編集' })).toBeInTheDocument();
    expect(within(dialog).getByRole('textbox', { name: /タイトル/ })).toHaveValue(target.title);
  });
});
