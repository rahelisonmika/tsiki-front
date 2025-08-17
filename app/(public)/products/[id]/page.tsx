'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box, Container, Grid, Paper, Typography, Stack, Chip, Rating,
  IconButton, Button, Divider, TextField, Snackbar, Alert, Tooltip,
  Dialog, DialogContent, DialogTitle, DialogActions
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import ZoomInMapOutlinedIcon from '@mui/icons-material/ZoomInMapOutlined';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

//
// ---------- Types ----------
export type ProductOption = {
  name: string;            // ex: 'couleur' | 'taille' | 'mémoire' ...
  values: string[];        // ex: ['Noir','Bleu'] / ['S','M','L']
};

export type Product = {
  id: string;
  title: string;
  brand: string;
  image: string;           // image principale (fallback)
  images?: string[];       // galerie
  price: number;
  oldPrice?: number;
  rating: number;          // 0..5
  reviews: number;
  inStock: boolean;
  description: string;
  tags: string[];
  shipping?: string;
  options?: ProductOption[]; // ⇐ propriétés/variantes
};

//
// ---------- Demo data (remplace par ton fetch) ----------
const DEMO_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Casque Bluetooth Noir',
    brand: 'Aurafy',
    image: 'https://images.unsplash.com/photo-1679533662345-b321cf2d8792?q=80&w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1679533662345-b321cf2d8792?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518444054145-6a761f5c82d8?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200&auto=format&fit=crop',
    ],
    price: 59.9,
    oldPrice: 89.9,
    rating: 4.4,
    reviews: 326,
    inStock: true,
    description: 'Casque sans fil, réduction de bruit passive, 30h d’autonomie.',
    tags: ['Audio', 'Sans fil', 'Lifestyle'],
    shipping: 'Livraison 24-48h',
    options: [
      { name: 'couleur', values: ['Noir', 'Bleu', 'Blanc'] },
      { name: 'taille', values: ['S', 'M', 'L'] },
    ],
  },
  {
    id: '2',
    title: 'Montre Connectée Série S',
    brand: 'Pulse',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516726817505-f5ed825624d8?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop',
    ],
    price: 129.0,
    rating: 4.2,
    reviews: 198,
    inStock: true,
    description: 'Suivi santé, GPS, étanche 5 ATM, 7 jours d’autonomie.',
    tags: ['Wearable', 'Fitness'],
    shipping: 'Livraison 48h',
    options: [
      { name: 'couleur', values: ['Noir', 'Argent'] },
      { name: 'bracelet', values: ['Silicone', 'Tissu', 'Cuir'] },
      { name: 'taille', values: ['S', 'M'] },
    ],
  },
];

//
// ---------- Utils ----------
const LS_KEY = 'tsiki-cart';
type CartItem = {
  id: string;
  title: string;
  price: number;
  image?: string;
  qty: number;
  maxQty?: number;
  options?: Record<string, string>; // ⇐ on stocke les variantes choisies
};

function formatPrice(n: number, currency = 'EUR', locale = 'fr-FR') {
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(n);
  } catch {
    return `${n.toFixed(2)} ${currency}`;
  }
}
function loadCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]') as CartItem[]; } catch { return []; }
}
function saveCart(items: CartItem[]) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(items)); } catch {}
}
function addToCart(item: CartItem) {
  const items = loadCart();
  const i = items.findIndex((x) =>
    x.id === item.id &&
    JSON.stringify(x.options || {}) === JSON.stringify(item.options || {})
  );
  if (i >= 0) items[i].qty = Math.min((items[i].maxQty ?? 99), items[i].qty + item.qty);
  else items.push(item);
  saveCart(items);
}

//
// ---------- Composant : Zoom au survol (desktop) + plein écran ----------
function ImageZoom({
  src,
  zoom = 2.4,
  height = 480,
  onOpenFull
}: { src: string; zoom?: number; height?: number; onOpenFull: () => void }) {
  const imgRef = React.useRef<HTMLImageElement | null>(null);
  const [bgPos, setBgPos] = React.useState('50% 50%');
  const [hover, setHover] = React.useState(false);
  const [imgSrc, setImgSrc] = React.useState(src);

  React.useEffect(() => setImgSrc(src), [src]);

  const handleMove = (e: React.MouseEvent) => {
    const img = imgRef.current;
    if (!img) return;
    const rect = img.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setBgPos(`${x}% ${y}%`);
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <Paper variant="outlined" sx={{ overflow: 'hidden', borderRadius: 2, position: 'relative', height }}>
        <img
          ref={imgRef}
          src={imgSrc}
          alt="product"
          onError={() =>
            setImgSrc(
              'data:image/svg+xml;utf8,' +
              encodeURIComponent(
                `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="${height}">
                  <rect width="100%" height="100%" fill="#eee"/>
                  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#999" font-size="16">
                    Image indisponible
                  </text>
                </svg>`
              )
            )
          }
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            cursor: 'zoom-in'
          }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onMouseMove={handleMove}
          onClick={onOpenFull}
          draggable={false}
        />
      </Paper>

      {/* Fenêtre de zoom (visible md+) */}
      <Box
        sx={{
          display: { xs: 'none', md: 'block' },
          position: 'absolute',
          top: 0,
          right: -16,
          transform: 'translateX(100%)',
          width: height * 0.85,
          height: height * 0.85,
          ml: 2,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: 1,
          backgroundImage: `url(${imgSrc})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: `${zoom * 100}%`,
          backgroundPosition: bgPos,
          opacity: hover ? 1 : 0,
          pointerEvents: 'none',
          transition: 'opacity .15s ease',
          zIndex: (t) => t.zIndex.appBar + 1,
        }}
      />
      {/* Bouton plein écran */}
      <Tooltip title="Ouvrir en grand">
        <IconButton
          onClick={onOpenFull}
          size="small"
          sx={{
            position: 'absolute',
            right: 8,
            bottom: 8,
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            '&:hover': { bgcolor: 'background.paper' },
          }}
        >
          <ZoomInMapOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

//
// ---------- Page Produit ----------
export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  // Remplace ici par ton fetch (server action / RSC / API)
  const product = React.useMemo(
    () => DEMO_PRODUCTS.find((p) => p.id === params?.id) ?? DEMO_PRODUCTS[0],
    [params?.id]
  );

  // Galerie (fallback sur image principale)
  const gallery = React.useMemo<string[]>(
    () => (product.images?.length ? product.images : [product.image]),
    [product]
  );

  const [activeIdx, setActiveIdx] = React.useState(0);
  const mainSrc = React.useMemo(
    () => gallery[activeIdx] || product.image || '',
    [gallery, activeIdx, product.image]
  );

  // Sélections d’options (initialisées au premier choix de chaque option)
  const [selected, setSelected] = React.useState<Record<string, string>>({});
  React.useEffect(() => {
    const initial: Record<string, string> = {};
    (product.options || []).forEach((opt) => {
      if (opt.values.length) initial[opt.name] = opt.values[0];
    });
    setSelected(initial);
  }, [product]);

  const [qty, setQty] = React.useState<number>(1);
  const [snack, setSnack] = React.useState<{ open: boolean; msg: string; sev: 'success' | 'error' }>({
    open: false, msg: '', sev: 'success',
  });

  // Dialog plein écran
  const [openViewer, setOpenViewer] = React.useState(false);
  const [scale, setScale] = React.useState(1.3);
  const [offset, setOffset] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [drag, setDrag] = React.useState<{ dx: number; dy: number } | null>(null);

  const hasDiscount = !!product.oldPrice && product.oldPrice > product.price;
  const percentOff = hasDiscount ? Math.round((1 - product.price / product.oldPrice!) * 100) : 0;

  const handleAddToCart = () => {
    if (!product.inStock) {
      setSnack({ open: true, msg: 'Produit indisponible.', sev: 'error' });
      return;
    }
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: mainSrc,
      qty,
      maxQty: 10,
      options: selected,
    });
    setSnack({ open: true, msg: 'Ajouté au panier ✅', sev: 'success' });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setSnack({ open: true, msg: 'Lien copié dans le presse-papiers', sev: 'success' });
    } catch {
      setSnack({ open: true, msg: 'Impossible de copier le lien', sev: 'error' });
    }
  };

  // Viewer handlers
  const openFull = () => { setOpenViewer(true); setScale(1.3); setOffset({ x: 0, y: 0 }); };
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const next = Math.max(1, Math.min(4, scale + (e.deltaY < 0 ? 0.1 : -0.1)));
    setScale(next);
  };
  const onMouseDown = (e: React.MouseEvent) => setDrag({ dx: e.clientX - offset.x, dy: e.clientY - offset.y });
  const onMouseUp = () => setDrag(null);
  const onMouseMove = (e: React.MouseEvent) => { if (drag) setOffset({ x: e.clientX - drag.dx, y: e.clientY - drag.dy }); };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Grid container spacing={4}>
        {/* Colonne image */}
        <Grid>
          {/* Desktop : rail vertical à gauche + image principale */}
          <Stack direction="row" spacing={2} alignItems="flex-start">
            {/* Thumbnails (desktop) */}
            <Stack
              spacing={1}
              sx={{
                display: { xs: 'none', md: 'flex' },
                maxHeight: 480,
                overflowY: 'auto',
                pr: 0.5,
              }}
            >
              {gallery.map((src, i) => {
                const active = i === activeIdx;
                return (
                  <Box
                    key={src + i}
                    onClick={() => setActiveIdx(i)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setActiveIdx(i)}
                    sx={{
                      width: 72,
                      height: 72,
                      borderRadius: 1.5,
                      border: '2px solid',
                      borderColor: active ? 'primary.main' : 'divider',
                      overflow: 'hidden',
                      cursor: 'pointer',
                    }}
                  >
                    <img
                      src={src}
                      alt={`vignette ${i + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </Box>
                );
              })}
            </Stack>

            {/* Image principale avec zoom (taille fixe desktop) */}
            <Box
              sx={{
                flex: { md: '0 0 400px' },       // largeur figée en desktop
                width: { xs: '100%', md: 400 },
                minWidth: { xs: 'auto', md: 400 },
                maxWidth: { xs: 'auto', md: 480 },
              }}
            >
              <ImageZoom src={mainSrc} zoom={2.4} height={480} onOpenFull={openFull} />
            </Box>
          </Stack>

          {/* Mobile : bandeau horizontal de vignettes sous l’image */}
          <Stack
            direction="row"
            spacing={1}
            sx={{
              display: { xs: 'flex', md: 'none' },
              mt: 1.5,
              overflowX: 'auto',
              pb: 0.5,
            }}
          >
            {gallery.map((src, i) => {
              const active = i === activeIdx;
              return (
                <Box
                  key={src + i}
                  onClick={() => setActiveIdx(i)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setActiveIdx(i)}
                  sx={{
                    width: 68,
                    height: 68,
                    borderRadius: 1.5,
                    border: '2px solid',
                    borderColor: active ? 'primary.main' : 'divider',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    flex: '0 0 auto',
                  }}
                >
                  <img
                    src={src}
                    alt={`vignette ${i + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </Box>
              );
            })}
          </Stack>
        </Grid>

        {/* Colonne détails */}
        <Grid>
          <Stack spacing={2}>
            {/* Titre + brand */}
            <Box>
              <Typography variant="h5" fontWeight={700}>{product.title}</Typography>
              <Typography variant="body2" color="text.secondary">{product.brand}</Typography>
            </Box>

            {/* Rating */}
            <Stack direction="row" spacing={1} alignItems="center">
              <Rating size="small" precision={0.1} readOnly value={product.rating} />
              <Typography variant="body2" color="text.secondary">({product.reviews})</Typography>
              {!product.inStock && <Chip size="small" color="default" label="Indisponible" />}
            </Stack>

            {/* Prix */}
            <Stack direction="row" spacing={2} alignItems="baseline">
              <Typography variant="h4" fontWeight={800}>{formatPrice(product.price)}</Typography>
              {product.oldPrice && product.oldPrice > product.price && (
                <>
                  <Typography variant="body1" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                    {formatPrice(product.oldPrice)}
                  </Typography>
                  <Chip
                    color="primary"
                    size="small"
                    label={`-${Math.round((1 - product.price / product.oldPrice) * 100)}%`}
                  />
                </>
              )}
            </Stack>

            <Divider />

            {/* Description */}
            <Typography color="text.secondary">{product.description}</Typography>

            {/* Tags */}
            {!!product.tags?.length && (
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                {product.tags.map((t) => <Chip key={t} label={t} variant="outlined" size="small" />)}
              </Stack>
            )}

            {/* Livraison */}
            {product.shipping && (
              <Typography variant="body2" color="text.secondary">📦 {product.shipping}</Typography>
            )}

            {/* Options / Variantes */}
            {!!product.options?.length && (
              <Stack spacing={1.5}>
                {product.options.map((opt) => (
                  <Box key={opt.name}>
                    <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 600, textTransform: 'capitalize' }}>
                      {opt.name}
                    </Typography>
                    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                      {opt.values.map((val) => {
                        const isSelected = selected[opt.name] === val;
                        // Style spécial pour "couleur"
                        const isColor = opt.name.toLowerCase().includes('couleur');
                        return (
                          <Chip
                            key={val}
                            label={val}
                            clickable
                            color={isSelected ? 'primary' : 'default'}
                            variant={isSelected ? 'filled' : 'outlined'}
                            onClick={() => setSelected((s) => ({ ...s, [opt.name]: val }))}
                            sx={{
                              ...(isColor
                                ? {
                                    borderWidth: 2,
                                    borderStyle: 'solid',
                                    borderColor: isSelected ? 'primary.main' : 'divider',
                                    bgcolor: isSelected ? 'primary.light' : 'background.paper',
                                  }
                                : {}),
                            }}
                          />
                        );
                      })}
                    </Stack>
                  </Box>
                ))}
              </Stack>
            )}

            {/* Quantité + actions */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, px: 1 }}>
                <IconButton size="small" onClick={() => setQty((q) => Math.max(1, q - 1))}><RemoveIcon fontSize="small" /></IconButton>
                <TextField
                  value={qty}
                  size="small"
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', style: { textAlign: 'center', width: 56 } }}
                  onChange={(e) => {
                    const v = Math.max(1, Math.min(99, parseInt(e.target.value.replace(/[^\d]/g, '') || '1', 10)));
                    setQty(v);
                  }}
                />
                <IconButton size="small" onClick={() => setQty((q) => Math.min(99, q + 1))}><AddIcon fontSize="small" /></IconButton>
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ flexGrow: 1 }}>
                <Button variant="contained" size="large" onClick={handleAddToCart} disabled={!product.inStock}>
                  Ajouter au panier
                </Button>
                <Button variant="outlined" size="large" onClick={handleBuyNow} disabled={!product.inStock}>
                  Acheter maintenant
                </Button>
              </Stack>
            </Stack>

            {/* Actions secondaires */}
            <Stack direction="row" spacing={1}>
              <Tooltip title="Ajouter aux favoris">
                <IconButton><FavoriteBorderIcon /></IconButton>
              </Tooltip>
              <Tooltip title="Partager le lien">
                <IconButton onClick={copyLink}><ShareOutlinedIcon /></IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </Grid>
      </Grid>

      {/* Visionneuse plein écran */}
      <Dialog open={openViewer} onClose={() => setOpenViewer(false)} fullWidth maxWidth="lg">
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Aperçu
          <IconButton onClick={() => setOpenViewer(false)}><CloseRoundedIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box
            onWheel={onWheel}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseUp}
            sx={{
              cursor: drag ? 'grabbing' : 'grab',
              overflow: 'hidden',
              height: { xs: 360, sm: 520 },
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              position: 'relative',
            }}
          >
            <img
              src={mainSrc}
              alt={product.title}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                transformOrigin: 'center center',
                maxWidth: '100%',
                maxHeight: '100%',
                userSelect: 'none',
                pointerEvents: 'none',
              }}
              draggable={false}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={1}>
            <Button onClick={() => setScale((s) => Math.max(1, s - 0.2))}>-</Button>
            <Button onClick={() => setScale((s) => Math.min(4, s + 0.2))}>+</Button>
            <Button onClick={() => { setScale(1.3); setOffset({ x: 0, y: 0 }); }}>Réinitialiser</Button>
          </Stack>
          <Button variant="contained" onClick={() => setOpenViewer(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={2200}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnack((s) => ({ ...s, open: false }))} severity={snack.sev} variant="filled" sx={{ width: '100%' }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Container>
  );
}
