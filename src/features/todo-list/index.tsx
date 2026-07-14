'use client';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, IconButton, List, ListItem, ListItemText, Paper, type SxProps, Typography } from '@mui/material';
import type { Todo } from '@/types';
import { theme } from '../../../theme';

const boxProps: SxProps = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  minHeight: '100dvh',
  bgcolor: theme.grey.light,
  py: 4,
};

type Props = {
  todos: Todo[];
  onDelete: (id: string) => void;
};

export const TodoList = ({ todos, onDelete }: Props) => {
  const handleEdit = (_id: string) => {};

  const handleDelete = (id: string) => {
    onDelete(id);
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
