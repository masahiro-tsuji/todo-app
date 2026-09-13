'use client';

import { Box, Paper, type SxProps, Typography } from '@mui/material';
import { Suspense, useCallback, useState } from 'react';
import { LoadingIndicator } from '@/components';
import { CreateTodo } from '@/features/create-todo';
import { EditTodo } from '@/features/edit-todo';
import { SoftDeleteTodo } from '@/features/soft-delete-todo';
import { TodoList } from '@/features/todo-list';
import type { Todo } from '@/types';

const boxProps: SxProps = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  py: 4,
};

export default function ListPage() {
  const [deletingTodo, setDeletingTodo] = useState<Todo | null>(null);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const onOpenEditDialog = useCallback((todo: Todo) => setEditingTodo(todo), []);
  const onCloseEditDialog = useCallback(() => setEditingTodo(null), []);

  const onOpenSoftDeleteDialog = useCallback((todo: Todo) => setDeletingTodo(todo), []);
  const onCloseSoftDeleteDialog = useCallback(() => setDeletingTodo(null), []);

  return (
    <>
      <Box sx={boxProps}>
        <Paper elevation={3} sx={{ width: '100%', maxWidth: '900px', m: 1, p: 1 }}>
          <Typography variant='h1' component='h1' sx={{ textAlign: 'center' }}>
            TODO一覧
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <CreateTodo />
          </Box>
          <Suspense fallback={<LoadingIndicator />}>
            <TodoList onOpenEditDialog={onOpenEditDialog} onOpenSoftDeleteDialog={onOpenSoftDeleteDialog} />
          </Suspense>
        </Paper>
      </Box>
      <EditTodo todo={editingTodo} isOpen={!!editingTodo} onClose={onCloseEditDialog} />
      <SoftDeleteTodo todo={deletingTodo} isOpen={!!deletingTodo} onClose={onCloseSoftDeleteDialog} />
    </>
  );
}
