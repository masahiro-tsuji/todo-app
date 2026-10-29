'use client';
import { Typography } from '@mui/material';
import { Dialog } from '@/components';
import { useUpdateTodo } from '@/hooks';
import type { Todo } from '@/types';

type Props = { todo: Todo | null; isOpen: boolean; onClose: () => void };

export const UncompleteTodo = ({ todo, isOpen, onClose }: Props) => {
  const { isPendingUpdateTodo, updateTodo } = useUpdateTodo();
  const onClickUncomplete = async () => {
    if (!todo) return;
    await updateTodo({ id: todo.id, body: { completed: false } }, { onSuccess: () => onClose() });
  };

  return (
    <Dialog
      title='確認'
      primaryButtonName='未完了にする'
      open={isOpen}
      primaryLoading={isPendingUpdateTodo}
      onPrimaryClick={onClickUncomplete}
      onClose={onClose}
      size='sm'
    >
      <Typography>「{todo?.title}」を未完了にしますか？</Typography>
    </Dialog>
  );
};
