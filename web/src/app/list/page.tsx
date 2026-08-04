'use client';

import { Box, Paper, type SxProps, Typography } from '@mui/material';
import { useState } from 'react';
import { CreateTodo } from '@/features/create-todo';
import { TodoList } from '@/features/todo-list';
import type { Todo } from '@/types';

const boxProps: SxProps = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  py: 4,
};
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
    <Box sx={boxProps}>
      <Paper elevation={3} sx={{ width: '100%', maxWidth: '600px', m: 1, p: 1 }}>
        <Typography variant="h1" component="h1" sx={{ textAlign: 'center' }}>
          TODO一覧
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <CreateTodo onAdd={handleAdd} />
        </Box>
        <TodoList todos={todos} onDelete={handleDelete} />
      </Paper>
    </Box>
  );
}
