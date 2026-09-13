'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import type { UpdateTodoRequestBody } from '@/api/updateTodo';
import { Dialog } from '@/components';
import { useUpdateTodo } from '@/hooks';
import type { Todo } from '@/types';
import { type EditTodoForm, editTodoFormSchema } from './types/Schema';

type Props = {
  todo: Todo | null;
  isOpen: boolean;
  onClose: () => void;
};

const emptyValues: EditTodoForm = { title: '', detail: '' };

export const EditTodo = ({ todo, isOpen, onClose }: Props) => {
  const { isPendingUpdateTodo, updateTodo } = useUpdateTodo();
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isSubmitted, dirtyFields },
  } = useForm<EditTodoForm>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: zodResolver(editTodoFormSchema),
    defaultValues: emptyValues,
    values: todo ? { title: todo.title, detail: todo.detail ?? '' } : emptyValues,
    resetOptions: { keepErrors: false, keepDirty: false, keepTouched: false, keepIsSubmitted: false },
  });
  const { ref: titleRef, ...titleField } = register('title');
  const { ref: detailRef, ...detailField } = register('detail');

  const handleClose = () => {
    onClose();
  };

  const onSubmit = async (data: EditTodoForm) => {
    if (!todo) return;

    const body: UpdateTodoRequestBody = {};
    if (dirtyFields.title) body.title = data.title;
    if (dirtyFields.detail) body.detail = data.detail;

    if (Object.keys(body).length === 0) {
      handleClose();
      return;
    }

    await updateTodo({ id: todo.id, body }, { onSuccess: () => handleClose() });
  };

  return (
    <Dialog
      open={isOpen}
      title='TODO編集'
      primaryButtonName='更新'
      onClose={handleClose}
      onPrimaryClick={handleSubmit(onSubmit)}
      primaryLoading={isPendingUpdateTodo}
    >
      <TextField
        {...titleField}
        slotProps={{ htmlInput: { ref: titleRef } }}
        label='タイトル'
        error={!!errors.title && (touchedFields.title || isSubmitted)}
        helperText={touchedFields.title || isSubmitted ? errors.title?.message : undefined}
        fullWidth
      />
      <TextField
        {...detailField}
        slotProps={{ htmlInput: { ref: detailRef } }}
        label='詳細'
        error={!!errors.detail && (touchedFields.detail || isSubmitted)}
        helperText={touchedFields.detail || isSubmitted ? errors.detail?.message : undefined}
        fullWidth
        multiline
        minRows={3}
      />
    </Dialog>
  );
};
