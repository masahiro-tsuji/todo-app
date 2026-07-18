'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Paper, type SxProps, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components';
import { theme } from '../../../theme';
import { type LoginForm, loginFormSchema } from './types';

const boxProps: SxProps = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100dvh',
  bgcolor: theme.grey.light,
};

export const Login = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    mode: 'all',
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: '', password: '' },
  });

  // const onSubmit = (_data: LoginForm) => {
  //   router.push('/list');
  // };

  const onClick = () => router.push('/list');

  return (
    <Box sx={boxProps}>
      <Paper elevation={3} sx={{ width: '100%', maxWidth: 400, p: 4 }}>
        <Typography variant="h5" component="h1" sx={{ mb: 3, textAlign: 'center' }}>
          ログイン
        </Typography>
        <Box
          // component="form"
          // onSubmit={handleSubmit(onSubmit)}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
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
          <Button name="ログイン" type="submit" variant="contained" fullWidth onClick={onClick} />
        </Box>
      </Paper>
    </Box>
  );
};
