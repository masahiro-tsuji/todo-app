import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfirmDialogProvider, MuiProvider } from '@/components';
import { formatToYYYYMMDDHHmm } from '@/utils';
import { TrashList } from '../index';

const mockTrashTodos = [
  {
    id: '1',
    title: 'タイトル1',
    detail: '詳細1',
    createdAt: '2026-01-01T10:00:00.000Z',
    deletedAt: '2026-01-10T12:00:00.000Z',
  },
  {
    id: '2',
    title: 'タイトル2',
    createdAt: '2026-01-02T10:00:00.000Z',
    deletedAt: '2026-01-11T15:30:00.000Z',
  },
];

const mockPermanentDelete = jest.fn();

jest.mock('@/hooks/useGetTrashTodos', () => ({
  useGetTrashTodos: () => ({ trashTodos: mockTrashTodos }),
}));

jest.mock('@/hooks/usePermanentDelete', () => ({
  usePermanentDelete: () => ({ permanentDelete: mockPermanentDelete, isPendingPermanentDelete: false }),
}));

const renderTrashList = () => {
  const onRestore = jest.fn();

  const result = render(
    <ConfirmDialogProvider>
      <MuiProvider>
        <TrashList onRestore={onRestore} />
      </MuiProvider>
    </ConfirmDialogProvider>,
  );

  return { ...result, onRestore };
};

describe('TrashList コンポーネントのテスト', () => {
  beforeEach(() => {
    mockPermanentDelete.mockClear();
  });

  test('ゴミ箱のTODO一覧が表示されること', () => {
    renderTrashList();
    mockTrashTodos.forEach((element) => {
      expect(screen.getByText(element.title)).toBeInTheDocument();
    });
  });

  test('詳細が表示されること', () => {
    renderTrashList();
    expect(screen.getByText('詳細1')).toBeInTheDocument();
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  test('作成日時と削除日時が表示されること', () => {
    renderTrashList();
    mockTrashTodos.forEach((element) => {
      expect(screen.getByText(formatToYYYYMMDDHHmm(element.createdAt))).toBeInTheDocument();
      expect(screen.getByText(formatToYYYYMMDDHHmm(element.deletedAt))).toBeInTheDocument();
    });
  });

  test('各TODOに復元・完全削除ボタンが表示されること', () => {
    renderTrashList();
    mockTrashTodos.forEach((element) => {
      expect(screen.getByRole('button', { name: `${element.title}を復元` })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: `${element.title}を完全に削除` })).toBeInTheDocument();
    });
  });

  test('復元ボタンでonRestoreが呼ばれること', async () => {
    const user = userEvent.setup();
    const { onRestore } = renderTrashList();
    const target = mockTrashTodos[0];

    await user.click(screen.getByRole('button', { name: `${target.title}を復元` }));

    expect(onRestore).toHaveBeenCalledWith(target.id);
  });

  test('完全削除ボタンで確認後にpermanentDeleteが呼ばれること', async () => {
    const user = userEvent.setup();
    renderTrashList();
    const target = mockTrashTodos[1];

    await user.click(screen.getByRole('button', { name: `${target.title}を完全に削除` }));

    await waitFor(() => {
      expect(screen.getByText(`「${target.title}」を完全に削除しますか？`)).toBeInTheDocument();
      expect(screen.getByText('※元には戻せません。')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'OK' }));

    await waitFor(() => {
      expect(mockPermanentDelete).toHaveBeenCalledWith(target.id);
    });
  });

  test('permanentDeleteが失敗した場合は確認ダイアログが閉じないこと', async () => {
    mockPermanentDelete.mockRejectedValueOnce(new Error('failed'));
    const user = userEvent.setup();
    renderTrashList();
    const target = mockTrashTodos[1];

    await user.click(screen.getByRole('button', { name: `${target.title}を完全に削除` }));

    await waitFor(() => {
      expect(screen.getByText(`「${target.title}」を完全に削除しますか？`)).toBeInTheDocument();
      expect(screen.getByText('※元には戻せません。')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'OK' }));

    await waitFor(() => {
      expect(mockPermanentDelete).toHaveBeenCalledWith(target.id);
    });
    expect(screen.getByText(`「${target.title}」を完全に削除しますか？`)).toBeInTheDocument();
    expect(screen.getByText('※元には戻せません。')).toBeInTheDocument();
  });
});
