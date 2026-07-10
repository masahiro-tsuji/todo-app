import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MuiProvider } from '@/components';
import { Login } from '../index';

const renderLogin = () => {
  return render(
    <MuiProvider>
      <Login />
    </MuiProvider>,
  );
};

describe('Login コンポーネントのテスト', () => {
  test('ログインフォームが表示されること', () => {
    renderLogin();

    expect(screen.getByRole('heading', { name: 'ログイン' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /メールアドレス/ })).toBeInTheDocument();
    expect(screen.getByLabelText(/パスワード/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ログイン' })).toBeInTheDocument();
  });
});
