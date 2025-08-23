'use client';

import * as React from 'react';
import { Container, Stack, Typography, Button, TextField, Card, CardContent } from '@mui/material';

import Products from "@/components/products/Products";
import {Product} from '@/types/product';
import {items} from '@/types/product';

export default function Page() {
  
  return (
    <Container>
      <Products items={items} currency="EUR" locale="fr-FR" />
    </Container>
  );
}