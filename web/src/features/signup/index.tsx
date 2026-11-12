'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Link, Paper, TextField, Typography } from '@mui/material';
import NextLink from 'next/link';
import { useForm } from 'react-hook-form';
import { Button } from '@/components';
import { routes } from '@/constants/routes';
import { useSignUp } from '@/hooks';
import { type SignupForm, signupFormSchema } from './types';

export const Signup = () => {
  const { isLoading, errorMessage, signUp } = useSignUp();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    mode: 'all',
    resolver: zodResolver(signupFormSchema),
    defaultValues: { email: '', password: '', passwordConfirm: '' },
  });

  const onSignup = async ({ email, password }: SignupForm) => {
    await signUp(email, password);
  };

  return (
    <Paper sx={{ width: '100%', maxWidth: 400, p: 4 }}>
      <Typography variant='h5' component='h1' sx={{ mb: 3, textAlign: 'center' }}>
        ユーザー登録
      </Typography>
      <Box component='form' onSubmit={handleSubmit(onSignup)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label='メールアドレス'
          type='email'
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
          fullWidth
          autoComplete='email'
        />
        <TextField
          label='パスワード'
          type='password'
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message ?? '8文字以上・小文字・数字を含めてください'}
          fullWidth
          autoComplete='new-password'
        />
        <TextField
          label='パスワード（確認用）'
          type='password'
          {...register('passwordConfirm')}
          error={!!errors.passwordConfirm}
          helperText={errors.passwordConfirm?.message}
          fullWidth
          autoComplete='new-password'
        />
        {errorMessage && (
          <Typography color='error' variant='body2'>
            {errorMessage}
          </Typography>
        )}
        <Button name='登録する' type='submit' variant='contained' fullWidth loading={isLoading} />
        <Link component={NextLink} href={routes.login} variant='body2' sx={{ textAlign: 'center' }}>
          ログイン画面へ
        </Link>
      </Box>
    </Paper>
  );
};
