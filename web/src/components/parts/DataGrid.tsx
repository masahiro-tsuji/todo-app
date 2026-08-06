'use client';

import { type DataGridProps, DataGrid as MuiDataGrid } from '@mui/x-data-grid';
import { forwardRef } from 'react';

export const DataGrid = forwardRef<HTMLDivElement, DataGridProps>((props, ref) => {
  return <MuiDataGrid ref={ref} autoHeight {...props} />;
});
