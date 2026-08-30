'use client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '@/lib/theme';
import React from 'react';

// Wraps children in MUI ThemeProvider and CssBaseline.
// AppRouterCacheProvider (in layout.tsx) handles emotion SSR caching.
export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
