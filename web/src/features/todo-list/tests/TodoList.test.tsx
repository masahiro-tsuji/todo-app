import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MuiProvider } from '@/components';
import { formatToYYYYMMDDHHmm } from '@/utils';

import { TodoList } from '../index';

const mockTodos = Array(5)
  .fill(0)
  .map((_, i) => ({
    id: String(i),
    title: `タイトル${i}`,
    detail: `詳細${i}`,
    createdAt: `2026-01-0${i + 1}T10:00:00.000Z`,
    completed: false,
  }));

const mockOnOpenEditDialog = jest.fn();
const mockOnOpenSoftDeleteDialog = jest.fn();

jest.mock('@/hooks/useGetTodos', () => ({
  useGetTodos: () => ({ todos: mockTodos }),
}));

const renderTodoList = () => {
  return render(
    <MuiProvider>
      <TodoList onOpenEditDialog={mockOnOpenEditDialog} onOpenSoftDeleteDialog={mockOnOpenSoftDeleteDialog} />
    </MuiProvider>,
  );
};

describe('TodoList コンポーネントのテスト', () => {
  beforeEach(() => {
    mockOnOpenEditDialog.mockClear();
    mockOnOpenSoftDeleteDialog.mockClear();
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

  test('編集ボタンでonOpenEditDialogが呼ばれること', async () => {
    const user = userEvent.setup();
    renderTodoList();
    const target = mockTodos[0];

    await user.click(screen.getByRole('button', { name: `${target.title}を編集` }));

    expect(mockOnOpenEditDialog).toHaveBeenCalledWith(target);
    expect(mockOnOpenSoftDeleteDialog).not.toHaveBeenCalled();
  });

  test('削除ボタンでonOpenSoftDeleteDialogが呼ばれること', async () => {
    const user = userEvent.setup();
    renderTodoList();
    const target = mockTodos[4];

    await user.click(screen.getByRole('button', { name: `${target.title}を削除` }));

    expect(mockOnOpenSoftDeleteDialog).toHaveBeenCalledWith(target);
    expect(mockOnOpenEditDialog).not.toHaveBeenCalled();
  });
});
