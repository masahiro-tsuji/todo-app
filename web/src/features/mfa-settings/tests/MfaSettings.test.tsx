import '@testing-library/jest-dom';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fetchMFAPreference, setUpTOTP, updateMFAPreference, verifyTOTPSetup } from 'aws-amplify/auth';
import { ConfirmDialogProvider, MuiProvider, QueryProvider } from '@/components';
import { MfaSettings } from '../index';

jest.mock('aws-amplify/auth', () => ({
  fetchMFAPreference: jest.fn(),
  setUpTOTP: jest.fn(),
  updateMFAPreference: jest.fn(),
  verifyTOTPSetup: jest.fn(),
}));

const renderMfaSettings = () => {
  return render(
    <MuiProvider>
      <QueryProvider>
        <ConfirmDialogProvider>
          <MfaSettings />
        </ConfirmDialogProvider>
      </QueryProvider>
    </MuiProvider>,
  );
};

const getSetupDialog = () => screen.getByRole('dialog', { name: '多要素認証のセットアップ' });

describe('MfaSettings コンポーネントのテスト', () => {
  beforeEach(() => {
    jest.mocked(fetchMFAPreference).mockResolvedValue({ enabled: [], preferred: undefined });
    jest.mocked(setUpTOTP).mockResolvedValue({
      sharedSecret: 'JBSWY3DPEHPK3PXP',
      getSetupUri: () => new URL('otpauth://totp/Todo%20App?secret=JBSWY3DPEHPK3PXP&issuer=Todo%20App'),
    });
    jest.mocked(verifyTOTPSetup).mockResolvedValue(undefined);
    jest.mocked(updateMFAPreference).mockImplementation(async ({ totp }) => {
      if (totp === 'PREFERRED') {
        jest.mocked(fetchMFAPreference).mockResolvedValue({ enabled: ['TOTP'], preferred: 'TOTP' });
      }
      if (totp === 'DISABLED') {
        jest.mocked(fetchMFAPreference).mockResolvedValue({ enabled: ['TOTP'], preferred: undefined });
      }
    });
  });

  test('多要素認証のスイッチが表示されること', async () => {
    renderMfaSettings();

    await waitFor(() => {
      expect(screen.getByRole('switch', { name: /現在.*無効/ })).toBeInTheDocument();
      expect(screen.getByText('無効')).toBeInTheDocument();
    });
  });

  test('スイッチをONにするとトグルがONになりセットアップUIが表示されること', async () => {
    renderMfaSettings();

    await userEvent.click(await screen.findByRole('switch', { name: /現在.*無効/ }));

    await waitFor(() => {
      expect(screen.getByRole('switch', { name: /現在.*有効/, hidden: true })).toBeChecked();
      const setupDialog = getSetupDialog();
      expect(within(setupDialog).getByRole('img', { name: 'QRコード' })).toBeInTheDocument();
      expect(within(setupDialog).getByLabelText(/認証コード/)).toBeInTheDocument();
      expect(within(setupDialog).getByRole('button', { name: '有効化' })).toBeInTheDocument();
      expect(within(setupDialog).getByRole('button', { name: 'キャンセル' })).toBeInTheDocument();
    });
  });

  test('キャンセルでセットアップUIが閉じトグルがOFFになること', async () => {
    renderMfaSettings();

    await userEvent.click(await screen.findByRole('switch', { name: /現在.*無効/ }));
    await waitFor(() => {
      expect(within(getSetupDialog()).getByRole('img', { name: 'QRコード' })).toBeInTheDocument();
    });

    await userEvent.click(within(getSetupDialog()).getByRole('button', { name: 'キャンセル' }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: '多要素認証のセットアップ' })).not.toBeInTheDocument();
      expect(screen.getByRole('switch', { name: /現在.*無効/ })).not.toBeChecked();
    });
  });

  test('有効化後はスイッチがONになること', async () => {
    renderMfaSettings();

    await userEvent.click(await screen.findByRole('switch', { name: /現在.*無効/ }));
    const setupDialog = await waitFor(() => getSetupDialog());
    await userEvent.type(within(setupDialog).getByLabelText(/認証コード/), '123456');
    await userEvent.click(within(setupDialog).getByRole('button', { name: '有効化' }));

    await waitFor(() => {
      expect(screen.getByText('有効')).toBeInTheDocument();
      expect(screen.getByRole('switch', { name: /現在.*有効/ })).toBeChecked();
      expect(screen.queryByRole('dialog', { name: '多要素認証のセットアップ' })).not.toBeInTheDocument();
    });
    expect(verifyTOTPSetup).toHaveBeenCalledWith({ code: '123456' });
    expect(updateMFAPreference).toHaveBeenCalledWith({ totp: 'PREFERRED' });
  });

  test('TOTP設定済みの場合はセットアップUIを表示せず有効化すること', async () => {
    jest.mocked(fetchMFAPreference).mockResolvedValue({ enabled: ['TOTP'], preferred: undefined });
    renderMfaSettings();

    await userEvent.click(await screen.findByRole('switch', { name: /現在.*無効/ }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: '多要素認証のセットアップ' })).not.toBeInTheDocument();
      expect(screen.getByRole('switch', { name: /現在.*有効/ })).toBeChecked();
      expect(screen.queryByRole('img', { name: 'QRコード' })).not.toBeInTheDocument();
    });
    expect(setUpTOTP).not.toHaveBeenCalled();
    expect(verifyTOTPSetup).not.toHaveBeenCalled();
    expect(updateMFAPreference).toHaveBeenCalledWith({ totp: 'PREFERRED' });
  });

  test('有効化後にスイッチをOFFにすると確認ダイアログが表示されること', async () => {
    renderMfaSettings();

    await userEvent.click(await screen.findByRole('switch', { name: /現在.*無効/ }));
    const setupDialog = await waitFor(() => getSetupDialog());
    await userEvent.type(within(setupDialog).getByLabelText(/認証コード/), '123456');
    await userEvent.click(within(setupDialog).getByRole('button', { name: '有効化' }));

    await waitFor(() => {
      expect(screen.getByRole('switch', { name: /現在.*有効/ })).toBeChecked();
    });

    await userEvent.click(screen.getByRole('switch', { name: /現在.*有効/ }));

    const confirmDialog = await screen.findByRole('dialog');
    expect(within(confirmDialog).getByText('多要素認証を無効にしますか？')).toBeInTheDocument();
  });
});
