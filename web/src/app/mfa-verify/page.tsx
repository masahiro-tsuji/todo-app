import { Box, type SxProps } from '@mui/material';
import { MfaVerify } from '@/features/mfa-verify';

const boxProps: SxProps = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
};

export default function MfaVerifyPage() {
  return (
    <Box sx={boxProps}>
      <MfaVerify />
    </Box>
  );
}
