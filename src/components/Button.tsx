'use client';
import { ButtonProps, Button as MuiButton } from '@mui/material';
import { forwardRef } from 'react';

type Props = { name: string } & ButtonProps;

export const Button = forwardRef(
  ({ name, ...props }: Props, ref: React.ForwardedRef<HTMLButtonElement>) => {
    return (
      <MuiButton ref={ref} {...props}>
        {name}
      </MuiButton>
    );
  },
);

Button.displayName = 'Button';
