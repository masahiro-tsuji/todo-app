import '@testing-library/jest-dom';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MuiProvider } from '@/components';
import type { Todo } from '@/types';
import { SoftDeleteTodo } from '../index';

const mockSoftDelete = jest.fn();

jest.mock('@/hooks/useSoftDelete', () => ({
  useSoftDelete: () => ({ softDelete: mockSoftDelete, isPendingSoftDelete: false }),
}));

const mockTodo: Todo = {
  id: '1',
  userId: 'demo-user-id',
  title: '既存タイトル',
  detail: '既存詳細',
  createdAt: '2026-01-01T10:00:00.000Z',
};

const renderSoftDeleteTodo = (props?: Partial<{ todo: Todo | null; isOpen: boolean; onClose: () => void }>) => {
  const onClose = props?.onClose ?? jest.fn();
  const todo = props?.todo === undefined ? mockTodo : props.todo;
  const result = render(
    <MuiProvider>
      <SoftDeleteTodo todo={todo} isOpen={props?.isOpen ?? !!todo} onClose={onClose} />
    </MuiProvider>,
  );

  return { ...result, onClose };
};

describe('SoftDeleteTodo コンポーネントのテスト', () => {
  beforeEach(() => {
    mockSoftDelete.mockClear();
    mockSoftDelete.mockImplementation((_id, options) => {
      options?.onSuccess?.();
      return Promise.resolve(undefined);
    });
  });

  test('todoがあるとき確認ダイアログが表示されること', () => {
    renderSoftDeleteTodo();

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByRole('heading', { name: 'ゴミ箱に移動' })).toBeInTheDocument();
    expect(within(dialog).getByText('「既存タイトル」をゴミ箱に移動しますか？')).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: '削除' })).toBeInTheDocument();
  });

  test('todoがnullのときダイアログが表示されないこと', () => {
    renderSoftDeleteTodo({ todo: null });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('削除ボタンでsoftDeleteが呼ばれること', async () => {
    const user = userEvent.setup();
    renderSoftDeleteTodo();

    const dialog = screen.getByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: '削除' }));

    expect(mockSoftDelete).toHaveBeenCalledWith(
      mockTodo.id,
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    );
  });

  test('削除成功時にダイアログが閉じること', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    renderSoftDeleteTodo({ onClose });

    const dialog = screen.getByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: '削除' }));

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });

  test('softDeleteが失敗した場合はダイアログが閉じないこと', async () => {
    mockSoftDelete.mockImplementation(() => Promise.resolve(undefined));
    const user = userEvent.setup();
    const onClose = jest.fn();
    renderSoftDeleteTodo({ onClose });

    const dialog = screen.getByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: '削除' }));

    expect(mockSoftDelete).toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByText('「既存タイトル」をゴミ箱に移動しますか？')).toBeInTheDocument();
  });

  test('キャンセルボタンでダイアログが閉じること', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    renderSoftDeleteTodo({ onClose });

    const dialog = screen.getByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: 'キャンセル' }));

    expect(onClose).toHaveBeenCalled();
    expect(mockSoftDelete).not.toHaveBeenCalled();
  });
});
