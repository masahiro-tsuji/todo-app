'use client';

import DeleteIcon from '@mui/icons-material/Delete';
import UndoIcon from '@mui/icons-material/Undo';
import { IconButton } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import { useMemo } from 'react';
import { DataGrid, DataGridActionsCell } from '@/components';
import { useGetTodos } from '@/hooks';
import type { Todo } from '@/types';
import { formatToYYYYMMDDHHmm } from '@/utils';

type Props = { onOpenUncompleteDialog: (todo: Todo) => void; onOpenSoftDeleteDialog: (todo: Todo) => void };

export const CompletedList = ({ onOpenUncompleteDialog, onOpenSoftDeleteDialog }: Props) => {
  const { todos, isPending } = useGetTodos();
  const completedTodos = useMemo(() => todos.filter((todo) => todo.completedAt != null), [todos]);

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
        field: 'completedAt',
        headerName: '完了日時',
        width: 160,
        headerAlign: 'center',
        align: 'center',
        valueFormatter: (value) => (value ? formatToYYYYMMDDHHmm(String(value)) : '—'),
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
              aria-label={`${params.row.title}を未完了にする`}
              onClick={() => onOpenUncompleteDialog(params.row)}
              size='small'
            >
              <UndoIcon />
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
    [onOpenUncompleteDialog, onOpenSoftDeleteDialog],
  );

  return (
    <DataGrid
      rows={completedTodos}
      columns={columns}
      getRowId={(row) => row.id}
      loading={isPending}
      disableRowSelectionOnClick
      hideFooter
    />
  );
};
