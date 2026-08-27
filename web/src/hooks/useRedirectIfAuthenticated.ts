'use client';

import { fetchAuthSession } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const useRedirectIfAuthenticated = () => {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    fetchAuthSession()
      .then((session) => {
        if (session.tokens?.idToken) router.replace('/list');
        else setIsChecking(false);
      })
      .catch(() => setIsChecking(false));
  }, [router]);

  return { isChecking };
};
