'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Box, Container, Grid, Card, CardContent, CardActions, Paper,
  Typography, Stack, IconButton, Button, Divider, TextField, InputAdornment,
  Snackbar, Alert
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';

/* ---------------- Demo products (ta liste) ---------------- */
type Product = {
  id: string;
  title: string;
  brand: string;
  image: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  inStock: boolean;
  description: string;
  tags: string[];
  shipping?: string;
};

const DEMO_PRODUCTS: Product[] = [
  {
    id: "1",
    title: "Casque Bluetooth Noir",
    brand: "Aurafy",
    image: "https://images.unsplash.com/photo-1679533662345-b321cf2d8792?q=80&w=667&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?q=80&w=1200&auto=format&fit=crop",
    price: 59.9,
    oldPrice: 89.9,
    rating: 4.4,
    reviews: 326,
    inStock: true,
    description: "Casque sans fil, réduction de bruit passive, 30h d’autonomie.",
    tags: ["Audio", "Sans fil", "Lifestyle"],
    shipping: "Livraison 24-48h",
  },
  {
    id: "2",
    title: "Montre Connectée Série S",
    brand: "Pulse",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&auto=format&fit=crop",
    price: 129.0,
    rating: 4.2,
    reviews: 198,
    inStock: true,
    description: "Suivi santé, GPS, étanche 5 ATM, 7 jours d’autonomie.",
    tags: ["Wearable", "Fitness"],
    shipping: "Livraison 48h",
  },
  {
    id: "3",
    title: "Appareil Photo Mirrorless",
    brand: "Lumina",
    image: "https://images.unsplash.com/photo-1606986601547-a4d886b671b2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?q=80&w=1200&auto=format&fit=crop",
    price: 699.0,
    oldPrice: 799.0,
    rating: 4.7,
    reviews: 742,
    inStock: true,
    description: "Capteur APS-C 24MP, 4K30, écran orientable, Wi-Fi.",
    tags: ["Photo", "4K"],
    shipping: "Livraison gratuite",
  },
  {
    id: "4",
    title: "Chaussures Running Pro",
    brand: "SwiftRun",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop",
    price: 89.0,
    rating: 4.1,
    reviews: 140,
    inStock: false,
    description: "Amorti réactif, mesh respirant, semelle anti-dérapante.",
    tags: ["Sport"],
    shipping: "—",
  },
  {
    id: "5",
    title: "Sac à Dos Urbain 24L",
    brand: "Carry",
    image: "https://images.unsplash.com/photo-1528921581519-52b9d779df2b?q=80&w=988&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?q=80&w=1200&auto=format&fit=crop",
    price: 49.0,
    rating: 4.0,
    reviews: 88,
    inStock: true,
    description: "Compartiment laptop 16”, anti-pluie, poches rapides.",
    tags: ["Lifestyle", "Voyage"],
    shipping: "Livraison 72h",
  },
  {
    id: "6",
    title: "Lampe de Bureau LED",
    brand: "Glow",
    image: "https://images.unsplash.com/photo-1675320458457-fe4576cbd0f8?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?q=80&w=1200&auto=format&fit=crop",
    price: 24.9,
    rating: 4.3,
    reviews: 310,
    inStock: true,
    description: "Température réglable, USB-C, faible consommation.",
    tags: ["Maison"],
    shipping: "Livraison 48h",
  },
  {
    id: "7",
    title: "Clavier Mécanique 75%",
    brand: "KeyLabs",
    image: "https://images.unsplash.com/photo-1648392368628-6e984d89e2f3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?q=80&w=1200&auto=format&fit=crop",
    price: 109.0,
    rating: 4.6,
    reviews: 512,
    inStock: true,
    description: "Switches tactiles, RGB, hot-swap, Bluetooth/USB.",
    tags: ["Informatique", "Gaming", "Bureau"],
    shipping: "Livraison 24-48h",
  },
  {
    id: "8",
    title: "Gourde Isotherme 1L",
    brand: "TrailGo",
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1200&auto=format&fit=crop",
    price: 19.9,
    rating: 4.5,
    reviews: 267,
    inStock: true,
    description: "Acier inoxydable, conserve 24h froid / 12h chaud.",
    tags: ["Outdoor"],
    shipping: "Livraison 72h",
  },
];

/* ---------------- Cart logic ---------------- */
type CartItem = {
  id: string;
  title: string;
  price: number;
  image?: string;
  qty: number;
  maxQty?: number;
};

type Coupon = { code: string; percentOff: number };

const LS_KEY = 'tsiki-cart';
const DEMO_COUPONS: Coupon[] = [{ code: 'WELCOME10', percentOff: 10 }];

function formatPrice(n: number, currency = 'EUR', locale = 'fr-FR') {
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(n);
  } catch {
    return `${n.toFixed(2)} ${currency}`;
  }
}

function loadCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  } catch {}
}

// Helper: transforme un Product en CartItem
function productToCartItem(p: Product, qty = 1): CartItem {
  return { id: p.id, title: p.title, price: p.price, image: p.image, qty, maxQty: 10 };
}

export default function CartPage() {
  const router = useRouter();

  const [items, setItems] = React.useState<CartItem[]>([]);
  const [couponInput, setCouponInput] = React.useState('');
  const [appliedCoupon, setAppliedCoupon] = React.useState<Coupon | null>(null);
  const [snack, setSnack] = React.useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success',
  });

  // 1) Charger le panier
  React.useEffect(() => {
    const initial = loadCart();

    // 2) S'il est vide, on pré-remplit avec 3 produits démo (id 1, 2, 7)
    if (!initial.length) {
      const seed = [
        productToCartItem(DEMO_PRODUCTS.find(p => p.id === '1')!, 1),
        productToCartItem(DEMO_PRODUCTS.find(p => p.id === '2')!, 2), // exemple: qty 2
        productToCartItem(DEMO_PRODUCTS.find(p => p.id === '7')!, 1),
      ].filter(Boolean) as CartItem[];

      setItems(seed);
      saveCart(seed); // persiste tout de suite
    } else {
      setItems(initial);
    }
  }, []);

  // 3) Persister à chaque modification
  React.useEffect(() => {
    saveCart(items);
  }, [items]);

  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);
  const discount = appliedCoupon ? (subtotal * appliedCoupon.percentOff) / 100 : 0;
  const total = Math.max(0, subtotal - discount);

  const inc = (id: string) =>
    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, qty: Math.min((it.maxQty ?? 99), it.qty + 1) } : it
      )
    );

  const dec = (id: string) =>
    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, qty: Math.max(1, it.qty - 1) } : it
      )
    );

  const remove = (id: string) =>
    setItems((prev) => prev.filter((it) => it.id !== id));

  const clear = () => {
    setItems([]);
    setAppliedCoupon(null);
    setCouponInput('');
  };

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    const found = DEMO_COUPONS.find((c) => c.code === code);
    if (!found) {
      setSnack({ open: true, message: 'Code promo invalide.', severity: 'error' });
      return;
    }
    setAppliedCoupon(found);
    setSnack({ open: true, message: `Code appliqué: -${found.percentOff}%`, severity: 'success' });
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setSnack({ open: true, message: 'Code promo retiré.', severity: 'success' });
  };

  const goCheckout = () => {
    if (items.length === 0) {
      setSnack({ open: true, message: 'Votre panier est vide.', severity: 'error' });
      return;
    }
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <Container
        maxWidth={false}
        sx={{
          minHeight: '40vh',
          display: 'grid',
          placeItems: 'center',        // ← centre le papier vide au milieu
          py: { xs: 4, md: 6 },
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 720, mx: 'auto' }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 3,
              textAlign: 'center',
            }}
          >
            <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
              Votre panier est vide
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Parcourez nos catégories et trouvez votre bonheur.
            </Typography>
            <Stack direction="row" spacing={1} justifyContent="center">
              <Button component={Link} href="/" variant="contained">
                Continuer vos achats
              </Button>
              <Button component={Link} href="/c" variant="outlined">
                Voir les catégories
              </Button>
            </Stack>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container
      maxWidth={false}
      sx={{
        py: { xs: 4, md: 3 },
        display: 'flex',
        justifyContent: 'center',   // ← centre le wrapper
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 1100, mx: 'auto' }}> {/* ← largeur max + centré */}
        <Grid container spacing={3} justifyContent="center">   {/* ← garde le grid centré */}
          {/* Colonne gauche: items */}
          <Grid>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, md: 3 },
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3,
              }}
            >
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Panier ({items.reduce((n, it) => n + it.qty, 0)})
              </Typography>

              <Stack divider={<Divider />} spacing={2}>
                {items.map((it) => (
                  <Box key={it.id} sx={{ display: 'flex', gap: 2, alignItems: { xs: 'flex-start', sm: 'center' } }}>
                    {/* Image */}
                    <Box
                      sx={{
                        width: 96,
                        height: 96,
                        bgcolor: 'action.hover',
                        borderRadius: 2,
                        overflow: 'hidden',
                        flexShrink: 0,
                      }}
                    >
                      {it.image && (
                        <img
                          src={it.image}
                          alt={it.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                      )}
                    </Box>

                    {/* Infos */}
                    <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        sx={{ mb: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      >
                        {it.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Prix unitaire : {formatPrice(it.price)}
                      </Typography>

                      {/* Quantité + total ligne + supprimer */}
                      <Stack direction="row" spacing={1} alignItems="center">
                        <IconButton size="small" onClick={() => dec(it.id)} aria-label="diminuer">
                          <RemoveIcon fontSize="small" />
                        </IconButton>

                        <TextField
                          value={it.qty}
                          inputProps={{
                            inputMode: 'numeric',
                            pattern: '[0-9]*',
                            style: { textAlign: 'center', width: 48 },
                          }}
                          size="small"
                          onChange={(e) => {
                            const raw = e.target.value.replace(/[^\d]/g, '');
                            const v = Math.max(1, Math.min(parseInt(raw || '1', 10), it.maxQty ?? 999));
                            setItems((prev) => prev.map((p) => (p.id === it.id ? { ...p, qty: v } : p)));
                          }}
                        />

                        <IconButton size="small" onClick={() => inc(it.id)} aria-label="augmenter">
                          <AddIcon fontSize="small" />
                        </IconButton>

                        <Box sx={{ flexGrow: 1 }} />

                        <Typography fontWeight={700}>
                          {formatPrice(it.price * it.qty)}
                        </Typography>

                        <IconButton aria-label="supprimer" onClick={() => remove(it.id)}>
                          <DeleteOutlineIcon />
                        </IconButton>
                      </Stack>

                      {it.maxQty && (
                        <Typography variant="caption" color="text.secondary">
                          Stock max: {it.maxQty}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ))}
              </Stack>

              {/* Actions bas de liste */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 3 }}>
                <Button component={Link} href="/" variant="outlined">
                  Continuer vos achats
                </Button>
                <Box sx={{ flexGrow: 1 }} />
                <Button color="error" variant="text" onClick={clear}>
                  Vider le panier
                </Button>
              </Stack>
            </Paper>
          </Grid>

          {/* Colonne droite: résumé */}
          <Grid>
            <Card
              sx={{
                position: { md: 'sticky' },
                top: { md: 24 },
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3,
                boxShadow: 'none',
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                  Résumé
                </Typography>

                {/* Code promo */}
                <TextField
                  label="Code promo"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  size="small"
                  fullWidth
                  placeholder="Ex: WELCOME10"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocalOfferOutlinedIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
                <Stack direction="row" spacing={1} sx={{ mt: 1, mb: 2 }}>
                  <Button variant="outlined" onClick={applyCoupon} disabled={!couponInput.trim()}>
                    Appliquer
                  </Button>
                  {appliedCoupon && (
                    <Button variant="text" color="error" onClick={removeCoupon}>
                      Retirer le code
                    </Button>
                  )}
                </Stack>

                <Stack spacing={1.25} sx={{ '& .row': { display: 'flex', justifyContent: 'space-between' } }}>
                  <Box className="row">
                    <Typography color="text.secondary">Sous-total</Typography>
                    <Typography>{formatPrice(subtotal)}</Typography>
                  </Box>

                  {appliedCoupon && (
                    <Box className="row">
                      <Typography color="text.secondary">Remise ({appliedCoupon.code})</Typography>
                      <Typography>-{formatPrice(discount)}</Typography>
                    </Box>
                  )}

                  <Box className="row">
                    <Typography color="text.secondary">Livraison</Typography>
                    <Typography color="text.secondary">Calculée au paiement</Typography>
                  </Box>

                  <Divider sx={{ my: 1 }} />

                  <Box className="row">
                    <Typography variant="subtitle1" fontWeight={700}>
                      Total
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={700}>
                      {formatPrice(total)}
                    </Typography>
                  </Box>

                  <Typography variant="caption" color="text.secondary">
                    Les taxes et frais de livraison seront calculés à l’étape suivante.
                  </Typography>
                </Stack>
              </CardContent>

              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button variant="contained" color="primary" size="large" fullWidth onClick={goCheckout}>
                  Passer au paiement
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Box>

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