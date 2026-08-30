import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import ThemeRegistry from '@/components/ThemeRegistry';
import './globals.css';

// Prevent Font Awesome from injecting its CSS automatically — we imported it above.
config.autoAddCss = false;

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'SprintAI — Learn Smarter',
  description: 'Upload your documents and notes and let SprintAI turn them into a focused, interactive learning experience.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body style={{ background: '#F7F9FC', margin: 0 }}>
        <AppRouterCacheProvider>
          <ThemeRegistry>
            {children}
          </ThemeRegistry>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
