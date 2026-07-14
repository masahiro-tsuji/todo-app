import '@testing-library/jest-dom';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MuiProvider } from '@/components';
import { CreateTodo } from '../index';

const mockOnAdd = jest.fn();

const renderCreateTodo = () => {
  return render(
    <MuiProvider>
      <CreateTodo onAdd={mockOnAdd} />
    </MuiProvider>,
  );
};

const openDialog = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole('button', { name: '登録' }));
  return screen.getByRole('dialog');
};

describe('CreateTodo コンポーネントのテスト', () => {
  beforeEach(() => {
    mockOnAdd.mockClear();
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
  });

  test('タイトル未入力で登録するとバリデーションエラーが表示されること', async () => {
    const user = userEvent.setup();
    renderCreateTodo();

    const dialog = await openDialog(user);
    await user.click(within(dialog).getByRole('button', { name: '登録' }));

    expect(screen.getByText('タイトルを入力してください')).toBeInTheDocument();
    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  test('タイトル入力後に登録するとonAddが呼ばれダイアログが閉じること', async () => {
    const user = userEvent.setup();
    renderCreateTodo();

    const dialog = await openDialog(user);
    await user.type(within(dialog).getByRole('textbox', { name: /タイトル/ }), '新しいTODO');
    await user.click(within(dialog).getByRole('button', { name: '登録' }));

    expect(mockOnAdd).toHaveBeenCalledWith('新しいTODO');
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  test('キャンセルボタンでダイアログが閉じること', async () => {
    const user = userEvent.setup();
    renderCreateTodo();

    const dialog = await openDialog(user);
    await user.click(within(dialog).getByRole('button', { name: 'キャンセル' }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    expect(mockOnAdd).not.toHaveBeenCalled();
  });
});
