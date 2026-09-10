'use client';

import { Box, Paper, type SxProps, Typography } from '@mui/material';
import { Suspense } from 'react';
import { LoadingIndicator } from '@/components';
import { CreateTodo } from '@/features/create-todo';
import { TodoList } from '@/features/todo-list';

const boxProps: SxProps = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  py: 4,
};

export default function ListPage() {
  return (
    <Box sx={boxProps}>
      <Paper elevation={3} sx={{ width: '100%', maxWidth: '900px', m: 1, p: 1 }}>
        <Typography variant='h1' component='h1' sx={{ textAlign: 'center' }}>
          TODO一覧
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <CreateTodo />
        </Box>
        <Suspense fallback={<LoadingIndicator />}>
          <TodoList />
        </Suspense>
      </Paper>
    </Box>
  );
}
