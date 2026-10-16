import '@testing-library/jest-dom';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MuiProvider } from '@/components';
import type { Todo } from '@/types';
import { CompleteTodo } from '../index';

const mockUpdateTodo = jest.fn();

jest.mock('@/hooks/useUpdateTodo', () => ({
  useUpdateTodo: () => ({ updateTodo: mockUpdateTodo, isPendingUpdateTodo: false }),
}));

const mockTodo: Todo = {
  id: '1',
  userId: 'demo-user-id',
  title: '既存タイトル',
  detail: '既存詳細',
  createdAt: '2026-01-01T10:00:00.000Z',
};

const renderCompleteTodo = (props?: Partial<{ todo: Todo | null; isOpen: boolean; onClose: () => void }>) => {
  const onClose = props?.onClose ?? jest.fn();
  const todo = props?.todo === undefined ? mockTodo : props.todo;
  const result = render(
    <MuiProvider>
      <CompleteTodo todo={todo} isOpen={props?.isOpen ?? !!todo} onClose={onClose} />
    </MuiProvider>,
  );

  return { ...result, onClose };
};

describe('CompleteTodo コンポーネントのテスト', () => {
  beforeEach(() => {
    mockUpdateTodo.mockClear();
    mockUpdateTodo.mockImplementation((_params, options) => {
      options?.onSuccess?.();
      return Promise.resolve(undefined);
    });
  });

  test('todoがあるとき確認ダイアログが表示されること', () => {
    renderCompleteTodo();

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByRole('heading', { name: '完了にする' })).toBeInTheDocument();
    expect(within(dialog).getByText('「既存タイトル」を完了にしますか？')).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: '完了' })).toBeInTheDocument();
  });

  test('todoがnullのときダイアログが表示されないこと', () => {
    renderCompleteTodo({ todo: null });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('完了ボタンでcompleted: trueが送られること', async () => {
    const user = userEvent.setup();
    renderCompleteTodo();

    const dialog = screen.getByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: '完了' }));

    expect(mockUpdateTodo).toHaveBeenCalledWith(
      { id: mockTodo.id, body: { completed: true } },
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    );
  });

  test('完了成功時にダイアログが閉じること', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    renderCompleteTodo({ onClose });

    const dialog = screen.getByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: '完了' }));

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });

  test('updateTodoが失敗した場合はダイアログが閉じないこと', async () => {
    mockUpdateTodo.mockImplementation(() => Promise.resolve(undefined));
    const user = userEvent.setup();
    const onClose = jest.fn();
    renderCompleteTodo({ onClose });

    const dialog = screen.getByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: '完了' }));

    expect(mockUpdateTodo).toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByText('「既存タイトル」を完了にしますか？')).toBeInTheDocument();
  });

  test('キャンセルボタンでダイアログが閉じること', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    renderCompleteTodo({ onClose });

    const dialog = screen.getByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: 'キャンセル' }));

    expect(onClose).toHaveBeenCalled();
    expect(mockUpdateTodo).not.toHaveBeenCalled();
  });
});
