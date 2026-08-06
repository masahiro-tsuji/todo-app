'use client';

import {
  Box,
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog as MuiDialog,
  type DialogProps as MuiDialogProps,
} from '@mui/material';
import { type FormEventHandler, forwardRef, type ReactNode } from 'react';
import { Button } from '../Button';

type Props = {
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  children: ReactNode;
  cancelButtonName?: string;
  submitButtonName?: string;
  loading?: boolean;
} & Omit<MuiDialogProps, 'children' | 'onClose' | 'open' | 'title'>;

export const Dialog = forwardRef<HTMLDivElement, Props>(
  (
    {
      open,
      title,
      onClose,
      onSubmit,
      children,
      cancelButtonName = 'キャンセル',
      submitButtonName = 'OK',
      loading = false,
      fullWidth = true,
      maxWidth = 'sm',
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
        maxWidth={maxWidth}
        disableAutoFocus={disableAutoFocus}
        {...props}
      >
        <DialogTitle>{title}</DialogTitle>
        <Box component="form" onSubmit={onSubmit}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>{children}</DialogContent>
          <DialogActions sx={{ p: 1 }}>
            <Button name={cancelButtonName} type="button" onClick={onClose} />
            <Button name={submitButtonName} type="submit" variant="contained" loading={loading} />
          </DialogActions>
        </Box>
      </MuiDialog>
    );
  },
);
