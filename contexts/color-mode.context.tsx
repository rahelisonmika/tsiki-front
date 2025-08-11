import * as React from 'react';
export type Mode = 'light' | 'dark';

export const ColorModeContext = React.createContext<{
  mode: Mode;
  toggle: () => void;
}>({ mode: 'light', toggle: () => {} });
