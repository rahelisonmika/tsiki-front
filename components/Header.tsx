'use client';

import * as React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlined from '@mui/icons-material/LightModeOutlined';
import {ColorModeContext} from '@/contexts/color-mode.context';

export default function Header() {
  const { mode, toggle } = React.useContext(ColorModeContext);

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar sx={{ gap: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Next.js + MUI Starter
        </Typography>
        <Box>
          <IconButton color="inherit" onClick={toggle} aria-label="toggle color mode">
            {mode === 'light' ? <DarkModeOutlined /> : <LightModeOutlined />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}