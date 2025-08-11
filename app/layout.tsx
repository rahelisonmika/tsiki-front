import type { Metadata } from 'next';
import EmotionCacheProvider from '@/providers/EmotionCacheProvider';
import ColorModeProvider from '@/providers/ColorModeProvider';
import Header from '@/components/Header';
import { Roboto } from 'next/font/google';
import './globals.css';

const roboto = Roboto({ subsets: ['latin'], weight: ['300','400','500','700'] });

export const metadata: Metadata = {
  title: 'Next + MUI Starter',
  description: 'Base Next.js + Material UI avec SSR & dark mode',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={roboto.className}>
      <body>
        <EmotionCacheProvider>
          <ColorModeProvider>
            <Header />
            {children}
          </ColorModeProvider>
        </EmotionCacheProvider>
      </body>
    </html>
  );
}