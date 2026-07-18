'use client';
import { ThemeProvider } from '@mui/material';
import { theme } from '@/../theme';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';

import { ReactNode } from 'react';

export const MuiProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </AppRouterCacheProvider>
  );
};
