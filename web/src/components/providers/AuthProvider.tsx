'use client';

import { fetchAuthSession } from 'aws-amplify/auth';
import { usePathname, useRouter } from 'next/navigation';
import { type ReactNode, useEffect, useState } from 'react';
import { isGuestPath, isProtectedPath, routes } from '@/constants/routes';
import { LoadingIndicator } from '../parts';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const needsGuard = isProtectedPath(pathname) || isGuestPath(pathname);
    if (!needsGuard) {
      setIsChecking(false);
      return;
    }

    setIsChecking(true);

    fetchAuthSession()
      .then((session) => {
        const isAuthenticated = !!session.tokens?.idToken;
        if (isProtectedPath(pathname) && !isAuthenticated) router.replace(routes.login);
        else if (isGuestPath(pathname) && isAuthenticated) router.replace(routes.list);
        else setIsChecking(false);
      })
      .catch(() => {
        if (isProtectedPath(pathname)) router.replace(routes.login);
        else setIsChecking(false);
      });
  }, [pathname, router]);

  if (isChecking && (isProtectedPath(pathname) || isGuestPath(pathname))) return <LoadingIndicator />;

  return children;
};
