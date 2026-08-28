import { Box, type SxProps } from '@mui/material';
import { NewPassword } from '@/features/new-password';

const boxProps: SxProps = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
};

export default function NewPasswordPage() {
  return (
    <Box sx={boxProps}>
      <NewPassword />
    </Box>
  );
}
