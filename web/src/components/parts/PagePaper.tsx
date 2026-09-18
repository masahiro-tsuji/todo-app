'use client';

import { Box, Paper as MuiPaper, type PaperProps, type SxProps, Typography } from '@mui/material';
import { forwardRef } from 'react';

const wrapperSx: SxProps = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  py: 4,
};

const titleSx: SxProps = { textAlign: 'center', fontWeight: 'bold', fontSize: 18, mb: 2 };

type Props = {
  maxWidth: string;
  title: string;
} & Omit<PaperProps, 'title'>;

export const PagePaper = forwardRef<HTMLDivElement, Props>(
  ({ maxWidth, title, children, elevation = 3, sx, ...props }, ref) => {
    const baseSx = { width: '100%', maxWidth, m: 1, p: 1 };
    let paperSx: SxProps = baseSx;
    if (sx) paperSx = [baseSx, ...(Array.isArray(sx) ? sx : [sx])];

    return (
      <Box sx={wrapperSx}>
        <MuiPaper ref={ref} elevation={elevation} sx={paperSx} {...props}>
          <Typography variant='h1' component='h1' sx={titleSx}>
            {title}
          </Typography>
          {children}
        </MuiPaper>
      </Box>
    );
  },
);
