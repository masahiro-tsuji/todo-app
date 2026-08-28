'use client';
import type { ReactNode } from 'react';
import { configureAmplify } from '@/libs/amplify';

export const AmplifyProvider = ({ children }: { children: ReactNode }) => {
  configureAmplify();
  return children;
};
