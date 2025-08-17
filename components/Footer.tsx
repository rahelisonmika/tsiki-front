'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  Chip,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import LanguageIcon from '@mui/icons-material/Language';

export type FooterCategory = { cat_code: string; cat_libelle: string };

type FooterProps = {
  categories?: FooterCategory[];
};

const DEFAULT_CATEGORIES: FooterCategory[] = [
  { cat_code: 'electronique', cat_libelle: 'Électronique' },
  { cat_code: 'mode',         cat_libelle: 'Mode' },
  { cat_code: 'maison',       cat_libelle: 'Maison' },
  { cat_code: 'beaute',       cat_libelle: 'Beauté' },
  { cat_code: 'sport',        cat_libelle: 'Sport' },
  { cat_code: 'jouets',       cat_libelle: 'Jouets' },
  { cat_code: 'auto',         cat_libelle: 'Auto' },
  { cat_code: 'livres',       cat_libelle: 'Livres' },
];

export default function Footer({ categories = DEFAULT_CATEGORIES }: FooterProps) {
  const [email, setEmail] = React.useState('');
  const [locale, setLocale] = React.useState<'fr' | 'en' | 'mg'>('fr');
  const [currency, setCurrency] = React.useState<'USD' | 'EUR' | 'MGA'>('USD');
  const [snack, setSnack] = React.useState<{open: boolean; msg: string; sev: 'success'|'error'}>({
    open: false, msg: '', sev: 'success'
  });

  const onSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!ok) {
      setSnack({ open: true, msg: 'Adresse email invalide.', sev: 'error' });
      return;
    }
    // TODO: call API newsletter ici
    setSnack({ open: true, msg: 'Inscription réussite ! 🎉', sev: 'success' });
    setEmail('');
  };

  const scrollTop = () => {
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const year = new Date().getFullYear();

  return (
    <Box component="footer" sx={{ mt: 6, bgcolor: (t) => (t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900]),}}>
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Grid container spacing={4}>
          {/* Col 1 — Marque, contact, réseaux, newsletter, langue/devise */}
          <Grid>
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight={800} color="primary.dark">Tsiki</Typography>
              <Typography color="text.secondary">
                Votre marketplace pour découvrir des produits au meilleur prix.
              </Typography>

              {/* Coordonnées */}
              <Stack spacing={1}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <LocationOnOutlinedIcon fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    123 Avenue du Marché, Antananarivo
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <PhoneOutlinedIcon fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    +261 34 12 345 67
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <MailOutlineIcon fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    support@tsiki.store
                  </Typography>
                </Stack>
              </Stack>

              {/* Réseaux sociaux */}
              <Stack direction="row" spacing={1}>
                <IconButton component="a" href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <FacebookIcon />
                </IconButton>
                <IconButton component="a" href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <InstagramIcon />
                </IconButton>
                <IconButton component="a" href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <TwitterIcon />
                </IconButton>
                <IconButton component="a" href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                  <YouTubeIcon />
                </IconButton>
                <IconButton component="a" href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <LinkedInIcon />
                </IconButton>
              </Stack>

              {/* Newsletter */}
              <Box component="form" onSubmit={onSubscribe} noValidate>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
                  Inscrivez-vous à la newsletter
                </Typography>
                <Stack direction="row" spacing={1}>
                  <TextField
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre email"
                    size="small"
                    fullWidth
                    type="email"
                  />
                  <Button type="submit" variant="contained">OK</Button>
                </Stack>
              </Box>

              {/* Langue / Devise */}
              <Stack direction="row" spacing={1.5} alignItems="center">
                <LanguageIcon fontSize="small" />
                <FormControl size="small" sx={{ minWidth: 88 }}>
                  <InputLabel id="langue-label">Langue</InputLabel>
                  <Select
                    labelId="langue-label"
                    label="Langue"
                    value={locale}
                    onChange={(e) => setLocale(e.target.value as any)}
                  >
                    <MenuItem value="fr">FR</MenuItem>
                    <MenuItem value="en">EN</MenuItem>
                    <MenuItem value="mg">MG</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 88 }}>
                  <InputLabel id="devise-label">Devise</InputLabel>
                  <Select
                    labelId="devise-label"
                    label="Devise"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as any)}
                  >
                    <MenuItem value="USD">USD</MenuItem>
                    <MenuItem value="EUR">EUR</MenuItem>
                    <MenuItem value="MGA">MGA</MenuItem>
                  </Select>
                </FormControl>
              </Stack>

              {/* Paiements */}
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 0.5 }}>
                <Chip size="small" label="Visa" variant="outlined" />
                <Chip size="small" label="Mastercard" variant="outlined" />
                <Chip size="small" label="PayPal" variant="outlined" />
                <Chip size="small" label="M-Pesa" variant="outlined" />
                <Chip size="small" label="Orange Money" variant="outlined" />
              </Stack>
            </Stack>
          </Grid>

          {/* Col 2 — Catégories */}
          <Grid>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
              Catégories
            </Typography>
            <Stack spacing={1}>
              {categories.slice(0, 8).map((c) => (
                <Typography
                  key={c.cat_code}
                  component={Link}
                  href={`/c/${c.cat_code}`}
                  color="text.secondary"
                  sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
                >
                  {c.cat_libelle}
                </Typography>
              ))}
              {categories.length > 8 && (
                <Typography
                  component={Link}
                  href="/c"
                  color="text.secondary"
                  sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
                >
                  Voir tout
                </Typography>
              )}
            </Stack>
          </Grid>

          {/* Col 3 — Aide */}
          <Grid>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
              Aide
            </Typography>
            <Stack spacing={1}>
              <Typography component={Link} href="/help/faq" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>FAQ</Typography>
              <Typography component={Link} href="/help/contact" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>Contact</Typography>
              <Typography component={Link} href="/help/retours" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>Retours & Remboursements</Typography>
              <Typography component={Link} href="/help/livraison" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>Livraison</Typography>
              <Typography component={Link} href="/help/suivi" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>Suivi de commande</Typography>
              <Typography component={Link} href="/help/securite" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>Sécurité & Paiement</Typography>
            </Stack>
          </Grid>

          {/* Col 4 — Société */}
          <Grid>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
              Société
            </Typography>
            <Stack spacing={1}>
              <Typography component={Link} href="/about" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>À propos</Typography>
              <Typography component={Link} href="/careers" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>Carrières</Typography>
              <Typography component={Link} href="/blog" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>Blog</Typography>
              <Typography component={Link} href="/press" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>Presse</Typography>
              <Typography component={Link} href="/sustainability" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>Durabilité</Typography>
            </Stack>
          </Grid>

          {/* Col 5 — Légal */}
          <Grid>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
              Légal
            </Typography>
            <Stack spacing={1}>
              <Typography component={Link} href="/legal/terms" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>Conditions d’utilisation</Typography>
              <Typography component={Link} href="/legal/privacy" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>Politique de confidentialité</Typography>
              <Typography component={Link} href="/legal/cookies" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>Politique cookies</Typography>
              <Typography component={Link} href="/legal/mentions" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>Mentions légales</Typography>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Bas de page */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems="center" justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">
            © {year} Tsiki — Tous droits réservés.
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" color="text.secondary">FR</Typography>
            <Divider orientation="vertical" flexItem />
            <Typography variant="body2" color="text.secondary">USD</Typography>
            <Divider orientation="vertical" flexItem />
            <IconButton aria-label="Retour en haut" onClick={scrollTop} size="small">
              <ArrowUpwardIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>
      </Container>

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={2400}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          severity={snack.sev}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
