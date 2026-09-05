'use client';

import { Box, CircularProgress, type SxProps, Typography } from '@mui/material';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Dialog, TextField } from '@/components';
import type { MfaSetupForm as MfaSetupFormValues } from '../types';

const qrCodeAreaSx: SxProps = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 1,
  py: 3,
  minHeight: 200,
  border: 1,
  borderColor: 'divider',
  borderRadius: 1,
  bgcolor: 'background.paper',
};

type Props = {
  isOpen: boolean;
  isPending: boolean;
  isPendingSetupTotp: boolean;
  onClose: () => void;
  onPrimaryClick: () => Promise<void>;
  setupTotpUri?: string;
};

export const MfaSetupDialog = ({
  isOpen,
  isPending,
  isPendingSetupTotp,
  onClose,
  onPrimaryClick,
  setupTotpUri,
}: Props) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<MfaSetupFormValues>();
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>();

  useEffect(() => {
    if (!setupTotpUri) {
      setQrCodeDataUrl(undefined);
      return;
    }

    QRCode.toDataURL(setupTotpUri)
      .then(setQrCodeDataUrl)
      .catch(() => setQrCodeDataUrl(undefined));
  }, [setupTotpUri]);

  return (
    <Dialog
      open={isOpen}
      title='多要素認証のセットアップ'
      primaryButtonName='有効化'
      onClose={onClose}
      onPrimaryClick={onPrimaryClick}
      primaryLoading={isPending}
      size='sm'
    >
      <Typography variant='body2'>
        認証アプリで以下のQRコードを読み取り、表示された6桁のコードを入力してください。
      </Typography>
      <Box sx={qrCodeAreaSx}>
        {isPendingSetupTotp ? (
          <CircularProgress size={40} aria-label='QRコードを読み込み中' />
        ) : qrCodeDataUrl ? (
          <Box component='img' src={qrCodeDataUrl} alt='QRコード' sx={{ width: 200, height: 200 }} />
        ) : (
          <Typography variant='body2' color='text.secondary'>
            QRコードの取得に失敗しました
          </Typography>
        )}
      </Box>
      <TextField
        label='認証コード'
        type='text'
        inputMode='numeric'
        autoComplete='one-time-code'
        {...register('code')}
        error={!!errors.code}
        helperText={errors.code?.message}
        fullWidth
      />
    </Dialog>
  );
};
