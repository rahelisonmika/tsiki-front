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

import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';


const COUNTRIES = [
  { code: 'MG', label: 'Madagascar' },
  { code: 'FR', label: 'France' },
  { code: 'US', label: 'États-Unis' },
  { code: 'CA', label: 'Canada' },
  { code: 'GB', label: 'Royaume-Uni' },
];

// ---------- Zod schema ----------
const schema = z.object({
  firstName: z.string().optional(),
  name: z.string().min(2, 'Nom requis (min. 2 caractères)'),
  email: z.string().email('Email invalide'),
  phone: z.string()
          .optional()
          .refine((v) => !v || v.length >= 6, 'Téléphone invalide'),
  country: z.string().min(1, 'Pays requis'),
  password: z.string()
             .min(8, '8+ caractères')
             .regex(/[A-Za-z]/, 'Au moins une lettre')
             .regex(/\d/, 'Au moins un chiffre'),
  confirm: z.string(),
  cin: z.string().min(12, 'Cin requis (min. 12 caractères)').max(12, 'Cin trop long (max. 12 caractères)'),
  adresse: z.string().min(2, 'Adresse requis (min. 2 caractères)'),
  acceptTos: z.boolean().refine((v) => v, 'Obligatoire'),
}).refine((data) => data.password === data.confirm, {
  path: ['confirm'],
  message: 'Les mots de passe ne correspondent pas',
});

type FormInput = z.infer<typeof schema>;

// ---------- Component ----------
export default function RegisterPage() {
  const router = useRouter();

  const [showPwd, setShowPwd] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [snack, setSnack] = React.useState<{open: boolean; message: string; severity: 'success'|'error'}>({
    open: false, message: '', severity: 'success'
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInput>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      firstName: '',
      name: '',
      email: '',
      phone: '',
      country: '',
      password: '',
      confirm: '',
      cin: '',
      adresse: '',
      acceptTos: false,
    },
  });

 const onSubmit = async (data: FormInput) => {
    try {
      // Construire le payload que l'API attend
      const payload = {
        email: data.email,
        phone: data.phone,
        name: data.name,
        country: data.country,
        cin: data.cin,
        adresse: data.adresse,
        password: data.password,
        first_name: data.firstName
      };

      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // IMPORTANT: n'envoie au serveur que les champs supportés par l'API
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // Lecture de l'erreur renvoyée par la route (ZodError ou conflit email)
        const err = await res.json().catch(() => ({}));

        if (res.status === 400 && Array.isArray(err?.error)) {
          // erreurs Zod côté API
          setSnack({ open: true, message: 'Validation serveur: champs invalides.', severity: 'error' });
        } else if (res.status === 409) {
          setSnack({ open: true, message: 'Email déjà utilisé.', severity: 'error' });
        } else {
          setSnack({ open: true, message: 'Erreur serveur.', severity: 'error' });
        }
        return;
      }

      // Succès
      setSnack({ open: true, message: 'Compte créé avec succès 🎉', severity: 'success' });
      setTimeout(() => router.push('/login'), 600);
    } catch (e) {
      setSnack({ open: true, message: "Échec de l'inscription. Réessayez.", severity: 'error' });
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

        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid sx={{width: '45%'}}>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Prénoms"
                    fullWidth
                    autoComplete="given-name"
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                  />
                )}
              />
            </Grid>

            <Grid sx={{width: '45%'}}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nom"
                    fullWidth
                    required
                    autoComplete="family-name"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>

            <Grid  sx={{width: '45%'}}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="email"
                    label="Email"
                    fullWidth
                    required
                    autoComplete="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>

            <Grid  sx={{width: '45%'}}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Téléphone (optionnel)"
                    fullWidth
                    autoComplete="tel"
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                  />
                )}
              />
            </Grid>

            <Grid sx={{width: '95%'}}>
              <Controller
                name="cin"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="cin"
                    fullWidth
                    required
                    autoComplete="cin"
                    error={!!errors.cin}
                    helperText={errors.cin?.message}
                  />
                )}
              />
            </Grid>

            <Grid sx={{width: '95%'}}>
              <Controller
                name="adresse"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="adresse"
                    fullWidth
                    required
                    autoComplete="adresse"
                    error={!!errors.adresse}
                    helperText={errors.adresse?.message}
                  />
                )}
              />
            </Grid>

            <Grid  sx={{width: '30%'}}>
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.country}>
                    <InputLabel id="country-label">Pays</InputLabel>
                    <Select
                      {...field}
                      labelId="country-label"
                      label="Pays"
                      value={field.value ?? ''}
                    >
                      {COUNTRIES.map((c) => (
                        <MenuItem key={c.code} value={c.code}>
                          {c.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.country && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                        {errors.country.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            {/* Mot de passe : pleine largeur */}
            <Grid  sx={{width: '60%'}}>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type={showPwd ? 'text' : 'password'}
                    label="Mot de passe"
                    fullWidth
                    required
                    autoComplete="new-password"
                    error={!!errors.password}
                    helperText={errors.password?.message ?? 'Au moins 8 caractères, 1 lettre, 1 chiffre'}
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
                )}
              />
            </Grid>

            {/* Confirmation : pleine largeur */}
            <Grid  sx={{width: '95%'}}>
              <Controller
                name="confirm"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type={showConfirm ? 'text' : 'password'}
                    label="Confirmer le mot de passe"
                    fullWidth
                    required
                    autoComplete="new-password"
                    error={!!errors.confirm}
                    helperText={errors.confirm?.message}
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
                )}
              />
            </Grid>

            <Grid>
              <Controller
                name="acceptTos"
                control={control}
                render={({ field }) => (
                  <>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={!!field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
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
                        {errors.acceptTos.message}
                      </Typography>
                    )}
                  </>
                )}
              />
            </Grid>
          </Grid>
          
          <Grid>   
            <Button
              sx={{width: '95%', mt: 2}}
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Création…' : "S'inscrire"}
            </Button>
          </Grid>

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
