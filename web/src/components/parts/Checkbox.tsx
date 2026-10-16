'use client';

import { type CheckboxProps, Checkbox as MuiCheckbox } from '@mui/material';
import { forwardRef } from 'react';

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>((props, ref) => {
  return <MuiCheckbox ref={ref} {...props} />;
});
