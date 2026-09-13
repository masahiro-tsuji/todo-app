'use client';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import { Box, IconButton, Typography } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import { useCallback, useMemo } from 'react';
import { DataGrid, useConfirmDialogContext } from '@/components';
import { useGetTrashTodos, usePermanentDelete, useRestore } from '@/hooks';
import type { Todo } from '@/types';
import { formatToYYYYMMDDHHmm } from '@/utils';

const Message = ({ title }: { title: string }) => (
  <Typography>
    「{title}」を完全に削除しますか？
    <br />
    <Box component='span' sx={{ fontWeight: 'bold', color: 'error.main' }}>
      ※元には戻せません。
    </Box>
  </Typography>
);

export const TrashList = () => {
  const { trashTodos } = useGetTrashTodos();
  const { restore } = useRestore();
  const { permanentDelete } = usePermanentDelete();
  const { displayConfirm } = useConfirmDialogContext();

  const handleRestore = useCallback(
    ({ id, title }: Todo) => {
      displayConfirm({ content: `「${title}」を復元しますか？`, onClickOk: async () => await restore(id) });
    },
    [displayConfirm, restore],
  );

  const handlePermanentDelete = useCallback(
    ({ id, title }: Todo) => {
      displayConfirm({
        content: <Message title={title} />,
        onClickOk: async () => await permanentDelete(id),
      });
    },
    [displayConfirm, permanentDelete],
  );

  const columns = useMemo<GridColDef<Todo>[]>(
    () => [
      { field: 'title', headerName: 'タイトル', flex: 1, minWidth: 120 },
      { field: 'detail', headerName: '詳細', flex: 1, minWidth: 120, valueGetter: (_value, row) => row.detail ?? '—' },
      {
        field: 'createdAt',
        headerName: '作成日時',
        width: 160,
        headerAlign: 'center',
        align: 'center',
        valueFormatter: (value) => formatToYYYYMMDDHHmm(String(value)),
      },
      {
        field: 'deletedAt',
        headerName: '削除日時',
        width: 160,
        headerAlign: 'center',
        align: 'center',
        valueFormatter: (value) => formatToYYYYMMDDHHmm(String(value)),
      },
      {
        field: 'actions',
        headerName: '操作',
        width: 100,
        headerAlign: 'center',
        align: 'center',
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.5,
              width: '100%',
              height: '100%',
            }}
          >
            <IconButton aria-label={`${params.row.title}を復元`} onClick={() => handleRestore(params.row)} size='small'>
              <RestoreFromTrashIcon />
            </IconButton>
            <IconButton
              aria-label={`${params.row.title}を完全に削除`}
              onClick={() => handlePermanentDelete(params.row)}
              size='small'
            >
              <DeleteForeverIcon />
            </IconButton>
          </Box>
        ),
      },
    ],
    [handleRestore, handlePermanentDelete],
  );

  return (
    <DataGrid
      rows={trashTodos}
      columns={columns}
      getRowId={(row) => row.id}
      disableRowSelectionOnClick
      hideFooter
      sx={{
        border: 0,
        '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold' },
        '& .MuiDataGrid-cell[data-field="actions"]': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
      }}
    />
  );
};
