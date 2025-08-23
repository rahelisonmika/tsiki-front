import type { Metadata } from 'next';
import EmotionCacheProvider from '@/providers/EmotionCacheProvider';
import ColorModeProvider from '@/providers/ColorModeProvider';
import { Roboto } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/navbar/Navbar';
import {Category} from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';

const roboto = Roboto({ subsets: ['latin'], weight: ['300','400','500','700'] });

const CATEGORIES: Category[] = [
  { cat_code: 'all',          cat_libelle: 'Tous' },
  { cat_code: 'electronique', cat_libelle: 'Électronique' },
  { cat_code: 'mode',         cat_libelle: 'Mode' },
  { cat_code: 'maison',       cat_libelle: 'Maison' },
  { cat_code: 'beaute',       cat_libelle: 'Beauté' },
  { cat_code: 'sport',        cat_libelle: 'Sport' },
  { cat_code: 'jouets',       cat_libelle: 'Jouets' },
  { cat_code: 'auto',         cat_libelle: 'Auto' },
  { cat_code: 'livres',       cat_libelle: 'Livres' }
];

export const metadata: Metadata = {
  title: 'Tsiki',
  description: '',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {


  return (
    <html lang="fr" className={roboto.className}>
      <body>
        <EmotionCacheProvider>
          <ColorModeProvider>
            <Navbar CATEGORIES={CATEGORIES} urlToRedirect="products"/>
            {children}
            <Footer />
          </ColorModeProvider>
        </EmotionCacheProvider>
      </body>
    </html>
  );
}