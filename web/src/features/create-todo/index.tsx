'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { TextField } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Dialog } from '@/components';
import { useCreateTodo } from '@/hooks';
import { type CreateTodoForm, createTodoFormSchema } from './types';

export const CreateTodo = () => {
  const { isPendingCreateTodo, createTodo } = useCreateTodo();
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, touchedFields, isSubmitted },
  } = useForm<CreateTodoForm>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: zodResolver(createTodoFormSchema),
    defaultValues: { title: '', detail: '' },
  });
  const { ref: titleRef, ...titleField } = register('title');
  const { ref: detailRef, ...detailField } = register('detail');

  const resetForm = () => {
    reset(
      { title: '', detail: '' },
      { keepErrors: false, keepDirty: false, keepTouched: false, keepIsSubmitted: false },
    );
  };

  const handleOpen = () => {
    resetForm();
    setOpen(true);
  };

  const handleClose = () => {
    resetForm();
    setOpen(false);
  };

  const onSubmit = async (data: CreateTodoForm) => {
    const params = { title: data.title, detail: data.detail };
    await createTodo(params, { onSuccess: () => handleClose() });
  };

  return (
    <>
      <Button name='登録' variant='contained' onClick={handleOpen} />
      <Dialog
        open={open}
        title='TODO登録'
        primaryButtonName='登録'
        onClose={handleClose}
        onPrimaryClick={handleSubmit(onSubmit)}
        primaryLoading={isPendingCreateTodo}
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
    </>
  );
};
