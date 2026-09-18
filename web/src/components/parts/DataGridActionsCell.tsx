import { Box } from '@mui/material';

export const DataGridActionsCell = ({ children }: { children: React.ReactNode }) => {
  return (
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
      {children}
    </Box>
  );
};
