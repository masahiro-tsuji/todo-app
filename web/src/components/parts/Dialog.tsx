'use client';

import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Dialog as MuiDialog,
  type DialogProps as MuiDialogProps,
} from '@mui/material';
import { forwardRef } from 'react';
import { Button } from './Button';

type DialogSize = 'sm' | 'md' | 'lg';

const sizeToMaxWidth = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
} as const satisfies Record<DialogSize, NonNullable<MuiDialogProps['maxWidth']>>;

type Props = {
  title: string;
  onClose: () => void;
  onPrimaryClick: () => void | Promise<void>;
  cancelButtonName?: string;
  primaryButtonName?: string;
  primaryLoading?: boolean;
  size?: DialogSize;
} & Omit<MuiDialogProps, 'onClose' | 'maxWidth'>;

export const Dialog = forwardRef<HTMLDivElement, Props>(
  (
    {
      open,
      title,
      onClose,
      onPrimaryClick,
      children,
      cancelButtonName = 'キャンセル',
      primaryButtonName = 'OK',
      primaryLoading = false,
      size = 'md',
      fullWidth = true,
      disableAutoFocus = true,
      ...props
    },
    ref,
  ) => {
    const onCloseDialog = (reason: 'backdropClick' | 'escapeKeyDown') => {
      if (reason === 'backdropClick') return;
      onClose();
    };
    return (
      <MuiDialog
        ref={ref}
        open={open}
        onClose={(_, reason) => onCloseDialog(reason)}
        fullWidth={fullWidth}
        maxWidth={sizeToMaxWidth[size]}
        disableAutoFocus={disableAutoFocus}
        {...props}
      >
        <DialogTitle>{title}</DialogTitle>
        <Divider />
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>{children}</DialogContent>
        <Divider />
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button name={cancelButtonName} type='button' onClick={onClose} />
          <Button
            name={primaryButtonName}
            type='button'
            variant='contained'
            loading={primaryLoading}
            onClick={onPrimaryClick}
          />
        </DialogActions>
      </MuiDialog>
    );
  },
);
