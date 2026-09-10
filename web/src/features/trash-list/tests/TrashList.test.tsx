import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MuiProvider } from '@/components';
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

jest.mock('@/hooks/useGetTrashTodos', () => ({
  useGetTrashTodos: () => ({ trashTodos: mockTrashTodos }),
}));

const renderTrashList = () => {
  const onRestore = jest.fn();
  const onPermanentDelete = jest.fn();

  const result = render(
    <MuiProvider>
      <TrashList onRestore={onRestore} onPermanentDelete={onPermanentDelete} />
    </MuiProvider>,
  );

  return { ...result, onRestore, onPermanentDelete };
};

describe('TrashList コンポーネントのテスト', () => {
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

  test('完全削除ボタンでonPermanentDeleteが呼ばれること', async () => {
    const user = userEvent.setup();
    const { onPermanentDelete } = renderTrashList();
    const target = mockTrashTodos[1];

    await user.click(screen.getByRole('button', { name: `${target.title}を完全に削除` }));

    expect(onPermanentDelete).toHaveBeenCalledWith(target.id);
  });
});
