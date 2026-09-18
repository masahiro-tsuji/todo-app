'use client';
import { useFormContext } from 'react-hook-form';
import { TextField } from '@/components';
import type { TodoInputFormType } from './types/Schema';

export const TodoInputForm = () => {
  const {
    register,
    formState: { errors, touchedFields, isSubmitted },
  } = useFormContext<TodoInputFormType>();

  const { ref: titleRef, ...titleField } = register('title');
  const { ref: detailRef, ...detailField } = register('detail');

  return (
    <>
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
    </>
  );
};
