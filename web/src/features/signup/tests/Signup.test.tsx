import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { signUp } from 'aws-amplify/auth';
import { ConfirmDialogProvider, MuiProvider, QueryProvider } from '@/components';
import { Signup } from '../index';

const mockReplace = jest.fn();
const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace, push: mockPush }),
  usePathname: () => '/signup',
  useServerInsertedHTML: () => {},
}));

jest.mock('aws-amplify/auth', () => ({
  signUp: jest.fn(),
  fetchAuthSession: jest.fn().mockResolvedValue({ tokens: undefined }),
}));

const renderSignup = () => {
  return render(
    <QueryProvider>
      <ConfirmDialogProvider>
        <MuiProvider>
          <Signup />
        </MuiProvider>
      </ConfirmDialogProvider>
    </QueryProvider>,
  );
};

describe('Signup コンポーネントのテスト', () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockPush.mockClear();
    jest.mocked(signUp).mockReset();
  });

  test('バリデーションエラーが表示されること', async () => {
    renderSignup();

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'ユーザー登録' })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: '登録する' }));

    expect(await screen.findByText('有効なメールアドレスを入力してください')).toBeInTheDocument();
    expect(screen.getByText('8文字以上で入力してください')).toBeInTheDocument();
    expect(screen.getByText('確認用パスワードを入力してください')).toBeInTheDocument();
    expect(signUp).not.toHaveBeenCalled();
  });

  test('signUp 成功時に確認画面へ遷移すること', async () => {
    jest.mocked(signUp).mockResolvedValue({
      isSignUpComplete: false,
      nextStep: {
        signUpStep: 'CONFIRM_SIGN_UP',
        codeDeliveryDetails: { deliveryMedium: 'EMAIL', destination: 'u***@example.com' },
      },
    });

    renderSignup();
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'ユーザー登録' })).toBeInTheDocument();
    });

    await userEvent.type(screen.getByRole('textbox', { name: /メールアドレス/ }), 'user@example.com');
    await userEvent.type(screen.getByLabelText('パスワード'), 'password1');
    await userEvent.type(screen.getByLabelText('パスワード（確認用）'), 'password1');
    await userEvent.click(screen.getByRole('button', { name: '登録する' }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/confirm-signup?email=user%40example.com');
    });
  });
});
