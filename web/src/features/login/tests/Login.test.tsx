import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfirmDialogProvider, MuiProvider, QueryProvider } from '@/components';
import { Login } from '../index';

const mockReplace = jest.fn();
const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace, push: mockPush }),
  useServerInsertedHTML: () => {},
}));

jest.mock('aws-amplify/auth', () => ({
  signIn: jest.fn(),
  signOut: jest.fn(),
  fetchAuthSession: jest.fn().mockResolvedValue({ tokens: undefined }),
}));

const renderLogin = () => {
  return render(
    <QueryProvider>
      <ConfirmDialogProvider>
        <MuiProvider>
          <Login />
        </MuiProvider>
      </ConfirmDialogProvider>
    </QueryProvider>,
  );
};

describe('Login コンポーネントのテスト', () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockPush.mockClear();
  });

  test('ログインフォームが表示されること', async () => {
    renderLogin();

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'ログイン' })).toBeInTheDocument();
    });
    expect(screen.getByRole('textbox', { name: /メールアドレス/ })).toBeInTheDocument();
    expect(screen.getByLabelText(/パスワード/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ログイン' })).toBeInTheDocument();
  });

  test('MFA コード入力が必要な場合 /mfa-verify へ遷移すること', async () => {
    const { signIn } = jest.requireMock('aws-amplify/auth');
    signIn.mockResolvedValue({
      isSignedIn: false,
      nextStep: { signInStep: 'CONFIRM_SIGN_IN_WITH_TOTP_CODE' },
    });

    renderLogin();
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'ログイン' })).toBeInTheDocument();
    });

    await userEvent.type(screen.getByRole('textbox', { name: /メールアドレス/ }), 'user@example.com');
    await userEvent.type(screen.getByLabelText(/パスワード/), 'password');
    await userEvent.click(screen.getByRole('button', { name: 'ログイン' }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/mfa-verify');
    });
  });

  test('新パスワード設定が必要な場合 /new-password へ遷移すること', async () => {
    const { signIn } = jest.requireMock('aws-amplify/auth');
    signIn.mockResolvedValue({
      isSignedIn: false,
      nextStep: { signInStep: 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED' },
    });

    renderLogin();
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'ログイン' })).toBeInTheDocument();
    });

    await userEvent.type(screen.getByRole('textbox', { name: /メールアドレス/ }), 'user@example.com');
    await userEvent.type(screen.getByLabelText(/パスワード/), 'password');
    await userEvent.click(screen.getByRole('button', { name: 'ログイン' }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/new-password');
    });
  });
});
