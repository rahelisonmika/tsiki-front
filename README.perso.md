Parfait — voici la même base Next.js + Material UI (MUI v5), mais 100% avec npm (App Router, SSR Emotion propre, thème perso + dark mode).
1) Créer le projet

npx create-next-app@latest my-app --ts
# Réponses:
# - TypeScript: Yes
# - App Router: Yes
# - ESLint: Yes
# - Src directory: No (simple)
# - Tailwind: No
# - Alias import: Yes (ex: @/*)
cd my-app

2) Installer MUI (+ Emotion) et les icônes

npm install @mui/material @emotion/react @emotion/styled @mui/icons-material

3) Arborescence proposée

my-app/
  app/
    layout.tsx
    page.tsx
    globals.css
  components/
    EmotionCacheProvider.tsx
    ColorModeProvider.tsx
    Header.tsx
  lib/
    theme.ts

4) Thème MUI

lib/theme.ts

'use client';
import { createTheme } from '@mui/material/styles';

export const getTheme = (mode: 'light' | 'dark' = 'light') =>
  createTheme({
    palette: {
      mode,
      primary: { main: '#1976d2' },
      secondary: { main: '#9c27b0' },
    },
    typography: { fontFamily: ['Roboto', 'sans-serif'].join(',') },
    shape: { borderRadius: 10 },
    components: {
      MuiButton: { defaultProps: { variant: 'contained' } },
    },
  });

5) SSR propre d’Emotion (App Router)

components/EmotionCacheProvider.tsx

'use client';

import * as React from 'react';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { useServerInsertedHTML } from 'next/navigation';

export default function EmotionCacheProvider({
  options,
  children,
}: {
  options?: Parameters<typeof createCache>[0];
  children: React.ReactNode;
}) {
  const [cache] = React.useState(() => {
    const c = createCache({ key: 'mui', prepend: true, ...options });
    // compat = true pour l’App Router
    // (assure la compatibilité avec l’injection côté serveur)
    // @ts-expect-error
    c.compat = true;
    return c;
  });

  useServerInsertedHTML(() => (
    <style
      data-emotion={`${cache.key} ${Object.keys((cache as any).inserted).join(' ')}`}
      dangerouslySetInnerHTML={{
        __html: Object.values((cache as any).inserted).join(' '),
      }}
    />
  ));

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}

6) Dark mode persistant

components/ColorModeProvider.tsx

'use client';

import * as React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { getTheme } from '@/lib/theme';

type Mode = 'light' | 'dark';
const STORAGE_KEY = 'mui-mode';

export const ColorModeContext = React.createContext<{
  mode: Mode;
  toggle: () => void;
}>({ mode: 'light', toggle: () => {} });

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

7) Header avec bouton Dark/Light

components/Header.tsx

'use client';

import * as React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlined from '@mui/icons-material/LightModeOutlined';
import { ColorModeContext } from './ColorModeProvider';

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

8) Layout global (Roboto via next/font)

app/layout.tsx

import type { Metadata } from 'next';
import EmotionCacheProvider from '@/components/EmotionCacheProvider';
import ColorModeProvider from '@/components/ColorModeProvider';
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

9) Page d’accueil de démo

app/page.tsx

'use client';

import * as React from 'react';
import { Container, Stack, Typography, Button, TextField, Card, CardContent } from '@mui/material';

export default function Page() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Stack spacing={3}>
        <Typography variant="h4">Bienvenue 👋</Typography>
        <Typography color="text.secondary">
          Base Next.js + Material UI prête (SSR Emotion, thème perso, dark mode).
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField label="Votre email" fullWidth />
          <Button size="large">S’inscrire</Button>
        </Stack>

        <Card>
          <CardContent>
            <Typography variant="h6">Section de démo</Typography>
            <Typography color="text.secondary">
              Utilise AppBar, Button, TextField, Card, etc.
            </Typography>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}

10) Scripts & démarrage

Les scripts par défaut sont déjà en place dans package.json.

npm run dev
# ouvre http://localhost:3000




----------------------------------------------------------------
1) C’est quoi MUI ?

Une bibliothèque React de composants UI prêts à l’emploi (boutons, champs, modales, menus…).

Un système de design complet (thème, couleurs, typos, espaces, breakpoints).

Un système de style unifié via la prop sx (+ styled() si besoin).

2) Installation (Next.js)
npm i @mui/material @mui/icons-material @emotion/react @emotion/styled
# facultatif mais recommandé
npm i @fontsource/roboto

Mise en place de base (App Router)

// app/layout.tsx
'use client';
import * as React from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },   // change ta couleur marque ici
    secondary: { main: '#9A10F0' }, // exemple: ta couleur
  },
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

CssBaseline applique des styles de “reset” cohérents.
Si tu fais du SSR avancé, garde ton EmotionCacheProvider comme tu l’avais.

3) Les fondamentaux à connaître
a) Le système de style : la prop sx

Tu peux styler n’importe quel composant via sx.

Les valeurs responsive se font par breakpoint : { xs: ..., sm: ..., md: ... }.

Les espacements utilisent l’échelle du thème (par défaut 8px) : p: 2 ⇒ 16px.

<Box
  sx={{
    p: { xs: 2, md: 4 },          // padding responsive
    bgcolor: 'background.paper',  // couleur issue du thème
    borderRadius: 2,              // 2 * 8 = 16px
  }}
/>

b) Le layout : Box, Stack, Grid, Container

Box = div “améliorée” (layout rapide avec display, flex, grid, sx).

Stack = flex vertical/horizontal + gestion d’espaces spacing.

Grid = grille 12 colonnes responsive.

Container = largeur max centrée.

<Container maxWidth="lg">
  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
    <Box sx={{ flex: 1, bgcolor: 'grey.100', p: 2 }}>Bloc A</Box>
    <Box sx={{ flex: 1, bgcolor: 'grey.100', p: 2 }}>Bloc B</Box>
  </Stack>
</Container>


c) Les couleurs & thèmes

theme.palette ⇒ primary, secondary, error, warning, info, success, text, background, divider.

Mode clair/sombre via palette.mode: 'light' | 'dark'.

Appel dans sx: color: 'primary.main', bgcolor: 'background.default', etc.


d) Les composants (quelques incontournables)

AppBar / Toolbar : en-tête.

Button : actions (variant="contained|outlined|text").

TextField : formulaires (variant="outlined|filled|standard").

Menu / MenuItem : menus.

Dialog / Drawer : modales et tiroirs.

Card : cartes contenu.

List : listes, navigation.

Tabs : onglets.

Exemple rapide :

<Card sx={{ maxWidth: 360 }}>
  <Box sx={{ p: 2, bgcolor: 'grey.100' }}>Image ici</Box>
  <Stack spacing={1} sx={{ p: 2 }}>
    <Typography variant="h6">Titre</Typography>
    <Typography color="text.secondary">Description courte…</Typography>
    <Stack direction="row" spacing={1}>
      <Button variant="contained">Action</Button>
      <Button variant="outlined">Annuler</Button>
    </Stack>
  </Stack>
</Card>

e) Icônes

import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

<IconButton color="inherit"><ShoppingCartOutlinedIcon /></IconButton>

4) Responsive : breakpoints & valeurs

Breakpoints par défaut : xs (0), sm (600), md (900), lg (1200), xl (1536).

// taille du texte qui s’adapte
<Typography sx={{ fontSize: { xs: 16, sm: 18, md: 20 } }}>
  Texte responsive
</Typography>

5) Thème personnalisé (couleurs, typo, composants)

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#9A10F0' },   // ta couleur marque
    background: {
      default: '#fafafa',
      paper: '#fff',
    },
  },
  typography: {
    fontFamily: 'Roboto, system-ui, Arial',
    h1: { fontWeight: 700, letterSpacing: -0.5 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { borderRadius: 12 } },
    },
  },
});

6) Mode sombre (toggle simple)

// app/theme/ColorMode.tsx
'use client';
import * as React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

export function ColorModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = React.useState<'light'|'dark'>('light');
  const theme = React.useMemo(() => createTheme({ palette: { mode } }), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <button onClick={() => setMode(m => (m === 'light' ? 'dark' : 'light'))}>
        Toggle {mode}
      </button>
      {children}
    </ThemeProvider>
  );
}

7) Z-index & couches

Ordre par défaut : mobileStepper(1000) < appBar(1100) < drawer(1200) < modal(1300) < snackbar(1400) < tooltip(1500).

Tu peux le lire/étendre via theme.zIndex.
Ex : mettre un panneau au-dessus de l’AppBar :

<Box sx={{ position: 'fixed', zIndex: (t) => t.zIndex.appBar + 1 }} />

8) Bonnes pratiques + pièges

Dans Next.js App Router : mets use client uniquement sur les composants interactifs.

sx > className pour tout ce qui touche au thème ; garde className si tu combines avec Tailwind/SCSS.

Utilise Container maxWidth="lg" pour un contenu centré et lisible.

Préfère Stack spacing plutôt que des marges manuelles, c’est plus propre.

Pour les images Next, configure next.config.js pour les domaines externes.

9) Petit exemple complet (header + contenu)

import * as React from 'react';
import { AppBar, Toolbar, Container, Typography, Box, Button, Stack } from '@mui/material';

export default function Demo() {
  return (
    <>
      <AppBar position="sticky" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Ma Boutique</Typography>
          <Stack direction="row" spacing={1}>
            <Button color="inherit">Produits</Button>
            <Button color="inherit">Contact</Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
          Bienvenue 👋
        </Typography>
        <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          Commence à composer ton interface avec les composants MUI.
        </Box>
      </Container>
    </>
  );
}

Pré requis

# Dans un projet Next.js (app router)
npm i -D prisma
npm i @prisma/client zod

# OU, si tu choisis l’option B
npm i pg zod

1) Initialiser Prisma

npx prisma init

Ça crée prisma/schema.prisma et utilise DATABASE_URL.

2) Définir le schéma

prisma/schema.prisma :

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

3) Migrer la base & générer le client

npx prisma migrate dev --name init

4) Client Prisma singleton (évite les multiples connexions en dev)

lib/prisma.ts

import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error', 'warn'], // ajoute 'query' en debug si besoin
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

5) Routes API Next.js (App Router)

Structure :

app/
└─ api/
   └─ users/
      ├─ route.ts    # GET/POST
      └─ [id]/
         └─ route.ts # GET/PATCH/DELETE

Validation avec Zod :
app/api/users/route.ts

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).optional(),
});

// GET /api/users → list
export async function GET() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(users);
}

// POST /api/users → create
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = createUserSchema.parse(body);

    const user = await prisma.user.create({ data });
    return NextResponse.json(user, { status: 201 });
  } catch (err: any) {
    if (err?.name === 'ZodError') {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }
    // gestion des erreurs doublon email
    if (err?.code === 'P2002') {
      return NextResponse.json({ error: 'Email déjà utilisé' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

app/api/users/[id]/route.ts

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const idSchema = z.string().min(1);
const updateSchema = z.object({
  name: z.string().min(2).optional(),
});

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = idSchema.parse(params.id);
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(user);
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = idSchema.parse(params.id);
    const data = updateSchema.parse(await req.json());
    const user = await prisma.user.update({ where: { id }, data });
    return NextResponse.json(user);
  } catch (err: any) {
    if (err?.name === 'ZodError') {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }
    if (err?.code === 'P2025') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = idSchema.parse(params.id);
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    if (err?.code === 'P2025') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

