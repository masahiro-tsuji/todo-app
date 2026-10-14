import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MuiProvider } from '@/components';
import { formatToYYYYMMDDHHmm } from '@/utils';
import { CompletedList } from '../index';

const mockTodos = [
  {
    id: '0',
    title: '未完了タイトル',
    detail: '未完了詳細',
    createdAt: '2026-01-01T10:00:00.000Z',
    completed: false,
  },
  {
    id: '1',
    title: 'タイトル1',
    detail: '詳細1',
    createdAt: '2026-01-02T10:00:00.000Z',
    completed: true,
    completedAt: '2026-01-03T11:00:00.000Z',
  },
  {
    id: '2',
    title: 'タイトル2',
    createdAt: '2026-01-04T10:00:00.000Z',
    completed: true,
    completedAt: '2026-01-05T12:30:00.000Z',
  },
];

const completedTodos = mockTodos.filter((todo) => todo.completed);
const mockOnOpenUncompleteDialog = jest.fn();
const mockOnOpenSoftDeleteDialog = jest.fn();

jest.mock('@/hooks/useGetTodos', () => ({
  useGetTodos: () => ({ todos: mockTodos, isPending: false }),
}));

const renderCompletedList = () => {
  return render(
    <MuiProvider>
      <CompletedList
        onOpenUncompleteDialog={mockOnOpenUncompleteDialog}
        onOpenSoftDeleteDialog={mockOnOpenSoftDeleteDialog}
      />
    </MuiProvider>,
  );
};

describe('CompletedList コンポーネントのテスト', () => {
  beforeEach(() => {
    mockOnOpenUncompleteDialog.mockClear();
    mockOnOpenSoftDeleteDialog.mockClear();
  });

  test('完了済みのTODOのみ表示されること', () => {
    renderCompletedList();
    completedTodos.forEach((element) => {
      expect(screen.getByText(element.title)).toBeInTheDocument();
    });
    expect(screen.queryByText('未完了タイトル')).not.toBeInTheDocument();
  });

  test('詳細が表示されること', () => {
    renderCompletedList();
    expect(screen.getByText('詳細1')).toBeInTheDocument();
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  test('作成日時と完了日時が表示されること', () => {
    renderCompletedList();
    completedTodos.forEach((element) => {
      expect(screen.getByText(formatToYYYYMMDDHHmm(element.createdAt))).toBeInTheDocument();
      expect(screen.getByText(formatToYYYYMMDDHHmm(element.completedAt ?? ''))).toBeInTheDocument();
    });
  });

  test('各TODOに未完了にする・削除ボタンが表示されること', () => {
    renderCompletedList();
    completedTodos.forEach((element) => {
      expect(screen.getByRole('button', { name: `${element.title}を未完了にする` })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: `${element.title}を削除` })).toBeInTheDocument();
    });
  });

  test('未完了ボタンでonOpenUncompleteDialogが呼ばれること', async () => {
    const user = userEvent.setup();
    renderCompletedList();
    const target = completedTodos[0];

    await user.click(screen.getByRole('button', { name: `${target.title}を未完了にする` }));

    expect(mockOnOpenUncompleteDialog).toHaveBeenCalledWith(target);
    expect(mockOnOpenSoftDeleteDialog).not.toHaveBeenCalled();
  });

  test('削除ボタンでonOpenSoftDeleteDialogが呼ばれること', async () => {
    const user = userEvent.setup();
    renderCompletedList();
    const target = completedTodos[1];

    await user.click(screen.getByRole('button', { name: `${target.title}を削除` }));

    expect(mockOnOpenSoftDeleteDialog).toHaveBeenCalledWith(target);
    expect(mockOnOpenUncompleteDialog).not.toHaveBeenCalled();
  });
});
