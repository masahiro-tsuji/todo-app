'use client';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import { Box, IconButton } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import { useCallback, useMemo } from 'react';
import type { Todo } from '@/api/types/todo';
import { DataGrid } from '@/components';
import { useGetTrashTodos } from '@/hooks';
import { formatToYYYYMMDDHHmm } from '@/utils';

type Props = { onRestore: (id: string) => void; onPermanentDelete: (id: string) => void };

export const TrashList = ({ onRestore, onPermanentDelete }: Props) => {
  const { trashTodos } = useGetTrashTodos();
  const handleRestore = useCallback((id: string) => onRestore(id), [onRestore]);
  const handlePermanentDelete = useCallback((id: string) => onPermanentDelete(id), [onPermanentDelete]);

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
            <IconButton
              aria-label={`${params.row.title}を復元`}
              onClick={() => handleRestore(params.row.id)}
              size='small'
            >
              <RestoreFromTrashIcon />
            </IconButton>
            <IconButton
              aria-label={`${params.row.title}を完全に削除`}
              onClick={() => handlePermanentDelete(params.row.id)}
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
