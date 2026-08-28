'use client';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, IconButton } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import { useCallback, useMemo, useState } from 'react';
import type { Todo } from '@/api/types/todo';
import { DataGrid } from '@/components';
import { EditTodo } from '@/features/edit-todo';
import { useGetTodos } from '@/hooks';
import { formatToYYYYMMDDHHmm } from '@/utils';

type Props = { onDelete: (id: string) => void };

export const TodoList = ({ onDelete }: Props) => {
  const { data: todos } = useGetTodos();
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const handleEdit = useCallback(
    (id: string) => {
      const todo = todos.find((item) => item.id === id) ?? null;
      setEditingTodo(todo);
    },
    [todos],
  );

  const handleDelete = useCallback((id: string) => onDelete(id), [onDelete]);

  const columns = useMemo<GridColDef[]>(
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
            <IconButton aria-label={`${params.row.title}を編集`} onClick={() => handleEdit(params.row.id)} size='small'>
              <EditIcon />
            </IconButton>
            <IconButton
              aria-label={`${params.row.title}を削除`}
              onClick={() => handleDelete(params.row.id)}
              size='small'
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ),
      },
    ],
    [handleEdit, handleDelete],
  );

  return (
    <>
      <DataGrid
        rows={todos}
        columns={columns}
        getRowId={(row) => row.id}
        disableRowSelectionOnClick
        hideFooter
        sx={{
          border: 0,
          '& .MuiDataGrid-cell[data-field="actions"]': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
        }}
      />
      <EditTodo todo={editingTodo} open={!!editingTodo} onClose={() => setEditingTodo(null)} />
    </>
  );
};
