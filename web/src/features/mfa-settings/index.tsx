'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Box, CircularProgress, type SxProps, Typography } from '@mui/material';
import QRCode from 'qrcode';
import { type ChangeEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, TextField, useConfirmDialogContext } from '@/components';
import { useDialogState, useGetMfaState, useSetupTotp, useUpdateMfaPreference, useVerifyTotpSetup } from '@/hooks';
import { MfaEnableSwitch } from './components/MfaEnableSwitch';
import { type MfaSetupForm as MfaSetupFormValues, mfaSetupFormSchema } from './types';

const TOTP_APP_NAME = 'Todo App';

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

export const MfaSettings = () => {
  const { displayConfirm } = useConfirmDialogContext();
  const { isMfaEnabled, shouldTotpSetup, isPendingMfaState } = useGetMfaState();
  const { isPendingUpdateMfaPreference, updateMfaPreference } = useUpdateMfaPreference();
  const { isPendingVerifyTotpSetup, verifyTotpSetup } = useVerifyTotpSetup();
  const { isPendingSetupTotp, setupTotp, totpSetupDetails, resetSetupTotp } = useSetupTotp();
  const { isOpen: isSetupDialogOpen, onOpen: openSetupDialog, onClose: closeSetupDialog } = useDialogState();
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>();
  const [setupErrorMessage, setSetupErrorMessage] = useState('');
  const isSwitchLoading = isPendingMfaState || isPendingUpdateMfaPreference;
  const isSetupPending = isPendingVerifyTotpSetup || isPendingUpdateMfaPreference;
  const setupTotpUri = totpSetupDetails?.getSetupUri(TOTP_APP_NAME).href;

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

  const isSwitchChecked = isMfaEnabled || isSetupDialogOpen;

  useEffect(() => {
    if (isSetupDialogOpen) setupTotp();
  }, [isSetupDialogOpen, setupTotp]);

  useEffect(() => {
    if (!setupTotpUri) {
      setQrCodeDataUrl(undefined);
      return;
    }

    QRCode.toDataURL(setupTotpUri)
      .then(setQrCodeDataUrl)
      .catch(() => setQrCodeDataUrl(undefined));
  }, [setupTotpUri]);

  const onCloseSetupDialog = () => {
    setSetupErrorMessage('');
    reset();
    resetSetupTotp();
    closeSetupDialog();
  };

  /**
   * 多要素認証のスイッチを変更したときの処理
   * TOTPの設定が必要な場合( shouldTotpSetupがtrue )、ダイアログを開く
   * TOTPを設定する必要がない場合は多要素認証を有効にする
   * @param event - スイッチの変更イベント
   */
  const onChangeEnableSwitch = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.checked) {
      displayConfirm({
        content: '多要素認証を無効にしますか？',
        onClickOk: async () => await updateMfaPreference(false),
      });
      return;
    }
    if (shouldTotpSetup) openSetupDialog();
    else await updateMfaPreference(true);
  };

  const onEnable = async ({ code }: MfaSetupFormValues) => {
    setSetupErrorMessage('');

    if (shouldTotpSetup) {
      try {
        await verifyTotpSetup(code);
      } catch {
        setSetupErrorMessage('認証コードの確認に失敗しました。コードを確認して、もう一度お試しください');
        return;
      }
    }
    try {
      await updateMfaPreference(true, { onSuccess: onCloseSetupDialog });
    } catch {
      setSetupErrorMessage(
        '認証コードの確認は成功しています。多要素認証の有効化に失敗しました。\nキャンセル後、もう一度スイッチを ON にしてください。',
      );
    }
  };

  const onPrimaryClick = handleSubmit(onEnable);

  return (
    <>
      <MfaEnableSwitch isLoading={isSwitchLoading} checked={isSwitchChecked} onChange={onChangeEnableSwitch} />
      <Dialog
        open={isSetupDialogOpen}
        title='多要素認証のセットアップ'
        primaryButtonName='有効化'
        onClose={onCloseSetupDialog}
        onPrimaryClick={onPrimaryClick}
        primaryLoading={isSetupPending}
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
        {setupErrorMessage && (
          <Typography color='error' variant='body2' sx={{ whiteSpace: 'pre-line' }}>
            {setupErrorMessage}
          </Typography>
        )}
      </Dialog>
    </>
  );
};
