'use client';

import { Box, Link } from '@mui/material';
import { fetchAuthSession } from 'aws-amplify/auth';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isGuestPath, routes } from '@/constants/routes';
import { useAuth } from '@/hooks';
import { theme } from '../../../theme';

const headerLinkSx = {
  color: theme.header.link,
  fontSize: theme.typography.fontSize ?? 14,
  fontWeight: 'bold',
  cursor: 'pointer',
  '&:hover': { color: theme.blue.light },
};

const logoutLinkSx = {
  color: theme.red.main,
  fontSize: theme.typography.fontSize ?? 14,
  fontWeight: 'bold',
  cursor: 'pointer',
  '&:hover': { color: theme.red.light },
};

export const AppHeader = () => {
  const pathname = usePathname();
  const { logout, isLoading } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (isGuestPath(pathname)) {
      setIsAuthenticated(false);
      setIsChecking(false);
      return;
    }
    setIsChecking(true);
    fetchAuthSession()
      .then((session) => setIsAuthenticated(!!session.tokens?.idToken))
      .catch(() => setIsAuthenticated(false))
      .finally(() => setIsChecking(false));
  }, [pathname]);

  if (isChecking || !isAuthenticated || isGuestPath(pathname)) return null;

  return (
    <Box
      component='header'
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 3,
        px: 2,
        py: 1.5,
        bgcolor: theme.blue.dark,
      }}
    >
      <Link component={NextLink} href={routes.settings} underline='hover' sx={headerLinkSx}>
        設定
      </Link>
      <Link
        component='button'
        type='button'
        underline='hover'
        onClick={logout}
        disabled={isLoading}
        sx={{
          ...logoutLinkSx,
          border: 'none',
          bgcolor: 'transparent',
          fontFamily: 'inherit',
          opacity: isLoading ? 0.6 : 1,
        }}
      >
        ログアウト
      </Link>
    </Box>
  );
};
