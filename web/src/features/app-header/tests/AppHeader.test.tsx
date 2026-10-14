import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockReplace = jest.fn();
const mockPathname = jest.fn(() => '/list');

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace, push: jest.fn() }),
  usePathname: () => mockPathname(),
  useServerInsertedHTML: () => {},
}));

jest.mock('aws-amplify/auth', () => ({
  signOut: jest.fn(),
  fetchAuthSession: jest.fn(),
}));

import { fetchAuthSession, signOut } from 'aws-amplify/auth';
import { ConfirmDialogProvider, MuiProvider, QueryProvider } from '@/components';
import { AppHeader } from '../index';

const renderAppHeader = () => {
  return render(
    <QueryProvider>
      <ConfirmDialogProvider>
        <MuiProvider>
          <AppHeader />
        </MuiProvider>
      </ConfirmDialogProvider>
    </QueryProvider>,
  );
};

const authenticatedSession = {
  tokens: {
    idToken: { payload: {}, toString: () => 'token' },
    accessToken: { payload: {}, toString: () => 'token' },
  },
};

describe('AppHeader コンポーネントのテスト', () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockPathname.mockReturnValue('/list');
    jest.mocked(fetchAuthSession).mockResolvedValue({ tokens: undefined });
    jest.mocked(signOut).mockResolvedValue(undefined);
  });

  test('/login ではヘッダーメニューが表示されないこと', async () => {
    mockPathname.mockReturnValue('/login');

    renderAppHeader();

    await waitFor(() => {
      expect(screen.queryByRole('link', { name: 'TODO一覧' })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: '完了済み' })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: 'ゴミ箱' })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: '設定' })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'ログアウト' })).not.toBeInTheDocument();
    });
  });

  test('未ログイン時はヘッダーメニューが表示されないこと', async () => {
    renderAppHeader();

    await waitFor(() => {
      expect(screen.queryByRole('link', { name: 'TODO一覧' })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: '完了済み' })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: 'ゴミ箱' })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: '設定' })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'ログアウト' })).not.toBeInTheDocument();
    });
  });

  test('/list かつログイン中はTODO一覧・完了済み・ゴミ箱・設定・ログアウトのテキストメニューが表示されること', async () => {
    jest.mocked(fetchAuthSession).mockResolvedValue(authenticatedSession);

    renderAppHeader();

    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'TODO一覧' })).toHaveAttribute('href', '/list');
      expect(screen.getByRole('link', { name: '完了済み' })).toHaveAttribute('href', '/completed');
      expect(screen.getByRole('link', { name: 'ゴミ箱' })).toHaveAttribute('href', '/trash');
      expect(screen.getByRole('link', { name: '設定' })).toHaveAttribute('href', '/settings');
      expect(screen.getByRole('button', { name: 'ログアウト' })).toBeInTheDocument();
    });
  });

  test('ログアウトリンククリックで signOut し /login へ遷移すること', async () => {
    jest.mocked(fetchAuthSession).mockResolvedValue(authenticatedSession);

    renderAppHeader();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'ログアウト' })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'ログアウト' }));

    await waitFor(() => {
      expect(screen.getByText('ログアウトしますか？')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'OK' }));

    await waitFor(() => {
      expect(signOut).toHaveBeenCalled();
      expect(mockReplace).toHaveBeenCalledWith('/login');
    });
  });
});
