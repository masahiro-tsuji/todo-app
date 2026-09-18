'use client';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import { useMemo } from 'react';
import { DataGrid, DataGridActionsCell } from '@/components';
import { useGetTodos } from '@/hooks';
import type { Todo } from '@/types';
import { formatToYYYYMMDDHHmm } from '@/utils';

type Props = { onOpenEditDialog: (todo: Todo) => void; onOpenSoftDeleteDialog: (todo: Todo) => void };

export const TodoList = ({ onOpenEditDialog, onOpenSoftDeleteDialog }: Props) => {
  const { todos, isPending } = useGetTodos();

  const columns = useMemo<GridColDef<Todo>[]>(
    () => [
      { field: 'title', headerName: 'タイトル', flex: 1, minWidth: 120 },
      { field: 'detail', headerName: '詳細', flex: 1, minWidth: 120, valueGetter: (_value, row) => row.detail ?? '—' },
      {
        field: 'createdAt',
        headerName: '作成日',
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
          <DataGridActionsCell>
            <IconButton
              aria-label={`${params.row.title}を編集`}
              onClick={() => onOpenEditDialog(params.row)}
              size='small'
            >
              <EditIcon />
            </IconButton>
            <IconButton
              aria-label={`${params.row.title}を削除`}
              onClick={() => onOpenSoftDeleteDialog(params.row)}
              size='small'
            >
              <DeleteIcon />
            </IconButton>
          </DataGridActionsCell>
        ),
      },
    ],
    [onOpenEditDialog, onOpenSoftDeleteDialog],
  );

  return (
    <DataGrid
      rows={todos}
      columns={columns}
      getRowId={(row) => row.id}
      loading={isPending}
      disableRowSelectionOnClick
      hideFooter
    />
  );
};
