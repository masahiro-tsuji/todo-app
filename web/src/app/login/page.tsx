import { Box, type SxProps } from '@mui/material';
import { Login } from '@/features/login';

const boxProps: SxProps = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
};

export default function LoginPage() {
  return (
    <Box sx={boxProps}>
      <Login />
    </Box>
  );
}
