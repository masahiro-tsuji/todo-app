import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MuiProvider } from '@/components';

import { TodoList } from '../index';

const mockTodos = Array(5)
  .fill(0)
  .map((_, i) => ({ id: String(i), title: `タイトル${i}`, detail: `詳細${i}` }));

jest.mock('@/hooks/useGetTodos', () => ({
  useGetTodos: () => ({ data: mockTodos }),
}));

const renderTodoList = () => {
  const onDelete = jest.fn();

  const result = render(
    <MuiProvider>
      <TodoList onDelete={onDelete} />
    </MuiProvider>,
  );

  return { ...result, onDelete };
};

describe('TodoList コンポーネントのテスト', () => {
  test('TODO一覧が表示されること', () => {
    renderTodoList();
    mockTodos.forEach((element) => {
      expect(screen.getByText(element.title)).toBeInTheDocument();
    });
  });

  test('詳細が表示されること', () => {
    renderTodoList();
    mockTodos.forEach((element) => {
      expect(screen.getByText(element.detail)).toBeInTheDocument();
    });
  });

  test('各TODOに編集・削除ボタンが表示されること', () => {
    renderTodoList();
    mockTodos.forEach((element) => {
      expect(screen.getByRole('button', { name: `${element.title}を編集` })).toBeInTheDocument();
    });
    mockTodos.forEach((element) => {
      expect(screen.getByRole('button', { name: `${element.title}を削除` })).toBeInTheDocument();
    });
  });

  test('削除ボタンでonDeleteが呼ばれること', async () => {
    const user = userEvent.setup();
    const { onDelete } = renderTodoList();
    const target = mockTodos[4];

    await user.click(screen.getByRole('button', { name: `${target.title}を削除` }));

    expect(onDelete).toHaveBeenCalledWith(target.id);
  });
});
