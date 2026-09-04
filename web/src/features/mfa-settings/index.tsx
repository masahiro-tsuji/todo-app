'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Box, CircularProgress, Divider, FormControlLabel, Typography } from '@mui/material';
import { type ChangeEvent, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Switch, useConfirmDialogContext } from '@/components';
import { useDialogState, useGetMfaState, useSetupTotp, useUpdateMfaPreference, useVerifyTotpSetup } from '@/hooks';
import { MfaSetupDialog } from './components/MfaSetupDialog';
import { type MfaSetupForm as MfaSetupFormValues, mfaSetupFormSchema } from './types';

const TOTP_APP_NAME = 'Todo App';

type MfaSwitchLabelProps = {
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const MfaSwitchLabel = ({ checked, onChange }: MfaSwitchLabelProps) => (
  <FormControlLabel
    labelPlacement='start'
    control={<Switch checked={checked} onChange={onChange} />}
    label={
      <>
        現在：
        <Box component='span' sx={{ fontWeight: 'bold' }}>
          {checked ? '有効' : '無効'}
        </Box>
      </>
    }
    sx={{ m: 0 }}
  />
);

export const MfaSettings = () => {
  const { displayConfirm } = useConfirmDialogContext();
  const { isMfaEnabled, shouldTotpSetup, isPendingMfaState } = useGetMfaState();
  const { isPendingUpdateMfaPreference, updateMfaPreference } = useUpdateMfaPreference();
  const { isPendingVerifyTotpSetup, verifyTotpSetup } = useVerifyTotpSetup();
  const { isPendingSetupTotp, setupTotp, totpSetupDetails, resetSetupTotp } = useSetupTotp();
  const { isOpen: isSetupDialogOpen, onOpen: openSetupDialog, onClose: closeSetupDialog } = useDialogState();
  const isSwitchLoading = isPendingMfaState || isPendingUpdateMfaPreference;
  const setupTotpUri = totpSetupDetails?.getSetupUri(TOTP_APP_NAME).href;

  const methods = useForm<MfaSetupFormValues>({
    mode: 'all',
    resolver: zodResolver(mfaSetupFormSchema),
    defaultValues: { code: '' },
  });
  const { handleSubmit, reset } = methods;

  const isSwitchChecked = isMfaEnabled || isSetupDialogOpen;

  useEffect(() => {
    if (isSetupDialogOpen) setupTotp();
  }, [isSetupDialogOpen, setupTotp]);

  const onCloseSetupDialog = () => {
    reset();
    resetSetupTotp();
    closeSetupDialog();
  };

  const onChangeEnableSwitch = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.checked) {
      const onClickOk = async () => await updateMfaPreference(false);
      displayConfirm({ content: '多要素認証を無効にしますか？', onClickOk });
      return;
    }
    if (shouldTotpSetup) openSetupDialog();
    else await updateMfaPreference(true);
  };

  const onEnable = async ({ code }: MfaSetupFormValues) => {
    await verifyTotpSetup(code);
    await updateMfaPreference(true, { onSuccess: onCloseSetupDialog });
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
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', minHeight: 38 }}>
        {isSwitchLoading ? (
          <CircularProgress size={24} aria-label='多要素認証の状態を読み込み中' />
        ) : (
          <MfaSwitchLabel checked={isSwitchChecked} onChange={onChangeEnableSwitch} />
        )}
      </Box>
      <FormProvider {...methods}>
        <MfaSetupDialog
          isOpen={isSetupDialogOpen}
          isPending={isPendingVerifyTotpSetup || isPendingUpdateMfaPreference}
          isPendingSetupTotp={isPendingSetupTotp}
          onClose={onCloseSetupDialog}
          onPrimaryClick={handleSubmit(onEnable)}
          setupTotpUri={setupTotpUri}
        />
      </FormProvider>
    </Box>
  );
};
