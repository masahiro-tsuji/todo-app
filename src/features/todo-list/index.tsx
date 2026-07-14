'use client';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, IconButton, List, ListItem, ListItemText, Paper, type SxProps, Typography } from '@mui/material';
import { useState } from 'react';
import { theme } from '../../../theme';
import type { Todo } from './types';

const boxProps: SxProps = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  minHeight: '100dvh',
  bgcolor: theme.grey.light,
  py: 4,
};

const initialTodos: Todo[] = [
  { id: '1', title: '要件定義' },
  { id: '2', title: '基本設計' },
  { id: '3', title: '詳細設計' },
  { id: '4', title: '開発' },
  { id: '5', title: 'テスト' },
];

export const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);

  const handleEdit = (_id: string) => {};

  const handleDelete = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return (
    <Box sx={boxProps}>
      <Paper elevation={3} sx={{ width: '100%', maxWidth: 600, p: 4 }}>
        <Typography variant="h5" component="h1" sx={{ mb: 3, textAlign: 'center' }}>
          TODO一覧
        </Typography>
        <List sx={{ p: 0 }}>
          {todos.map((todo) => (
            <ListItem
              key={todo.id}
              secondaryAction={
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <IconButton aria-label={`${todo.title}を編集`} onClick={() => handleEdit(todo.id)} size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton aria-label={`${todo.title}を削除`} onClick={() => handleDelete(todo.id)} size="small">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              }
              sx={{ borderBottom: 1, borderColor: 'divider', '&:last-child': { borderBottom: 0 } }}
            >
              <ListItemText primary={todo.title} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};
