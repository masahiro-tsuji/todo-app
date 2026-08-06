import '@testing-library/jest-dom';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MuiProvider } from '@/components';
import { CreateTodo } from '../index';

const mockCreateTodo = jest.fn();

jest.mock('@/hooks/useCreateTodo', () => ({
  useCreateTodo: () => ({ createTodo: mockCreateTodo, isPendingCreateTodo: false }),
}));

const renderCreateTodo = () => {
  return render(
    <MuiProvider>
      <CreateTodo />
    </MuiProvider>,
  );
};

const openDialog = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole('button', { name: '登録' }));
  return screen.getByRole('dialog');
};

describe('CreateTodo コンポーネントのテスト', () => {
  beforeEach(() => {
    mockCreateTodo.mockClear();
    mockCreateTodo.mockImplementation((_params, options) => {
      options?.onSuccess?.();
      return Promise.resolve(undefined);
    });
  });

  test('登録ボタンが表示されること', () => {
    renderCreateTodo();

    expect(screen.getByRole('button', { name: '登録' })).toBeInTheDocument();
  });

  test('登録ボタンをクリックするとダイアログが表示されること', async () => {
    const user = userEvent.setup();
    renderCreateTodo();

    const dialog = await openDialog(user);

    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByRole('heading', { name: 'TODO登録' })).toBeInTheDocument();
    expect(within(dialog).getByRole('textbox', { name: /タイトル/ })).toBeInTheDocument();
    expect(within(dialog).getByRole('textbox', { name: /詳細/ })).toBeInTheDocument();
  });

  test('ダイアログを開いた直後はバリデーションエラーが表示されないこと', async () => {
    const user = userEvent.setup();
    renderCreateTodo();

    await openDialog(user);

    expect(screen.queryByText('タイトルを入力してください')).not.toBeInTheDocument();
  });

  test('タイトル未入力でフォーカスを外すとバリデーションエラーが表示されること', async () => {
    const user = userEvent.setup();
    renderCreateTodo();

    const dialog = await openDialog(user);
    const titleField = within(dialog).getByRole('textbox', { name: /タイトル/ });
    await user.click(titleField);
    await user.tab();

    expect(screen.getByText('タイトルを入力してください')).toBeInTheDocument();
    expect(mockCreateTodo).not.toHaveBeenCalled();
  });

  test('タイトル未入力で登録するとバリデーションエラーが表示されること', async () => {
    const user = userEvent.setup();
    renderCreateTodo();

    const dialog = await openDialog(user);
    await user.click(within(dialog).getByRole('button', { name: '登録' }));

    expect(screen.getByText('タイトルを入力してください')).toBeInTheDocument();
    expect(mockCreateTodo).not.toHaveBeenCalled();
  });

  test('タイトル入力後に登録するとcreateTodoが呼ばれダイアログが閉じること', async () => {
    const user = userEvent.setup();
    renderCreateTodo();

    const dialog = await openDialog(user);
    await user.type(within(dialog).getByRole('textbox', { name: /タイトル/ }), '新しいTODO');
    await user.click(within(dialog).getByRole('button', { name: '登録' }));

    expect(mockCreateTodo).toHaveBeenCalledWith(
      { title: '新しいTODO', detail: '' },
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    );
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  test('タイトルと詳細入力後に登録するとcreateTodoがdetail付きで呼ばれること', async () => {
    const user = userEvent.setup();
    renderCreateTodo();

    const dialog = await openDialog(user);
    await user.type(within(dialog).getByRole('textbox', { name: /タイトル/ }), '新しいTODO');
    await user.type(within(dialog).getByRole('textbox', { name: /詳細/ }), '詳細テキスト');
    await user.click(within(dialog).getByRole('button', { name: '登録' }));

    expect(mockCreateTodo).toHaveBeenCalledWith(
      { title: '新しいTODO', detail: '詳細テキスト' },
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    );
  });

  test('キャンセルボタンでダイアログが閉じること', async () => {
    const user = userEvent.setup();
    renderCreateTodo();

    const dialog = await openDialog(user);
    await user.click(within(dialog).getByRole('button', { name: 'キャンセル' }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    expect(mockCreateTodo).not.toHaveBeenCalled();
  });
});
