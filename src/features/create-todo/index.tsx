'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components';
import { type CreateTodoForm, createTodoFormSchema } from './types';

type Props = {
  onAdd: (title: string) => void;
};

export const CreateTodo = ({ onAdd }: Props) => {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTodoForm>({
    mode: 'all',
    resolver: zodResolver(createTodoFormSchema),
    defaultValues: { title: '' },
  });
  const { ref, ...titleField } = register('title');

  const handleOpen = () => {
    reset({ title: '' });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = (data: CreateTodoForm) => {
    onAdd(data.title);
    handleClose();
  };

  return (
    <>
      <Button name="登録" variant="contained" onClick={handleOpen} />
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>TODO登録</DialogTitle>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <TextField
              {...titleField}
              slotProps={{ htmlInput: { ref } }}
              label="タイトル"
              error={!!errors.title}
              helperText={errors.title?.message}
              fullWidth
              autoFocus
            />
          </DialogContent>
          <DialogActions>
            <Button name="キャンセル" type="button" onClick={handleClose} />
            <Button name="登録" type="submit" variant="contained" />
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};
