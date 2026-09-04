'use client';

import { Switch as MuiSwitch, type SwitchProps } from '@mui/material';
import { forwardRef } from 'react';

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>((props, ref) => {
  return <MuiSwitch ref={ref} {...props} />;
});
