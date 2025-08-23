"use client";
import * as React from "react";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Rating,
  Stack,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import { ProductsProps } from './Products.type';
import AddToCartButton from '@/components/addToCartButton/AddToCartButton'

const clamp2Lines = {
  overflow: "hidden",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical" as const,
};

function formatCurrency(value?: number, locale = "fr-FR", currency = "EUR") {
  if (typeof value !== "number") return "";
  try {
    return new Intl.NumberFormat(locale, { style: "currency", currency }).format(value);
  } catch {
    return value.toFixed(2);
  }
}

function discountPercent(p: Product): number | null {
  if (typeof p.oldPrice === "number" && p.oldPrice > 0 && p.oldPrice > p.price) {
    return Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100);
  }
  return null;
}

export default function Products({
  items,
  //onSelect,
  urlProduct = "products",
  locale = "fr-FR",
  currency = "EUR",
  sortByPrice = "asc",
}: ProductsProps) {
  const [sort, setSort] = React.useState<"asc" | "desc">(sortByPrice);
  const router   = useRouter();

  const sortedItems = React.useMemo(() => {
    if (!Array.isArray(items)) return [] as Product[];
    const copy = [...items];
    copy.sort((a, b) => (sort === "desc" ? b.price - a.price : a.price - b.price));
    return copy;
  }, [items, sort]);
  if (!items || items.length === 0) {
    return (
      <Box
        sx={{
          p: 6,
          border: 1,
          borderColor: "divider",
          borderRadius: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="h6" mt={1} mb={0.5}>
          Aucun produit
        </Typography>
        <Typography variant="body2" color="text.secondary">
          La liste fournie est vide.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        // Mobile: 2 colonnes; ≥600px: 4 colonnes (CSS only → pas de mismatch SSR)
        gridTemplateColumns: {
          xs: "repeat(2, minmax(0, 1fr))",
          sm: "repeat(4, minmax(0, 1fr))",
        },
        gap: 2,
      }}
    >
      <Box></Box>
      <Box sx={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end" }}>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="sort-price-label">Trier</InputLabel>
          <Select
            labelId="sort-price-label"
            label="Trier"
            value={sort}
            onChange={(e) => setSort(e.target.value as "asc" | "desc")}
          >
            <MenuItem value="asc">Prix ↑ (croissant)</MenuItem>
            <MenuItem value="desc">Prix ↓ (décroissant)</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {sortedItems.map((p) => {
        const promo    = discountPercent(p);
        const hasPromo = promo !== null;
        return (
          <Box key={p.id} sx={{ minWidth: 0 }}>
            <Card
              variant="outlined"
              sx={{
                height: "100%",
                borderRadius: 3,
                transition: (theme) =>
                  theme.transitions.create(["transform", "box-shadow"], { duration: 160 }),
                "&:hover": {
                  boxShadow: 3,
                  transform: "translateY(-2px)",
                },
              }}
            >
              {/* IMPORTANT: CardActionArea en <div> (pas <button>) pour éviter bouton imbriqué */}
              <CardActionArea component="div" onClick={() => {router.push("/"+urlProduct+"/"+p.id)}} sx={{ alignItems: "stretch", height: "100%" }}>
                {/* Image + badge promo */}
                <Box sx={{ position: "relative" }}>
                  {p.image ? (
                    <CardMedia
                      component="img"
                      src={p.image}
                      alt={p.title}
                      sx={{ height: { xs: 140, sm: 160, md: 180 }, objectFit: "cover" }}
                    />
                  ) : (
                    <Box
                      sx={{
                        height: { xs: 140, sm: 160, md: 180 },
                        bgcolor: "action.hover",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                    </Box>
                  )}

                  {hasPromo && (
                    <Chip
                      label={`Promo -${promo}%`}
                      color="error"
                      size="small"
                      sx={{ position: "absolute", top: 8, left: 8, fontWeight: 700 }}
                    />
                  )}
                </Box>

                <CardContent sx={{ display: "grid", gap: 1 }}>
                  {/* Titre */}
                  <Typography
                    variant="subtitle1"
                    title={p.title}
                    sx={{ fontWeight: 600, fontSize: { xs: ".95rem", sm: "1rem" }, ...clamp2Lines }}
                  >
                    {p.title}
                  </Typography>

                  {/* Prix */}
                  <Stack direction="row" spacing={1} alignItems="baseline">
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: { xs: 700, sm: 600 },
                        fontSize: { xs: "1rem", sm: "1.25rem" },
                        color: hasPromo ? "error.main" : undefined,
                      }}
                    >
                      {formatCurrency(p.price, locale, currency)}
                    </Typography>
                    {typeof p.oldPrice === "number" && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textDecoration: "line-through", display: { xs: "none", sm: "inline" } }}
                      >
                        {formatCurrency(p.oldPrice, locale, currency)}
                      </Typography>
                    )}
                  </Stack>

                  {/* Actions: bouton + statut sur la même ligne */}
                  <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                    <Box sx={{ display: "flex", gap: 1, flexGrow: 1 }}>
                      {/* Bouton mobile (contained) */}
                      {/* <Button
                        size="small"
                        variant="contained"
                        disableElevation
                        disabled={!p.inStock}
                        title={p.inStock ? "Ajouter au panier" : "Indisponible"}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onAddToCart?.(p);
                        }}
                        sx={{
                          borderRadius: 2,
                          px: 1.5,
                          minWidth: 0,
                          display: { xs: "inline-flex", sm: "none" },
                          bgcolor: "brandButtonPrimary.main",
                          color: "brandButtonPrimary.light",
                          "&:hover": { bgcolor: "brandButtonPrimary.dark" },
                          "&.Mui-disabled": { bgcolor: "action.disabledBackground", color: "action.disabled" },
                        }}
                      >
                        Ajouter
                      </Button> */}

                      {/* Bouton desktop (outlined + icône) */}
                      <Box onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}>
                          <AddToCartButton product={p} typeButton="basic"/>
                      </Box>
                        
                      {/* <Button
                        size="small"
                        variant="outlined"
                        startIcon={<AddShoppingCartOutlinedIcon />}
                        disabled={!p.inStock}
                        title={p.inStock ? "Ajouter au panier" : "Indisponible"}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onAddToCart?.(p);
                        }}
                        sx={{
                          borderRadius: 2,
                          display: { xs: "none", sm: "inline-flex" },
                          bgcolor: "brandButtonPrimary.main",
                          color: "brandButtonPrimary.light",
                          "&:hover": { bgcolor: "brandButtonPrimary.dark" },
                          "&.Mui-disabled": { bgcolor: "action.disabledBackground", color: "action.disabled" },
                        }}
                      >
                        Ajouter
                      </Button> */}
                    </Box>

                    {/* Statut stock (toujours visible) */}
                    {typeof p.inStock === "boolean" && (
                      <Chip
                        size="small"
                        variant={p.inStock ? (hasPromo ? "filled" : "outlined") : "outlined"}
                        color={p.inStock ? "success" : "default"}
                        label={p.inStock ? "En stock" : "Rupture"}
                        sx={{ flexShrink: 0 }}
                      />
                    )}
                  </Stack>

                  {/* Marque (cachée sur mobile) */}
                  {p.brand && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: { xs: "none", sm: "inline" } }}>
                      {p.brand}
                    </Typography>
                  )}

                  {/* Rating (caché sur mobile) */}
                  {typeof p.rating === "number" && (
                    <Stack direction="row" spacing={0.5} alignItems="center" sx={{ display: { xs: "none", sm: "flex" } }}>
                      <Rating value={p.rating} precision={0.5} size="small" readOnly />
                      {typeof p.reviews === "number" && (
                        <Typography variant="caption" color="text.secondary">
                          ({p.reviews})
                        </Typography>
                      )}
                    </Stack>
                  )}

                  {/* Description (cachée sur mobile) */}
                  {p.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ ...clamp2Lines, display: { xs: "none", sm: "-webkit-box" } }}>
                      {p.description}
                    </Typography>
                  )}

                  {/* Tags + shipping (cachés sur mobile) */}
                  {((Array.isArray(p.tags) && p.tags.length > 0) || p.shipping) && (
                    <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap", display: { xs: "none", sm: "flex" } }}>
                      {p.shipping && <Chip size="small" variant="outlined" label={p.shipping} />}
                    </Stack>
                  )}

                  <Stack
                    direction="row"
                    useFlexGap
                    sx={{
                      display: { xs: 'none', sm: 'flex' },
                      flexWrap: 'wrap',
                      columnGap: 0.5,    // équiv. spacing horizontal
                      rowGap: 0.5,       // espacement vertical entre lignes
                      mb: 1.5,           // marge basse
                    }}
                  >
                    {Array.isArray(p.tags) &&
                      p.tags.slice(0, 3).map((t) => (
                        <Chip key={t} size="small" variant="outlined" label={t} />
                      ))}
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          </Box>
        );
      })}
      <Box></Box>
    </Box>
    
  );
}

/*
// Exemple d'utilisation :
import Products, { Product } from "./Products";

const items: Product[] = [
  {
    id: "1",
    title: "Casque Bluetooth Noir",
    brand: "Aurafy",
    image: "https://images.unsplash.com/photo-1679533662345-b321cf2d8792",
    price: 59.9,
    oldPrice: 89.9,
    rating: 4.5,
    reviews: 128,
    inStock: true,
    description: "Casque sans fil confortable avec réduction de bruit.",
    tags: ["Sans fil", "Noise-canceling"],
    shipping: "Livraison 48h",
  },
  // ...
];

<Products items={items} currency="EUR" locale="fr-FR" onSelect={(p) => console.log(p)} onAddToCart={(p) => console.log("ADD", p)} />
*/
