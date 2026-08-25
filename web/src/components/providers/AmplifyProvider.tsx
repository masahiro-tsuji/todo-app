'use client';
import { type ReactNode, useEffect } from 'react';
import { configureAmplify } from '@/libs/amplify';

export const AmplifyProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    configureAmplify();
  }, []);

  return children;
};
