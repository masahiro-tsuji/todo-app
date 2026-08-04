'use client';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, IconButton, List, ListItem, ListItemText } from '@mui/material';
import type { Todo } from '@/types';

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
    <List>
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
          <ListItemText primary={todo.title} secondary={todo.detail} />
        </ListItem>
      ))}
    </List>
  );
};
