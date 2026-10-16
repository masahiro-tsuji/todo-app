'use client';

import { Box } from '@mui/material';
import { useCallback, useState } from 'react';
import { PagePaper } from '@/components';
import { CompleteTodo } from '@/features/complete-todo';
import { CreateTodo } from '@/features/create-todo';
import { EditTodo } from '@/features/edit-todo';
import { SoftDeleteTodo } from '@/features/soft-delete-todo';
import { TodoList } from '@/features/todo-list';
import type { Todo } from '@/types';

export default function ListPage() {
  const [deletingTodo, setDeletingTodo] = useState<Todo | null>(null);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [completingTodo, setCompletingTodo] = useState<Todo | null>(null);

  const onOpenEditDialog = useCallback((todo: Todo) => setEditingTodo(todo), []);
  const onCloseEditDialog = useCallback(() => setEditingTodo(null), []);

  const onOpenCompleteDialog = useCallback((todo: Todo) => setCompletingTodo(todo), []);
  const onCloseCompleteDialog = useCallback(() => setCompletingTodo(null), []);

  const onOpenSoftDeleteDialog = useCallback((todo: Todo) => setDeletingTodo(todo), []);
  const onCloseSoftDeleteDialog = useCallback(() => setDeletingTodo(null), []);

  return (
    <>
      <PagePaper maxWidth='900px' title='TODO一覧'>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <CreateTodo />
        </Box>
        <TodoList
          onOpenEditDialog={onOpenEditDialog}
          onOpenCompleteDialog={onOpenCompleteDialog}
          onOpenSoftDeleteDialog={onOpenSoftDeleteDialog}
        />
      </PagePaper>
      <EditTodo todo={editingTodo} isOpen={!!editingTodo} onClose={onCloseEditDialog} />
      <CompleteTodo todo={completingTodo} isOpen={!!completingTodo} onClose={onCloseCompleteDialog} />
      <SoftDeleteTodo todo={deletingTodo} isOpen={!!deletingTodo} onClose={onCloseSoftDeleteDialog} />
    </>
  );
}
