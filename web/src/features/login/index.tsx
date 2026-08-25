'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Paper, TextField, Typography } from '@mui/material';
import { signIn } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components';
import { type LoginForm, loginFormSchema } from './types';

export const Login = () => {
  const router = useRouter();
  const {
    register,
    getValues,
    formState: { errors },
  } = useForm<LoginForm>({
    mode: 'all',
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: '', password: '' },
  });

  const onClick = async () => {
    const { email, password } = getValues();
    await signIn({ username: email, password: password });
    router.push('/list');
  };

  return (
    <Paper sx={{ width: '100%', maxWidth: 400, p: 4 }}>
      <Typography variant="h5" component="h1" sx={{ mb: 3, textAlign: 'center' }}>
        ログイン
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
        <Button name="ログイン" variant="contained" fullWidth onClick={onClick} />
      </Box>
    </Paper>
  );
};
