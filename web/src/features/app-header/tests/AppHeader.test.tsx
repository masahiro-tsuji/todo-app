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
import { MuiProvider, QueryProvider } from '@/components';
import { AppHeader } from '../index';

const renderAppHeader = () => {
  return render(
    <QueryProvider>
      <MuiProvider>
        <AppHeader />
      </MuiProvider>
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

  test('/login ではログアウトボタンが表示されないこと', async () => {
    mockPathname.mockReturnValue('/login');

    renderAppHeader();

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'ログアウト' })).not.toBeInTheDocument();
    });
  });

  test('未ログイン時はログアウトボタンが表示されないこと', async () => {
    renderAppHeader();

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'ログアウト' })).not.toBeInTheDocument();
    });
  });

  test('/list かつログイン中はログアウトボタンが表示されること', async () => {
    jest.mocked(fetchAuthSession).mockResolvedValue(authenticatedSession);

    renderAppHeader();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'ログアウト' })).toBeInTheDocument();
    });
  });

  test('ログアウトボタンクリックで signOut し /login へ遷移すること', async () => {
    jest.mocked(fetchAuthSession).mockResolvedValue(authenticatedSession);

    renderAppHeader();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'ログアウト' })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'ログアウト' }));

    await waitFor(() => {
      expect(signOut).toHaveBeenCalled();
      expect(mockReplace).toHaveBeenCalledWith('/login');
    });
  });
});
