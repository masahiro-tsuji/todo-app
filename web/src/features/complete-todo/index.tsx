'use client';
import { Typography } from '@mui/material';
import { Dialog } from '@/components';
import { useUpdateTodo } from '@/hooks';
import type { Todo } from '@/types';

type Props = { todo: Todo | null; isOpen: boolean; onClose: () => void };

export const CompleteTodo = ({ todo, isOpen, onClose }: Props) => {
  const { isPendingUpdateTodo, updateTodo } = useUpdateTodo();
  const onClickComplete = async () => {
    if (!todo) return;
    await updateTodo({ id: todo.id, body: { completed: true } }, { onSuccess: () => onClose() });
  };

  return (
    <Dialog
      title='確認'
      primaryButtonName='完了'
      open={isOpen}
      primaryLoading={isPendingUpdateTodo}
      onPrimaryClick={onClickComplete}
      onClose={onClose}
      size='sm'
    >
      <Typography>「{todo?.title}」を完了にしますか？</Typography>
    </Dialog>
  );
};
