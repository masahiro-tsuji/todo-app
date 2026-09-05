'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Link, Paper, TextField, Typography } from '@mui/material';
import NextLink from 'next/link';
import { useForm } from 'react-hook-form';
import { Button } from '@/components';
import { useAuth } from '@/hooks';
import { type MfaVerifyForm as MfaVerifyFormValues, mfaVerifyFormSchema } from './types';

export const MfaVerify = () => {
  const { confirmSignInStep, errorMessage, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MfaVerifyFormValues>({
    mode: 'all',
    resolver: zodResolver(mfaVerifyFormSchema),
    defaultValues: { code: '' },
  });

  const onSubmit = async ({ code }: MfaVerifyFormValues) => {
    await confirmSignInStep(code);
  };

  return (
    <Paper sx={{ width: '100%', maxWidth: 400, p: 4 }}>
      <Typography variant='h5' component='h1' sx={{ mb: 3, textAlign: 'center' }}>
        二要素認証
      </Typography>
      <Typography variant='body2' sx={{ mb: 2, textAlign: 'center' }}>
        認証アプリに表示された6桁のコードを入力してください
      </Typography>
      <Box component='form' onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label='認証コード'
          type='text'
          inputMode='numeric'
          autoComplete='one-time-code'
          {...register('code')}
          error={!!errors.code}
          helperText={errors.code?.message}
          fullWidth
        />
        {errorMessage && (
          <Typography color='error' variant='body2'>
            {errorMessage}
          </Typography>
        )}
        <Button name='確認' type='submit' variant='contained' fullWidth disabled={isLoading} />
        {errorMessage && (
          <Link component={NextLink} href='/login' variant='body2' sx={{ textAlign: 'center' }}>
            ログイン画面へ戻る
          </Link>
        )}
      </Box>
    </Paper>
  );
};
