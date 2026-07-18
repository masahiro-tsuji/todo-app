'use client';

import { Box } from '@mui/material';
import { useState } from 'react';
import { CreateTodo } from '@/features/create-todo';
import { TodoList } from '@/features/todo-list';
import type { Todo } from '@/types';

const initialTodos: Todo[] = [
  { id: '1', title: '要件定義' },
  { id: '2', title: '基本設計' },
  { id: '3', title: '詳細設計' },
  { id: '4', title: '開発' },
  { id: '5', title: 'テスト' },
];

export default function ListPage() {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);

  const handleAdd = (title: string) => {
    setTodos((prev) => [...prev, { id: crypto.randomUUID(), title }]);
  };

  const handleDelete = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <TodoList todos={todos} onDelete={handleDelete} />
      <Box sx={{ position: 'fixed', bottom: 24, right: 24 }}>
        <CreateTodo onAdd={handleAdd} />
      </Box>
    </Box>
  );
}
