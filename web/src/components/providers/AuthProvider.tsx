'use client';

import { fetchAuthSession } from 'aws-amplify/auth';
import { usePathname, useRouter } from 'next/navigation';
import { type ReactNode, useEffect, useState } from 'react';
import { DEFAULT_AUTH_PATH, DEFAULT_GUEST_PATH, isGuestPath, isProtectedPath } from '@/constants/routes';
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

        if (isProtectedPath(pathname) && !isAuthenticated) {
          router.replace(DEFAULT_GUEST_PATH);
          return;
        }
        if (isGuestPath(pathname) && isAuthenticated) {
          router.replace(DEFAULT_AUTH_PATH);
          return;
        }
        setIsChecking(false);
      })
      .catch(() => {
        if (isProtectedPath(pathname)) router.replace(DEFAULT_GUEST_PATH);
        else setIsChecking(false);
      });
  }, [pathname, router]);

  if (isChecking && (isProtectedPath(pathname) || isGuestPath(pathname))) return <LoadingIndicator />;

  return children;
};
