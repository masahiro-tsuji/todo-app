import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MuiProvider } from '@/components';
import type { Todo } from '@/types';
import { TodoList } from '../index';

const initialTodos: Todo[] = [
  { id: '1', title: '要件定義' },
  { id: '2', title: '基本設計' },
  { id: '3', title: '詳細設計' },
  { id: '4', title: '開発' },
  { id: '5', title: 'テスト' },
];

const renderTodoList = (todos: Todo[] = initialTodos) => {
  const onDelete = jest.fn();

  const result = render(
    <MuiProvider>
      <TodoList todos={todos} onDelete={onDelete} />
    </MuiProvider>,
  );

  return { ...result, onDelete };
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

  test('削除ボタンでonDeleteが呼ばれること', async () => {
    const user = userEvent.setup();
    const { onDelete } = renderTodoList();

    await user.click(screen.getByRole('button', { name: 'テストを削除' }));

    expect(onDelete).toHaveBeenCalledWith('5');
  });
});
