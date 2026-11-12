'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Link, Paper, TextField, Typography } from '@mui/material';
import NextLink from 'next/link';
import { useForm } from 'react-hook-form';
import { Button } from '@/components';
import { routes } from '@/constants/routes';
import { useConfirmSignUp } from '@/hooks';
import { type ConfirmSignupForm, confirmSignupFormSchema } from './types';

export const ConfirmSignup = () => {
  const { isLoading, errorMessage, email, confirmSignUp } = useConfirmSignUp();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConfirmSignupForm>({
    mode: 'all',
    resolver: zodResolver(confirmSignupFormSchema),
    defaultValues: { code: '' },
  });

  const onConfirm = async ({ code }: ConfirmSignupForm) => {
    await confirmSignUp(code);
  };

  return (
    <Paper sx={{ width: '100%', maxWidth: 400, p: 4 }}>
      <Typography variant='h5' component='h1' sx={{ mb: 3, textAlign: 'center' }}>
        メール確認
      </Typography>
      <Typography variant='body2' sx={{ mb: 2, textAlign: 'center' }}>
        {email
          ? `${email} に届いた6桁の確認コードを入力してください`
          : 'メールに届いた6桁の確認コードを入力してください'}
      </Typography>
      <Box
        component='form'
        onSubmit={handleSubmit(onConfirm)}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <TextField
          label='確認コード'
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
        <Button name='確認' type='submit' variant='contained' fullWidth loading={isLoading} disabled={!email} />
        <Link component={NextLink} href={routes.login} variant='body2' sx={{ textAlign: 'center' }}>
          ログイン画面へ
        </Link>
        {!email && (
          <Link component={NextLink} href={routes.signup} variant='body2' sx={{ textAlign: 'center' }}>
            登録画面へ
          </Link>
        )}
      </Box>
    </Paper>
  );
};
