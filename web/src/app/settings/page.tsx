import { Box, Paper, type SxProps, Typography } from '@mui/material';
import { MfaSettings } from '@/features/mfa-settings';

const boxProps: SxProps = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  py: 4,
};

export default function SettingsPage() {
  return (
    <Box sx={boxProps}>
      <Paper elevation={3} sx={{ width: '100%', maxWidth: '600px', m: 1, p: 3 }}>
        <Typography variant='h1' component='h1' sx={{ textAlign: 'center' }}>
          設定
        </Typography>
        <MfaSettings />
      </Paper>
    </Box>
  );
}
