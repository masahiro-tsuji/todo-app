'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import type { UpdateTodoRequestBody } from '@/api/updateTodo';
import { Dialog, TodoInputForm, type TodoInputFormType, todoInputFormSchema } from '@/components';
import { useUpdateTodo } from '@/hooks';
import type { Todo } from '@/types';

type Props = {
  todo: Todo | null;
  isOpen: boolean;
  onClose: () => void;
};

const emptyValues: TodoInputFormType = { title: '', detail: '' };

export const EditTodo = ({ todo, isOpen, onClose }: Props) => {
  const { isPendingUpdateTodo, updateTodo } = useUpdateTodo();
  const methods = useForm<TodoInputFormType>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: zodResolver(todoInputFormSchema),
    values: todo ? { title: todo.title, detail: todo.detail ?? '' } : emptyValues,
    resetOptions: { keepErrors: false, keepDirty: false, keepTouched: false, keepIsSubmitted: false },
  });

  const {
    handleSubmit,
    reset,
    formState: { dirtyFields },
  } = methods;

  const handleClose = () => {
    onClose();
    reset(emptyValues);
  };

  const onSubmit = async (data: TodoInputFormType) => {
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
      <FormProvider {...methods}>
        <TodoInputForm />
      </FormProvider>
    </Dialog>
  );
};
