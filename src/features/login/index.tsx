'use client';

import { Box, Paper, type SxProps, TextField, Typography } from '@mui/material';
import { type ChangeEvent, type SubmitEvent, useState } from 'react';
import { Button } from '@/components';
import { theme } from '../../../theme';

const boxProps: SxProps = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100dvh',
  bgcolor: theme.grey.light,
};

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <Box sx={boxProps}>
      <Paper elevation={3} sx={{ width: '100%', maxWidth: 400, p: 4 }}>
        <Typography variant="h5" component="h1" sx={{ mb: 3, textAlign: 'center' }}>
          ログイン
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="メールアドレス"
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
            fullWidth
            autoComplete="email"
          />
          <TextField
            label="パスワード"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
            fullWidth
            autoComplete="current-password"
          />
          <Button name="ログイン" type="submit" variant="contained" fullWidth />
        </Box>
      </Paper>
    </Box>
  );
};
