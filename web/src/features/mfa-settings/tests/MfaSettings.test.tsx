import '@testing-library/jest-dom';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfirmDialogProvider, MuiProvider } from '@/components';
import { MfaSettings } from '../index';

const renderMfaSettings = () => {
  return render(
    <MuiProvider>
      <ConfirmDialogProvider>
        <MfaSettings />
      </ConfirmDialogProvider>
    </MuiProvider>,
  );
};

describe('MfaSettings コンポーネントのテスト', () => {
  test('多要素認証のスイッチが表示されること', async () => {
    renderMfaSettings();

    await waitFor(() => {
      expect(screen.getByRole('switch', { name: /現在.*無効/ })).toBeInTheDocument();
      expect(screen.getByText('無効')).toBeInTheDocument();
    });
  });

  test('スイッチをONにするとトグルがONになりセットアップUIが表示されること', async () => {
    renderMfaSettings();

    await userEvent.click(screen.getByRole('switch', { name: /現在.*無効/ }));

    await waitFor(() => {
      expect(screen.getByRole('switch', { name: /現在.*有効/ })).toBeChecked();
      expect(screen.getByText('QRコード表示エリア')).toBeInTheDocument();
      expect(screen.getByLabelText(/認証コード/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '有効化' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'キャンセル' })).toBeInTheDocument();
    });
  });

  test('キャンセルでセットアップUIが閉じトグルがOFFになること', async () => {
    renderMfaSettings();

    await userEvent.click(screen.getByRole('switch', { name: /現在.*無効/ }));
    await waitFor(() => {
      expect(screen.getByText('QRコード表示エリア')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'キャンセル' }));

    await waitFor(() => {
      expect(screen.queryByText('QRコード表示エリア')).not.toBeInTheDocument();
      expect(screen.getByRole('switch', { name: /現在.*無効/ })).not.toBeChecked();
    });
  });

  test('セットアップ中にスイッチをOFFにするとセットアップUIが閉じること', async () => {
    renderMfaSettings();

    await userEvent.click(screen.getByRole('switch', { name: /現在.*無効/ }));
    await waitFor(() => {
      expect(screen.getByText('QRコード表示エリア')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('switch', { name: /現在.*有効/ }));

    await waitFor(() => {
      expect(screen.queryByText('QRコード表示エリア')).not.toBeInTheDocument();
      expect(screen.getByRole('switch', { name: /現在.*無効/ })).not.toBeChecked();
    });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('有効化後はスイッチがONになること', async () => {
    renderMfaSettings();

    await userEvent.click(screen.getByRole('switch', { name: /現在.*無効/ }));
    await userEvent.type(screen.getByLabelText(/認証コード/), '123456');
    await userEvent.click(screen.getByRole('button', { name: '有効化' }));

    await waitFor(() => {
      expect(screen.getByText('有効')).toBeInTheDocument();
      expect(screen.getByRole('switch', { name: /現在.*有効/ })).toBeChecked();
      expect(screen.queryByText('QRコード表示エリア')).not.toBeInTheDocument();
    });
  });

  test('有効化後にスイッチをOFFにすると確認ダイアログが表示されること', async () => {
    renderMfaSettings();

    await userEvent.click(screen.getByRole('switch', { name: /現在.*無効/ }));
    await userEvent.type(screen.getByLabelText(/認証コード/), '123456');
    await userEvent.click(screen.getByRole('button', { name: '有効化' }));

    await waitFor(() => {
      expect(screen.getByRole('switch', { name: /現在.*有効/ })).toBeChecked();
    });

    await userEvent.click(screen.getByRole('switch', { name: /現在.*有効/ }));

    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText('多要素認証を無効にしますか？')).toBeInTheDocument();
  });
});
