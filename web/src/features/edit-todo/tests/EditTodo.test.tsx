import '@testing-library/jest-dom';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MuiProvider } from '@/components';
import type { Todo } from '@/types';
import { EditTodo } from '../index';

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

const renderEditTodo = (props?: Partial<{ todo: Todo | null; open: boolean; onClose: () => void }>) => {
  const onClose = props?.onClose ?? jest.fn();
  const result = render(
    <MuiProvider>
      <EditTodo todo={props?.todo ?? mockTodo} open={props?.open ?? true} onClose={onClose} />
    </MuiProvider>,
  );

  return { ...result, onClose };
};

describe('EditTodo コンポーネントのテスト', () => {
  beforeEach(() => {
    mockUpdateTodo.mockClear();
    mockUpdateTodo.mockImplementation((_params, options) => {
      options?.onSuccess?.();
      return Promise.resolve(undefined);
    });
  });

  test('ダイアログが開くと既存値が表示されること', async () => {
    renderEditTodo();

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByRole('heading', { name: 'TODO編集' })).toBeInTheDocument();
    expect(within(dialog).getByRole('textbox', { name: /タイトル/ })).toHaveValue('既存タイトル');
    expect(within(dialog).getByRole('textbox', { name: /詳細/ })).toHaveValue('既存詳細');
  });

  test('タイトル未入力で更新するとバリデーションエラーが表示されること', async () => {
    const user = userEvent.setup();
    renderEditTodo();

    const dialog = screen.getByRole('dialog');
    const titleField = within(dialog).getByRole('textbox', { name: /タイトル/ });
    await user.clear(titleField);
    await user.click(within(dialog).getByRole('button', { name: '更新' }));

    expect(screen.getByText('タイトルを入力してください')).toBeInTheDocument();
    expect(mockUpdateTodo).not.toHaveBeenCalled();
  });

  test('タイトルのみ変更すると title のみ送ること', async () => {
    const user = userEvent.setup();
    renderEditTodo();

    const dialog = screen.getByRole('dialog');
    const titleField = within(dialog).getByRole('textbox', { name: /タイトル/ });
    await user.clear(titleField);
    await user.type(titleField, '新タイトル');
    await user.click(within(dialog).getByRole('button', { name: '更新' }));

    expect(mockUpdateTodo).toHaveBeenCalledWith(
      { id: '1', body: { title: '新タイトル' } },
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    );
  });

  test('詳細のみ変更すると detail のみ送ること', async () => {
    const user = userEvent.setup();
    renderEditTodo();

    const dialog = screen.getByRole('dialog');
    const detailField = within(dialog).getByRole('textbox', { name: /詳細/ });
    await user.clear(detailField);
    await user.type(detailField, '新詳細');
    await user.click(within(dialog).getByRole('button', { name: '更新' }));

    expect(mockUpdateTodo).toHaveBeenCalledWith(
      { id: '1', body: { detail: '新詳細' } },
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    );
  });

  test('変更なしで更新すると updateTodo が呼ばれずダイアログが閉じること', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    renderEditTodo({ onClose });

    const dialog = screen.getByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: '更新' }));

    expect(mockUpdateTodo).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  test('更新成功時にダイアログが閉じること', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    renderEditTodo({ onClose });

    const dialog = screen.getByRole('dialog');
    const titleField = within(dialog).getByRole('textbox', { name: /タイトル/ });
    await user.clear(titleField);
    await user.type(titleField, '新タイトル');
    await user.click(within(dialog).getByRole('button', { name: '更新' }));

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });

  test('キャンセルボタンでダイアログが閉じること', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    renderEditTodo({ onClose });

    const dialog = screen.getByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: 'キャンセル' }));

    expect(onClose).toHaveBeenCalled();
    expect(mockUpdateTodo).not.toHaveBeenCalled();
  });
});
