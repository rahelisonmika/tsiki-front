'use client';
import { createTheme } from '@mui/material/styles';

export const getTheme = (mode: 'light' | 'dark' = 'light') =>
  createTheme({
    palette: {
      mode,
      primary: { main: '#7c0dc1ff', contrastText: '#fff' },
      secondary: { main: '#9c27b0' },
      brandButtonPrimary: { main: '#7C3AED', 
                            light: '#fff' , 
                            dark: '#6D28D9' },
    },
    typography: { fontFamily: ['Roboto', 'sans-serif'].join(',') },
    shape: { borderRadius: 10 },
    components: {
      MuiButton: { defaultProps: { variant: 'contained' } },
    },
  });