import { Box, Divider, Typography } from '@mui/material';
import { PagePaper } from '@/components';
import { MfaSettings } from '@/features/mfa-settings';

type SectionHeadingProps = {
  title: string;
  description: string;
};

const SectionHeading = ({ title, description }: SectionHeadingProps) => (
  <>
    <Typography variant='h2' component='h2' sx={{ mb: 1, fontSize: 18, fontWeight: 'bold' }}>
      {title}
    </Typography>
    <Typography variant='body2' sx={{ mb: 1, color: 'text.secondary' }}>
      {description}
    </Typography>
  </>
);

export default function SettingsPage() {
  return (
    <PagePaper maxWidth='600px' title='設定'>
      <Box sx={{ mt: 3 }}>
        <Divider sx={{ mb: 3 }} />
        <SectionHeading
          title='多要素認証（TOTP）'
          description='認証アプリの6桁コードを使って、ログイン時のセキュリティを強化できます。'
        />
        <MfaSettings />
      </Box>
    </PagePaper>
  );
}
