'use client';

import type { SxProps } from '@mui/material';
import { type DataGridProps, DataGrid as MuiDataGrid } from '@mui/x-data-grid';
import { forwardRef } from 'react';

const defaultSx: SxProps = {
  border: 0,
  '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold' },
  '& .MuiDataGrid-cell[data-field="actions"]': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export const DataGrid = forwardRef<HTMLDivElement, DataGridProps>(({ sx, ...props }, ref) => {
  let gridSx: SxProps = defaultSx;
  if (sx) gridSx = [defaultSx, ...(Array.isArray(sx) ? sx : [sx])];

  return <MuiDataGrid ref={ref} autoHeight sx={gridSx} {...props} />;
});
