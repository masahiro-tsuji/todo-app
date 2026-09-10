'use client';

import { Box, Paper, type SxProps, Typography } from '@mui/material';
import { Suspense } from 'react';
import { LoadingIndicator } from '@/components';
import { TrashList } from '@/features/trash-list';

const boxProps: SxProps = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  py: 4,
};

const titleSx: SxProps = { textAlign: 'center', fontWeight: 'bold', fontSize: 18, mb: 2 };

export default function TrashPage() {
  return (
    <Box sx={boxProps}>
      <Paper elevation={3} sx={{ width: '100%', maxWidth: '900px', m: 1, p: 1 }}>
        <Typography variant='h1' component='h1' sx={titleSx}>
          ゴミ箱
        </Typography>
        <Suspense fallback={<LoadingIndicator />}>
          <TrashList />
        </Suspense>
      </Paper>
    </Box>
  );
}
