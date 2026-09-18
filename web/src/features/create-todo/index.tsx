'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Button, Dialog, TodoInputForm, type TodoInputFormType, todoInputFormSchema } from '@/components';

import { useCreateTodo } from '@/hooks';

export const CreateTodo = () => {
  const { isPendingCreateTodo, createTodo } = useCreateTodo();
  const [open, setOpen] = useState(false);
  const methods = useForm<TodoInputFormType>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: zodResolver(todoInputFormSchema),
    defaultValues: { title: '', detail: '' },
  });
  const { handleSubmit, reset } = methods;

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

  const onSubmit = async (data: TodoInputFormType) => {
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
        <FormProvider {...methods}>
          <TodoInputForm />
        </FormProvider>
      </Dialog>
    </>
  );
};
