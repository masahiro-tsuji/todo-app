'use client';

import { useCallback, useState } from 'react';
import { PagePaper } from '@/components';
import { CompletedList } from '@/features/completed-list';
import { SoftDeleteTodo } from '@/features/soft-delete-todo';
import { UncompleteTodo } from '@/features/uncomplete-todo';
import type { Todo } from '@/types';

export default function CompletedPage() {
  const [deletingTodo, setDeletingTodo] = useState<Todo | null>(null);
  const [uncompletingTodo, setUncompletingTodo] = useState<Todo | null>(null);

  const onOpenUncompleteDialog = useCallback((todo: Todo) => setUncompletingTodo(todo), []);
  const onCloseUncompleteDialog = useCallback(() => setUncompletingTodo(null), []);

  const onOpenSoftDeleteDialog = useCallback((todo: Todo) => setDeletingTodo(todo), []);
  const onCloseSoftDeleteDialog = useCallback(() => setDeletingTodo(null), []);

  return (
    <>
      <PagePaper maxWidth='900px' title='完了済み一覧'>
        <CompletedList
          onOpenUncompleteDialog={onOpenUncompleteDialog}
          onOpenSoftDeleteDialog={onOpenSoftDeleteDialog}
        />
      </PagePaper>
      <UncompleteTodo todo={uncompletingTodo} isOpen={!!uncompletingTodo} onClose={onCloseUncompleteDialog} />
      <SoftDeleteTodo todo={deletingTodo} isOpen={!!deletingTodo} onClose={onCloseSoftDeleteDialog} />
    </>
  );
}
