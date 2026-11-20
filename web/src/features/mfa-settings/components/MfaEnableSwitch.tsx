'use client';

import { Box, CircularProgress, FormControlLabel } from '@mui/material';
import type { ChangeEvent } from 'react';
import { Switch } from '@/components';

type Props = {
  isLoading: boolean;
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

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

export const MfaEnableSwitch = ({ isLoading, checked, onChange }: Props) => (
  <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', minHeight: 38 }}>
    {isLoading ? (
      <CircularProgress size={24} aria-label='多要素認証の状態を読み込み中' />
    ) : (
      <MfaSwitchLabel checked={checked} onChange={onChange} />
    )}
  </Box>
);
