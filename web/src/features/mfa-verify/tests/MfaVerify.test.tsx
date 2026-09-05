import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { confirmSignIn } from 'aws-amplify/auth';
import { ConfirmDialogProvider, MuiProvider, QueryProvider } from '@/components';
import { MfaVerify } from '../index';

const mockReplace = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace, push: jest.fn() }),
  usePathname: () => '/mfa-verify',
  useServerInsertedHTML: () => {},
}));

jest.mock('aws-amplify/auth', () => ({
  confirmSignIn: jest.fn(),
  fetchAuthSession: jest.fn().mockResolvedValue({ tokens: undefined }),
}));

const renderMfaVerify = () => {
  return render(
    <QueryProvider>
      <ConfirmDialogProvider>
        <MuiProvider>
          <MfaVerify />
        </MuiProvider>
      </ConfirmDialogProvider>
    </QueryProvider>,
  );
};

describe('MfaVerify コンポーネントのテスト', () => {
  beforeEach(() => {
    mockReplace.mockClear();
    jest.mocked(confirmSignIn).mockReset();
  });

  test('認証コードフォームが表示されること', async () => {
    renderMfaVerify();

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: '二要素認証' })).toBeInTheDocument();
    });
    expect(screen.getByLabelText(/認証コード/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '確認' })).toBeInTheDocument();
  });

  test('confirmSignIn 成功時 /list へ遷移すること', async () => {
    jest.mocked(confirmSignIn).mockResolvedValue({ isSignedIn: true, nextStep: { signInStep: 'DONE' } });

    renderMfaVerify();
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: '二要素認証' })).toBeInTheDocument();
    });

    await userEvent.type(screen.getByLabelText(/認証コード/), '123456');
    await userEvent.click(screen.getByRole('button', { name: '確認' }));

    await waitFor(() => {
      expect(confirmSignIn).toHaveBeenCalledWith({ challengeResponse: '123456' });
      expect(mockReplace).toHaveBeenCalledWith('/list');
    });
  });

  test('confirmSignIn 失敗時エラーとログイン画面へのリンクが表示されること', async () => {
    jest.mocked(confirmSignIn).mockRejectedValue(new Error('サインインセッションがありません'));

    renderMfaVerify();
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: '二要素認証' })).toBeInTheDocument();
    });

    await userEvent.type(screen.getByLabelText(/認証コード/), '123456');
    await userEvent.click(screen.getByRole('button', { name: '確認' }));

    await waitFor(() => {
      expect(screen.getByText('サインインセッションがありません')).toBeInTheDocument();
    });
    expect(screen.getByRole('link', { name: 'ログイン画面へ戻る' })).toHaveAttribute('href', '/login');
  });
});
