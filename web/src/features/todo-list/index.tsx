'use client';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, IconButton, List, ListItem, ListItemText } from '@mui/material';
import { useGetTodos } from '@/hooks';

type Props = { onDelete: (todoId: string) => void };

export const TodoList = ({ onDelete }: Props) => {
  const { data: todos } = useGetTodos();

  const handleEdit = (_id: string) => {};

  const handleDelete = (todoId: string) => {
    onDelete(todoId);
  };

  return (
    <List>
      {todos.map((todo) => (
        <ListItem
          key={todo.todoId}
          secondaryAction={
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton aria-label={`${todo.title}を編集`} onClick={() => handleEdit(todo.todoId)} size="small">
                <EditIcon />
              </IconButton>
              <IconButton aria-label={`${todo.title}を削除`} onClick={() => handleDelete(todo.todoId)} size="small">
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
