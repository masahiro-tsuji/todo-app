'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Paper, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { Button } from '@/components';
import { useAuth } from '@/hooks';
import { type LoginForm, loginFormSchema } from './types';

export const Login = () => {
  const { isLoading, errorMessage, login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    mode: 'all',
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: '', password: '' },
  });

  const onLogin = async ({ email, password }: LoginForm) => {
    await login(email, password);
  };

  return (
    <Paper sx={{ width: '100%', maxWidth: 400, p: 4 }}>
      <Typography variant="h5" component="h1" sx={{ mb: 3, textAlign: 'center' }}>
        ログイン
      </Typography>
      <Box component="form" onSubmit={handleSubmit(onLogin)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="メールアドレス"
          type="email"
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
          fullWidth
          autoComplete="email"
        />
        <TextField
          label="パスワード"
          type="password"
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
          fullWidth
          autoComplete="current-password"
        />
        {errorMessage && (
          <Typography color="error" variant="body2">
            {errorMessage}
          </Typography>
        )}
        <Button name="ログイン" type="submit" variant="contained" fullWidth loading={isLoading} />
      </Box>
    </Paper>
  );
};
