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