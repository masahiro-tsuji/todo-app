import { Box, type SxProps } from '@mui/material';
import { Suspense } from 'react';
import { LoadingIndicator } from '@/components';
import { ConfirmSignup } from '@/features/confirm-signup';

const boxProps: SxProps = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
};

export default function ConfirmSignupPage() {
  return (
    <Box sx={boxProps}>
      <Suspense fallback={<LoadingIndicator />}>
        <ConfirmSignup />
      </Suspense>
    </Box>
  );
}
