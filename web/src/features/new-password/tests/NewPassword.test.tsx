import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { confirmSignIn } from 'aws-amplify/auth';
import { ConfirmDialogProvider, MuiProvider, QueryProvider } from '@/components';
import { NewPassword } from '../index';

const mockReplace = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace, push: jest.fn() }),
  usePathname: () => '/new-password',
  useServerInsertedHTML: () => {},
}));

jest.mock('aws-amplify/auth', () => ({
  confirmSignIn: jest.fn(),
  fetchAuthSession: jest.fn().mockResolvedValue({ tokens: undefined }),
}));

const renderNewPassword = () => {
  return render(
    <QueryProvider>
      <ConfirmDialogProvider>
        <MuiProvider>
          <NewPassword />
        </MuiProvider>
      </ConfirmDialogProvider>
    </QueryProvider>,
  );
};

describe('NewPassword コンポーネントのテスト', () => {
  beforeEach(() => {
    mockReplace.mockClear();
    jest.mocked(confirmSignIn).mockReset();
  });

  test('新パスワードフォームが表示されること', async () => {
    renderNewPassword();

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: '新しいパスワード' })).toBeInTheDocument();
    });
    expect(screen.getByLabelText(/新しいパスワード/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'パスワードを設定' })).toBeInTheDocument();
  });

  test('confirmSignIn 成功時 /list へ遷移すること', async () => {
    jest.mocked(confirmSignIn).mockResolvedValue({ isSignedIn: true, nextStep: { signInStep: 'DONE' } });

    renderNewPassword();
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: '新しいパスワード' })).toBeInTheDocument();
    });

    await userEvent.type(screen.getByLabelText(/新しいパスワード/), 'newpass1');
    await userEvent.click(screen.getByRole('button', { name: 'パスワードを設定' }));

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/list');
    });
  });

  test('confirmSignIn 失敗時エラーとログイン画面へのリンクが表示されること', async () => {
    jest.mocked(confirmSignIn).mockRejectedValue(new Error('サインインセッションがありません'));

    renderNewPassword();
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: '新しいパスワード' })).toBeInTheDocument();
    });

    await userEvent.type(screen.getByLabelText(/新しいパスワード/), 'newpass1');
    await userEvent.click(screen.getByRole('button', { name: 'パスワードを設定' }));

    await waitFor(() => {
      expect(screen.getByText('サインインセッションがありません')).toBeInTheDocument();
    });
    expect(screen.getByRole('link', { name: 'ログイン画面へ戻る' })).toHaveAttribute('href', '/login');
  });
});
