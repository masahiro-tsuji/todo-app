'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import { Box, Divider, FormControlLabel, Switch, Typography } from '@mui/material';
import { type ChangeEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, TextField, useConfirmDialogContext } from '@/components';
import { type MfaSetupForm as MfaSetupFormValues, mfaSetupFormSchema } from './types';

export const MfaSettings = () => {
  const { displayConfirm } = useConfirmDialogContext();
  const [isMfaEnabled, setIsMfaEnabled] = useState(false);
  const [isSetupVisible, setIsSetupVisible] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MfaSetupFormValues>({
    mode: 'all',
    resolver: zodResolver(mfaSetupFormSchema),
    defaultValues: { code: '' },
  });

  const isSwitchChecked = isMfaEnabled || isSetupVisible;

  const handleSwitchChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setIsSetupVisible(true);
      return;
    }

    if (isMfaEnabled) {
      displayConfirm({
        content: '多要素認証を無効にしますか？',
        onClickOk: () => {
          setIsMfaEnabled(false);
          setIsSetupVisible(false);
          reset();
        },
      });
      return;
    }

    setIsSetupVisible(false);
    reset();
  };

  const handleCancelSetup = () => {
    setIsSetupVisible(false);
    reset();
  };

  const onEnable = (_values: MfaSetupFormValues) => {
    setIsMfaEnabled(true);
    setIsSetupVisible(false);
    reset();
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Divider sx={{ mb: 3 }} />
      <Typography variant='h2' component='h2' sx={{ mb: 1, fontSize: 18, fontWeight: 'bold' }}>
        多要素認証（TOTP）
      </Typography>
      <Typography variant='body2' sx={{ mb: 1, color: 'text.secondary' }}>
        認証アプリの6桁コードを使って、ログイン時のセキュリティを強化できます。
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <FormControlLabel
          labelPlacement='start'
          control={<Switch checked={isSwitchChecked} onChange={handleSwitchChange} />}
          label={
            <>
              現在：
              <Box component='span' sx={{ fontWeight: 'bold' }}>
                {isSwitchChecked ? '有効' : '無効'}
              </Box>
            </>
          }
          sx={{ m: 0 }}
        />
      </Box>

      {isSetupVisible && !isMfaEnabled && (
        <Box
          component='form'
          onSubmit={handleSubmit(onEnable)}
          sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <Typography variant='body2'>
            認証アプリで以下のQRコードを読み取り、表示された6桁のコードを入力してください。
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              py: 3,
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              bgcolor: 'background.paper',
            }}
          >
            <QrCode2Icon sx={{ fontSize: 120, color: 'text.disabled' }} aria-hidden />
            <Typography variant='body2' color='text.secondary'>
              QRコード表示エリア
            </Typography>
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
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button name='キャンセル' variant='outlined' type='button' onClick={handleCancelSetup} />
            <Button name='有効化' variant='contained' type='submit' />
          </Box>
        </Box>
      )}
    </Box>
  );
};
