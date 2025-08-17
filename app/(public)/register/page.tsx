'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Box, Container, Paper, Typography, TextField, Grid, Button,
  FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox,
  IconButton, InputAdornment, Snackbar, Alert, Divider
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  country?: string;
  password: string;
  confirm: string;
  acceptTos: boolean;
};

const COUNTRIES = [
  { code: 'MG', label: 'Madagascar' },
  { code: 'FR', label: 'France' },
  { code: 'US', label: 'États-Unis' },
  { code: 'CA', label: 'Canada' },
  { code: 'GB', label: 'Royaume-Uni' },
];

export default function RegisterPage() {
  const router = useRouter();

  const [values, setValues] = React.useState<FormState>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: 'MG',
    password: '',
    confirm: '',
    acceptTos: false,
  });

  const [showPwd, setShowPwd] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [snack, setSnack] = React.useState<{open: boolean; message: string; severity: 'success'|'error'}>({ open: false, message: '', severity: 'success' });

  const [errors, setErrors] = React.useState<Partial<Record<keyof FormState, string>>>({});

  const onChange =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => {
      const v = e?.target?.value;
      setValues((s) => ({ ...s, [key]: v }));
      setErrors((err) => ({ ...err, [key]: undefined }));
    };

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (pwd: string) =>
    pwd.length >= 8 && /[A-Za-z]/.test(pwd) && /\d/.test(pwd);

  const validate = (v: FormState) => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!v.firstName || v.firstName.trim().length < 2) e.firstName = 'Prénom requis (min. 2 caractères)';
    if (!v.lastName || v.lastName.trim().length < 2) e.lastName = 'Nom requis (min. 2 caractères)';
    if (!v.email || !validateEmail(v.email)) e.email = 'Email invalide';
    if (v.phone && v.phone.length < 6) e.phone = 'Téléphone invalide';
    if (!validatePassword(v.password))
      e.password = '8+ caractères, au moins 1 lettre et 1 chiffre';
    if (v.confirm !== v.password) e.confirm = 'Les mots de passe ne correspondent pas';
    if (!v.acceptTos) e.acceptTos = 'Obligatoire';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const eMap = validate(values);
    if (Object.keys(eMap).length) {
      setErrors(eMap);
      setSnack({ open: true, message: 'Veuillez corriger les erreurs du formulaire.', severity: 'error' });
      return;
    }

    try {
      setSubmitting(true);
      // TODO: appelle ton API d’inscription ici
      // await fetch('/api/register', { method:'POST', body: JSON.stringify(values) })

      // Simule une latence
      await new Promise((r) => setTimeout(r, 800));

      setSnack({ open: true, message: 'Compte créé avec succès 🎉', severity: 'success' });
      // Redirige par exemple vers la page de connexion
      setTimeout(() => router.push('/login'), 600);
    } catch {
      setSnack({ open: true, message: "Échec de l'inscription. Réessayez.", severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, md: 3 } }}>
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
          Créer un compte
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Rejoignez Tsiki pour vos achats en toute simplicité.
        </Typography>

        <Box component="form" noValidate onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid>
              <TextField
                label="Prénom"
                value={values.firstName}
                onChange={onChange('firstName')}
                fullWidth
                required
                error={!!errors.firstName}
                helperText={errors.firstName}
                autoComplete="given-name"
              />
            </Grid>
            <Grid>
              <TextField
                label="Nom"
                value={values.lastName}
                onChange={onChange('lastName')}
                fullWidth
                required
                error={!!errors.lastName}
                helperText={errors.lastName}
                autoComplete="family-name"
              />
            </Grid>

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
                label="Téléphone (optionnel)"
                value={values.phone}
                onChange={onChange('phone')}
                fullWidth
                error={!!errors.phone}
                helperText={errors.phone}
                autoComplete="tel"
              />
            </Grid>
            <Grid>
              <FormControl fullWidth>
                <InputLabel id="country-label">Pays</InputLabel>
                <Select
                  labelId="country-label"
                  label="Pays"
                  value={values.country ?? ''}
                  onChange={(e) => setValues((s) => ({ ...s, country: e.target.value }))}
                >
                  {COUNTRIES.map((c) => (
                    <MenuItem key={c.code} value={c.code}>
                      {c.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                helperText={errors.password ?? 'Au moins 8 caractères, 1 lettre, 1 chiffre'}
                autoComplete="new-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPwd((s) => !s)} edge="end" aria-label="afficher le mot de passe">
                        {showPwd ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid>
              <TextField
                type={showConfirm ? 'text' : 'password'}
                label="Confirmer le mot de passe"
                value={values.confirm}
                onChange={onChange('confirm')}
                fullWidth
                required
                error={!!errors.confirm}
                helperText={errors.confirm}
                autoComplete="new-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirm((s) => !s)} edge="end" aria-label="afficher la confirmation">
                        {showConfirm ? <VisibilityOff /> : <Visibility />}
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
                    checked={values.acceptTos}
                    onChange={(e) => setValues((s) => ({ ...s, acceptTos: e.target.checked }))}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2">
                    J’accepte les{' '}
                    <Link href="/legal/cgu" style={{ color: 'inherit', textDecoration: 'underline' }}>
                      Conditions d’utilisation
                    </Link>{' '}
                    et la{' '}
                    <Link href="/legal/privacy" style={{ color: 'inherit', textDecoration: 'underline' }}>
                      Politique de confidentialité
                    </Link>
                    .
                  </Typography>
                }
              />
              {errors.acceptTos && (
                <Typography variant="caption" color="error.main" sx={{ ml: 1 }}>
                  {errors.acceptTos}
                </Typography>
              )}
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
            {submitting ? 'Création…' : "S'inscrire"}
          </Button>

          <Divider sx={{ my: 3 }} />

          <Typography variant="body2" color="text.secondary" align="center">
            Déjà un compte ?{' '}
            <Link href="/login" style={{ color: 'inherit', textDecoration: 'underline' }}>
              Se connecter
            </Link>
          </Typography>
        </Box>
      </Paper>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
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