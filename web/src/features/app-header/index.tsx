'use client';

import { Box } from '@mui/material';
import { fetchAuthSession } from 'aws-amplify/auth';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components';
import { useAuth } from '@/hooks';

const guestPaths = ['/login', '/new-password'];

export const AppHeader = () => {
  const pathname = usePathname();
  const { logout, isLoading } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (guestPaths.includes(pathname)) {
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

  if (isChecking || !isAuthenticated || guestPaths.includes(pathname)) return null;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
      <Button name="ログアウト" variant="outlined" onClick={logout} loading={isLoading} />
    </Box>
  );
};
