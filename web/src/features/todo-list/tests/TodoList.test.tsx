import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MuiProvider } from '@/components';
import { formatToYYYYMMDDHHmm } from '@/utils';

import { TodoList } from '../index';

const mockTodos: {
  id: string;
  title: string;
  detail: string;
  createdAt: string;
  completedAt?: string;
}[] = [
  ...Array(5)
    .fill(0)
    .map((_, i) => ({
      id: String(i),
      title: `タイトル${i}`,
      detail: `詳細${i}`,
      createdAt: `2026-01-0${i + 1}T10:00:00.000Z`,
    })),
  {
    id: 'completed',
    title: '完了済みタイトル',
    detail: '完了済み詳細',
    createdAt: '2026-01-10T10:00:00.000Z',
    completedAt: '2026-01-11T10:00:00.000Z',
  },
];

const activeTodos = mockTodos.filter((todo) => todo.completedAt == null);
const mockOnOpenEditDialog = jest.fn();
const mockOnOpenCompleteDialog = jest.fn();
const mockOnOpenSoftDeleteDialog = jest.fn();

jest.mock('@/hooks/useGetTodos', () => ({
  useGetTodos: () => ({ todos: mockTodos }),
}));

const renderTodoList = () => {
  return render(
    <MuiProvider>
      <TodoList
        onOpenEditDialog={mockOnOpenEditDialog}
        onOpenCompleteDialog={mockOnOpenCompleteDialog}
        onOpenSoftDeleteDialog={mockOnOpenSoftDeleteDialog}
      />
    </MuiProvider>,
  );
};

describe('TodoList コンポーネントのテスト', () => {
  beforeEach(() => {
    mockOnOpenEditDialog.mockClear();
    mockOnOpenCompleteDialog.mockClear();
    mockOnOpenSoftDeleteDialog.mockClear();
  });

  test('未完了のTODOのみ表示されること', () => {
    renderTodoList();
    activeTodos.forEach((element) => {
      expect(screen.getByText(element.title)).toBeInTheDocument();
    });
    expect(screen.queryByText('完了済みタイトル')).not.toBeInTheDocument();
  });

  test('詳細が表示されること', () => {
    renderTodoList();
    activeTodos.forEach((element) => {
      expect(screen.getByText(element.detail)).toBeInTheDocument();
    });
  });

  test('作成日が表示されること', () => {
    renderTodoList();
    activeTodos.forEach((element) => {
      expect(screen.getByText(formatToYYYYMMDDHHmm(element.createdAt))).toBeInTheDocument();
    });
  });

  test('各TODOに編集・完了・削除ボタンが表示されること', () => {
    renderTodoList();
    activeTodos.forEach((element) => {
      expect(screen.getByRole('button', { name: `${element.title}を編集` })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: `${element.title}を完了にする` })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: `${element.title}を削除` })).toBeInTheDocument();
    });
  });

  test('編集ボタンでonOpenEditDialogが呼ばれること', async () => {
    const user = userEvent.setup();
    renderTodoList();
    const target = activeTodos[0];

    await user.click(screen.getByRole('button', { name: `${target.title}を編集` }));

    expect(mockOnOpenEditDialog).toHaveBeenCalledWith(target);
    expect(mockOnOpenCompleteDialog).not.toHaveBeenCalled();
    expect(mockOnOpenSoftDeleteDialog).not.toHaveBeenCalled();
  });

  test('完了ボタンでonOpenCompleteDialogが呼ばれること', async () => {
    const user = userEvent.setup();
    renderTodoList();
    const target = activeTodos[2];

    await user.click(screen.getByRole('button', { name: `${target.title}を完了にする` }));

    expect(mockOnOpenCompleteDialog).toHaveBeenCalledWith(target);
    expect(mockOnOpenEditDialog).not.toHaveBeenCalled();
    expect(mockOnOpenSoftDeleteDialog).not.toHaveBeenCalled();
  });

  test('削除ボタンでonOpenSoftDeleteDialogが呼ばれること', async () => {
    const user = userEvent.setup();
    renderTodoList();
    const target = activeTodos[4];

    await user.click(screen.getByRole('button', { name: `${target.title}を削除` }));

    expect(mockOnOpenSoftDeleteDialog).toHaveBeenCalledWith(target);
    expect(mockOnOpenEditDialog).not.toHaveBeenCalled();
    expect(mockOnOpenCompleteDialog).not.toHaveBeenCalled();
  });
});
