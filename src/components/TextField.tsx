'use client';

import { TextField as MuiTextField, type TextFieldProps } from '@mui/material';
import { forwardRef } from 'react';

export const TextField = forwardRef<HTMLDivElement, TextFieldProps>((props, ref) => {
  return <MuiTextField ref={ref} {...props} />;
});
