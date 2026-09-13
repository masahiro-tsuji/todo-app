'use client';
import { Typography } from '@mui/material';
import { Dialog } from '@/components';
import { useSoftDelete } from '@/hooks';
import type { Todo } from '@/types';

type Props = { todo: Todo | null; isOpen: boolean; onClose: () => void };

export const SoftDeleteTodo = ({ todo, isOpen, onClose }: Props) => {
  const { isPendingSoftDelete, softDelete } = useSoftDelete();
  const onClickDelete = async () => {
    if (!todo) return;
    await softDelete(todo.id, { onSuccess: () => onClose() });
  };

  return (
    <Dialog
      title='ゴミ箱に移動'
      primaryButtonName='削除'
      open={isOpen}
      primaryLoading={isPendingSoftDelete}
      onPrimaryClick={onClickDelete}
      onClose={onClose}
      size='sm'
    >
      <Typography>「{todo?.title}」をゴミ箱に移動しますか？</Typography>
    </Dialog>
  );
};
