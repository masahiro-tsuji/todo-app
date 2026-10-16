'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormControlLabel } from '@mui/material';
import { type Control, Controller, FormProvider, useForm } from 'react-hook-form';
import type { UpdateTodoRequestBody } from '@/api/updateTodo';
import { Checkbox, Dialog, TodoInputForm } from '@/components';
import { useUpdateTodo } from '@/hooks';
import type { Todo } from '@/types';
import { type EditTodoFormType, editTodoFormSchema } from './types';

type Props = {
  todo: Todo | null;
  isOpen: boolean;
  onClose: () => void;
};

type CompletedCheckboxProps = { control: Control<EditTodoFormType> };

const emptyValues: EditTodoFormType = { title: '', detail: '', completed: false };

const CompletedCheckbox = ({ control }: CompletedCheckboxProps) => (
  <Controller
    name='completed'
    control={control}
    render={({ field: { value, onChange, ref, ...field } }) => (
      <FormControlLabel
        control={<Checkbox {...field} ref={ref} checked={value} onChange={(_, checked) => onChange(checked)} />}
        label='完了にする'
      />
    )}
  />
);

export const EditTodo = ({ todo, isOpen, onClose }: Props) => {
  const { isPendingUpdateTodo, updateTodo } = useUpdateTodo();
  const methods = useForm<EditTodoFormType>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: zodResolver(editTodoFormSchema),
    values: todo ? { title: todo.title, detail: todo.detail ?? '', completed: false } : emptyValues,
    resetOptions: { keepErrors: false, keepDirty: false, keepTouched: false, keepIsSubmitted: false },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { dirtyFields },
  } = methods;

  const handleClose = () => {
    onClose();
    reset(emptyValues);
  };

  const onSubmit = async (data: EditTodoFormType) => {
    if (!todo) return;

    const body: UpdateTodoRequestBody = {};
    if (dirtyFields.title) body.title = data.title;
    if (dirtyFields.detail) body.detail = data.detail;
    if (dirtyFields.completed && data.completed) body.completed = true;

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
        <CompletedCheckbox control={control} />
      </FormProvider>
    </Dialog>
  );
};
