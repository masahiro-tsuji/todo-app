import { PagePaper } from '@/components';
import { MfaSettings } from '@/features/mfa-settings';

export default function SettingsPage() {
  return (
    <PagePaper maxWidth='600px' title='設定'>
      <MfaSettings />
    </PagePaper>
  );
}
