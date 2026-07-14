import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MuiProvider } from '@/components';
import { TodoList } from '../index';

const renderTodoList = () => {
  return render(
    <MuiProvider>
      <TodoList />
    </MuiProvider>,
  );
};

describe('TodoList コンポーネントのテスト', () => {
  test('TODO一覧が表示されること', () => {
    renderTodoList();

    expect(screen.getByRole('heading', { name: 'TODO一覧' })).toBeInTheDocument();
    expect(screen.getByText('要件定義')).toBeInTheDocument();
    expect(screen.getByText('基本設計')).toBeInTheDocument();
    expect(screen.getByText('詳細設計')).toBeInTheDocument();
    expect(screen.getByText('開発')).toBeInTheDocument();
    expect(screen.getByText('テスト')).toBeInTheDocument();
  });

  test('各TODOに編集・削除ボタンが表示されること', () => {
    renderTodoList();

    expect(screen.getByRole('button', { name: '要件定義を編集' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '要件定義を削除' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'テストを編集' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'テストを削除' })).toBeInTheDocument();
  });

  test('削除ボタンでTODOを削除できること', async () => {
    const user = userEvent.setup();
    renderTodoList();

    await user.click(screen.getByRole('button', { name: 'テストを削除' }));

    expect(screen.queryByText('テスト')).not.toBeInTheDocument();
    expect(screen.getByText('開発')).toBeInTheDocument();
  });
});
