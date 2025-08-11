'use client';

import * as React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { getTheme } from '@/lib/theme';
import {ColorModeContext} from '@/contexts/color-mode.context';
import {Mode} from '@/contexts/color-mode.context';


const STORAGE_KEY = 'mui-mode';

export default function ColorModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = React.useState<Mode>('light');

  React.useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as Mode) || 'light';
    setMode(saved);
  }, []);

  const toggle = React.useCallback(() => {
    setMode(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  return (
    <ColorModeContext.Provider value={{ mode, toggle }}>
      <ThemeProvider theme={getTheme(mode)}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}