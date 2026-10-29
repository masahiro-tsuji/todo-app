import '@testing-library/jest-dom';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MuiProvider } from '@/components';
import type { Todo } from '@/types';
import { UncompleteTodo } from '../index';

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
  completedAt: '2026-01-02T10:00:00.000Z',
};

const renderUncompleteTodo = (props?: Partial<{ todo: Todo | null; isOpen: boolean; onClose: () => void }>) => {
  const onClose = props?.onClose ?? jest.fn();
  const todo = props?.todo === undefined ? mockTodo : props.todo;
  const result = render(
    <MuiProvider>
      <UncompleteTodo todo={todo} isOpen={props?.isOpen ?? !!todo} onClose={onClose} />
    </MuiProvider>,
  );

  return { ...result, onClose };
};

describe('UncompleteTodo コンポーネントのテスト', () => {
  beforeEach(() => {
    mockUpdateTodo.mockClear();
    mockUpdateTodo.mockImplementation((_params, options) => {
      options?.onSuccess?.();
      return Promise.resolve(undefined);
    });
  });

  test('todoがあるとき確認ダイアログが表示されること', () => {
    renderUncompleteTodo();

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByRole('heading', { name: '確認' })).toBeInTheDocument();
    expect(within(dialog).getByText('「既存タイトル」を未完了にしますか？')).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: '未完了にする' })).toBeInTheDocument();
  });

  test('todoがnullのときダイアログが表示されないこと', () => {
    renderUncompleteTodo({ todo: null });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('未完了にするボタンでcompleted: falseが送られること', async () => {
    const user = userEvent.setup();
    renderUncompleteTodo();

    const dialog = screen.getByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: '未完了にする' }));

    expect(mockUpdateTodo).toHaveBeenCalledWith(
      { id: mockTodo.id, body: { completed: false } },
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    );
  });

  test('未完了成功時にダイアログが閉じること', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    renderUncompleteTodo({ onClose });

    const dialog = screen.getByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: '未完了にする' }));

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });

  test('updateTodoが失敗した場合はダイアログが閉じないこと', async () => {
    mockUpdateTodo.mockImplementation(() => Promise.resolve(undefined));
    const user = userEvent.setup();
    const onClose = jest.fn();
    renderUncompleteTodo({ onClose });

    const dialog = screen.getByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: '未完了にする' }));

    expect(mockUpdateTodo).toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByText('「既存タイトル」を未完了にしますか？')).toBeInTheDocument();
  });

  test('キャンセルボタンでダイアログが閉じること', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    renderUncompleteTodo({ onClose });

    const dialog = screen.getByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: 'キャンセル' }));

    expect(onClose).toHaveBeenCalled();
    expect(mockUpdateTodo).not.toHaveBeenCalled();
  });
});
