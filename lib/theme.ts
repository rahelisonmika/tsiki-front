'use client';
import { createTheme } from '@mui/material/styles';

export const getTheme = (mode: 'light' | 'dark' = 'light') =>
  createTheme({
    palette: {
      mode,
      primary: { main: '#1976d2' },
      secondary: { main: '#9c27b0' },
    },
    typography: { fontFamily: ['Roboto', 'sans-serif'].join(',') },
    shape: { borderRadius: 10 },
    components: {
      MuiButton: { defaultProps: { variant: 'contained' } },
    },
  });