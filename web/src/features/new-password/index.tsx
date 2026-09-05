'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Link, Paper, TextField, Typography } from '@mui/material';
import NextLink from 'next/link';
import { useForm } from 'react-hook-form';
import { Button } from '@/components';
import { useAuth } from '@/hooks';
import { type NewPasswordForm as NewPasswordFormValues, newPasswordFormSchema } from './types';

export const NewPassword = () => {
  const { confirmSignInStep, errorMessage, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewPasswordFormValues>({
    mode: 'all',
    resolver: zodResolver(newPasswordFormSchema),
    defaultValues: { newPassword: '' },
  });

  const onSubmit = async ({ newPassword }: NewPasswordFormValues) => {
    await confirmSignInStep(newPassword);
  };

  return (
    <Paper sx={{ width: '100%', maxWidth: 400, p: 4 }}>
      <Typography variant='h5' component='h1' sx={{ mb: 3, textAlign: 'center' }}>
        新しいパスワード
      </Typography>
      <Box component='form' onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label='新しいパスワード'
          type='password'
          {...register('newPassword')}
          error={!!errors.newPassword}
          helperText={errors.newPassword?.message ?? '8文字以上・小文字・数字を含めてください'}
          fullWidth
          autoComplete='new-password'
        />
        {errorMessage && (
          <Typography color='error' variant='body2'>
            {errorMessage}
          </Typography>
        )}
        <Button name='パスワードを設定' type='submit' variant='contained' fullWidth disabled={isLoading} />
        {errorMessage && (
          <Link component={NextLink} href='/login' variant='body2' sx={{ textAlign: 'center' }}>
            ログイン画面へ戻る
          </Link>
        )}
      </Box>
    </Paper>
  );
};
