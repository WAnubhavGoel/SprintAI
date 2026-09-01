import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary:    { main: '#123B6D', dark: '#071A2F', light: '#1E5AA8' },
    secondary:  { main: '#3B82F6' },
    background: { default: '#f7f5ff', paper: '#FFFFFF' },
    text:       { primary: '#111827', secondary: '#64748B' },
  },
  typography: {
    fontFamily: 'Inter, Arial, sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.04em' },
    h2: { fontWeight: 800, letterSpacing: '-0.03em' },
    h3: { fontWeight: 700, letterSpacing: '-0.02em' },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  shape: { borderRadius: 12 },
});
