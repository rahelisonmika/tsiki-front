import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    brandButtonPrimary: Palette['primary'];
    colorButtonPrimary: Palette['primary'];
  }
  
  interface PaletteOptions {
    brandButtonPrimary?: PaletteOptions['primary'];
    colorButtonPrimary?: PaletteOptions['primary'];
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    brandButtonPrimary: true;
    colorButtonPrimary: true;
  }
}