'use client';

import { Box, type LinkProps, Link as MuiLink } from '@mui/material';
import { fetchAuthSession } from 'aws-amplify/auth';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isGuestPath, routes } from '@/constants/routes';
import { useAuth } from '@/hooks';
import { theme } from '../../../theme';

/** ヘッダーのスタイル */
const headerSx = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  px: 2,
  py: 1.5,
  bgcolor: theme.blue.dark,
};

/** ヘッダー内のリンクグループのスタイル */
const navGroupSx = { display: 'flex', alignItems: 'center', gap: 3 };

/** ログアウトリンクのスタイル */
const logoutLinkSx = {
  color: theme.red.main,
  fontSize: theme.typography.fontSize ?? 14,
  fontWeight: 'bold',
  cursor: 'pointer',
  '&:hover': { color: theme.red.light },
  border: 'none',
  bgcolor: 'transparent',
  fontFamily: 'inherit',
};

const Link = ({ children, ...props }: LinkProps) => {
  return (
    <MuiLink
      component={NextLink}
      underline='hover'
      sx={{
        color: theme.header.link,
        fontSize: theme.typography.fontSize ?? 14,
        fontWeight: 'bold',
        cursor: 'pointer',
        '&:hover': { color: theme.blue.light },
      }}
      {...props}
    >
      {children}
    </MuiLink>
  );
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
    <Box component='header' sx={headerSx}>
      <Box sx={navGroupSx}>
        <Link href={routes.list}>TODO一覧</Link>
        <Link href={routes.trash}>ゴミ箱</Link>
      </Box>
      <Box sx={navGroupSx}>
        <Link href={routes.settings}>設定</Link>
        <MuiLink component='button' underline='hover' onClick={logout} disabled={isLoading} sx={logoutLinkSx}>
          ログアウト
        </MuiLink>
      </Box>
    </Box>
  );
};
