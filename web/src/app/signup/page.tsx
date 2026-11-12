import { Box, type SxProps } from '@mui/material';
import { Signup } from '@/features/signup';

const boxProps: SxProps = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
};

export default function SignupPage() {
  return (
    <Box sx={boxProps}>
      <Signup />
    </Box>
  );
}
