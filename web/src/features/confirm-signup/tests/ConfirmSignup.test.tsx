import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { confirmSignUp } from 'aws-amplify/auth';
import { ConfirmDialogProvider, MuiProvider, QueryProvider } from '@/components';
import { ConfirmSignup } from '../index';

const mockReplace = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace, push: jest.fn() }),
  usePathname: () => '/confirm-signup',
  useSearchParams: () => new URLSearchParams('email=user@example.com'),
  useServerInsertedHTML: () => {},
}));

jest.mock('aws-amplify/auth', () => ({
  confirmSignUp: jest.fn(),
  fetchAuthSession: jest.fn().mockResolvedValue({ tokens: undefined }),
}));

const renderConfirmSignup = () => {
  return render(
    <QueryProvider>
      <ConfirmDialogProvider>
        <MuiProvider>
          <ConfirmSignup />
        </MuiProvider>
      </ConfirmDialogProvider>
    </QueryProvider>,
  );
};

describe('ConfirmSignup コンポーネントのテスト', () => {
  beforeEach(() => {
    mockReplace.mockClear();
    jest.mocked(confirmSignUp).mockReset();
  });

  test('confirmSignUp 成功時にログイン画面へ遷移すること', async () => {
    jest.mocked(confirmSignUp).mockResolvedValue({
      isSignUpComplete: true,
      nextStep: { signUpStep: 'DONE' },
    });

    renderConfirmSignup();
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'メール確認' })).toBeInTheDocument();
    });

    await userEvent.type(screen.getByRole('textbox', { name: /確認コード/ }), '123456');
    await userEvent.click(screen.getByRole('button', { name: '確認' }));

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/login');
    });
  });

  test('confirmSignUp 失敗時にエラーが表示されること', async () => {
    jest.mocked(confirmSignUp).mockRejectedValue(new Error('確認コードが正しくありません'));

    renderConfirmSignup();
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'メール確認' })).toBeInTheDocument();
    });

    await userEvent.type(screen.getByRole('textbox', { name: /確認コード/ }), '123456');
    await userEvent.click(screen.getByRole('button', { name: '確認' }));

    expect(await screen.findByText('確認コードが正しくありません')).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
