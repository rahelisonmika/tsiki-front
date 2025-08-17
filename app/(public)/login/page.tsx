'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box, Container, Paper, Typography, TextField, Button, Grid,
  FormControlLabel, Checkbox, IconButton, InputAdornment,
  Snackbar, Alert, Divider
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

type FormState = {
  email: string;
  password: string;
  remember: boolean;
};

const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [values, setValues] = React.useState<FormState>({
    email: '',
    password: '',
    remember: true,
  });
  const [errors, setErrors] = React.useState<Partial<Record<keyof FormState, string>>>({});
  const [showPwd, setShowPwd] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [snack, setSnack] = React.useState<{open: boolean; message: string; severity: 'success'|'error'}>({
    open: false, message: '', severity: 'success'
  });

  const onChange =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = key === 'remember' ? (e.target as any).checked : e.target.value;
      setValues((s) => ({ ...s, [key]: v as any }));
      setErrors((err) => ({ ...err, [key]: undefined }));
    };

  const validate = (v: FormState) => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!v.email || !validateEmail(v.email)) e.email = 'Email invalide';
    if (!v.password) e.password = 'Mot de passe requis';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const eMap = validate(values);
    if (Object.keys(eMap).length) {
      setErrors(eMap);
      setSnack({ open: true, message: 'Veuillez corriger les erreurs.', severity: 'error' });
      return;
    }

    try {
      setSubmitting(true);

      // TODO: appelle ton API d’authentification ici (credentials)
      // const res = await fetch('/api/login', { method: 'POST', body: JSON.stringify(values) })
      // if (!res.ok) throw new Error('Bad credentials')

      // Simule une latence/OK
      await new Promise((r) => setTimeout(r, 700));

      setSnack({ open: true, message: 'Connexion réussie ✅', severity: 'success' });

      // Exemple: stocker un flag si "se souvenir de moi"
      if (values.remember) {
        try { localStorage.setItem('remember', '1'); } catch {}
      } else {
        try { localStorage.removeItem('remember'); } catch {}
      }

      setTimeout(() => router.push(redirect), 400);
    } catch {
      setSnack({ open: true, message: 'Email ou mot de passe incorrect.', severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, md: 6 } }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
        }}
      >
        <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>
          Connexion
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Heureux de vous revoir 👋
        </Typography>

        <Box component="form" noValidate onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid >
              <TextField
                type="email"
                label="Email"
                value={values.email}
                onChange={onChange('email')}
                fullWidth
                required
                error={!!errors.email}
                helperText={errors.email}
                autoComplete="email"
              />
            </Grid>

            <Grid>
              <TextField
                type={showPwd ? 'text' : 'password'}
                label="Mot de passe"
                value={values.password}
                onChange={onChange('password')}
                fullWidth
                required
                error={!!errors.password}
                helperText={errors.password}
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPwd((s) => !s)} edge="end" aria-label="afficher/masquer le mot de passe">
                        {showPwd ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={values.remember}
                    onChange={onChange('remember')}
                    color="primary"
                  />
                }
                label="Se souvenir de moi"
              />
              <Link href="/forgot-password" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" sx={{ color: 'primary.main' }}>
                  Mot de passe oublié ?
                </Typography>
              </Link>
            </Grid>
          </Grid>

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            sx={{ mt: 2 }}
            disabled={submitting}
          >
            {submitting ? 'Connexion…' : 'Se connecter'}
          </Button>

          <Divider sx={{ my: 3 }} />

          <Typography variant="body2" color="text.secondary" align="center">
            Nouveau sur Tsiki ?{' '}
            <Link href="/register" style={{ color: 'inherit', textDecoration: 'underline' }}>
              Créer un compte
            </Link>
          </Typography>
        </Box>
      </Paper>

      <Snackbar
        open={snack.open}
        autoHideDuration={2500}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          severity={snack.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}