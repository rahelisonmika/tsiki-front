'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams,useRouter, usePathname } from 'next/navigation';
import {
  AppBar, Toolbar, Container, Box, Typography, IconButton, InputBase,
  Badge, Select, MenuItem, FormControl, OutlinedInput, Button, Menu,
  Drawer, List, ListItemButton, ListItemText, Divider, Stack
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import TranslateIcon from '@mui/icons-material/Translate';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Category } from '@/types/category'; // Assurez-vous que ce type est défini dans un fichier approprié
import { useCart } from '@/store/cart/cart';
import { useUser } from '@/store/user/user';
import { NavbarProps } from './Navbar.type'; // Importez le type NavbarProps

const LANGS = [
  { code: 'fr', label: 'FR / USD' },
  { code: 'en', label: 'EN / USD' },
  { code: 'mg', label: 'MG / MGA' },
];

export default function Navbar({CATEGORIES, urlToRedirect, urlLogin, urlCart}:NavbarProps) {
  // Derive TOP_NAV depuis CATEGORIES (ex: 5 premières hors "Tous")
  const TOP_NAV: Category[] = CATEGORIES.filter((c:any) => c.cat_code !== 'all').slice(0, 5);
  const cartCount = useCart((state) => state.items.length);
  const user      = useUser((state) => state.user);


  const theme    = useTheme();
  const isMdUp   = useMediaQuery(theme.breakpoints.up('md'));
  const router   = useRouter();

  const [lang, setLang] = React.useState('fr');
  //const [cartCount]     = React.useState(0);
  const [search, setSearch] = React.useState('');
  const [categoryCode, setCategoryCode] = React.useState<string>('all');

  // Catégories : Menu (desktop) / Drawer (mobile)
  const [catAnchor, setCatAnchor] = React.useState<null | HTMLElement>(null);
  const catMenuOpen = Boolean(catAnchor);
  const [openCatsDrawer, setOpenCatsDrawer] = React.useState(false);

  // Langue : Menu mobile
  const [langAnchor, setLangAnchor] = React.useState<null | HTMLElement>(null);
  const langMenuOpen = Boolean(langAnchor);

  // Helpers
  const CATEGORY_BY_CODE = React.useMemo(
    () => new Map(CATEGORIES.map(c => [c.cat_code, c] as const)),
    []
  );
  const selectedCategoryLabel =
    CATEGORY_BY_CODE.get(categoryCode)?.cat_libelle ?? 'Tous';

  // ---------- HANDLERS (déclarés en haut) ----------
  const handleOpenCatMenu = (e: React.MouseEvent<HTMLElement>) => setCatAnchor(e.currentTarget);

  const handleOpenLangMenu = (e: React.MouseEvent<HTMLElement>) => setLangAnchor(e.currentTarget);

  const handleSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("search:", search, "category:", categoryCode);
    //router.push(`/search?q=${encodeURIComponent(search)}&cat=${encodeURIComponent(categoryCode)}`);
    router.push("/"+urlToRedirect+"?mode="+categoryCode+"&search="+search);
  };

  const handleDisplayCompte = () => {
    if(user){
      return "none";
    }
    return "";
  }

  const handleClickMenuLang = (code:string) => {
    setLang(code)
    setLangAnchor(null)
  };

  const handleClickMenuItem = (code: string) => {
    setCategoryCode(code);
    setCatAnchor(null);
    setOpenCatsDrawer(false);
    //let urlToRedirectFinal = (urlToRedirect)?urlToRedirect:"products";
    //router.push(code === 'all' ? '/'+urlToRedirectFinal : `/`+urlToRedirectFinal+`/${code}`);
    router.push("/"+urlToRedirect+"?mode="+code);
  };

  const isActiveRoute = (code: string) => {
    const to = code;

    const searchParams = useSearchParams();
    const mode         = searchParams.get('mode');

    let activeRoute = mode === to 
    return activeRoute;
  };
  // --------------------------------------------------

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="transparent"
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg" disableGutters>
        {/* Rangée 1 */}
        <Toolbar sx={{ py: 1, px: 2 }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            alignItems={{ xs: 'stretch', md: 'center' }}
            spacing={{ xs: 1, md: 2 }}
            sx={{ width: '100%' }}
          >
            {/* Logo */}
            <Box
              component={Link}
              href="/"
              sx={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {/* <Box sx={{ width: 34, height: 34, bgcolor: 'primary.main', borderRadius: 1, mr: 1 }} /> */}
              <Typography color='primary.dark' variant="h6" fontWeight={800}>Tsiki</Typography>
            </Box>

            {/* Recherche */}
            <Box
              component="form"
              sx={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 999,
                overflow: 'hidden',
                minWidth: { xs: '100%', md: 320 },
                bgcolor: alpha(theme.palette.common.black, theme.palette.mode === 'light' ? 0.02 : 0.12),
              }}
            >
              <InputBase
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Rechercher un produit… (${selectedCategoryLabel})`}
                sx={{
                  px: 2,
                  flex: 1,
                  minWidth: 120,
                  '& input::placeholder': { opacity: 0.7 },
                }}
                inputProps={{ 'aria-label': 'recherche' }}
              />
              <IconButton
                type="button"
                onClick={handleSubmitSearch}
                sx={{
                  m: 0.5,
                  ml: 0,
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': { bgcolor: 'primary.dark' },
                  width: 44,
                  height: 44,
                }}
                aria-label="rechercher"
              >
                <SearchIcon />
              </IconButton>
            </Box>

            {/* Actions droites */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, ml: { md: 'auto' } }}>
              {/* Langue */}
              {isMdUp ? (
                <FormControl size="small" sx={{ minWidth: 112 }}>
                  <Select
                    value={lang}
                    onChange={(e) => setLang(e.target.value)}
                    input={<OutlinedInput startAdornment={<TranslateIcon sx={{ mr: 1 }} />} />}
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: alpha('#000', 0.15) },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: alpha('#000', 0.35) },
                    }}
                    MenuProps={{ PaperProps: { sx: { mt: 1 } } }}
                  >
                    {LANGS.map((l) => (
                      <MenuItem key={l.code} value={l.code}>{l.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <>
                  <IconButton aria-label="langue et devise" onClick={handleOpenLangMenu}>
                    <TranslateIcon />
                  </IconButton>
                  <Menu
                    anchorEl={langAnchor}
                    open={langMenuOpen}
                    onClose={() => setLangAnchor(null)}
                    MenuListProps={{ dense: true }}
                  >
                    {LANGS.map((l) => (
                      <MenuItem
                        key={l.code}
                        selected={l.code === lang}
                        onClick={()=>handleClickMenuLang(l.code)}
                      >
                        {l.label}
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              )}

              {/* Compte */}
              <IconButton sx={{display:handleDisplayCompte}} aria-label="compte" color="inherit" component={Link} href={urlLogin || '/login'}>
                <PersonOutlineIcon />
              </IconButton>

              {/* Panier */}
              <IconButton aria-label="panier" color="inherit" component={Link} href={urlCart || '/cart'}>
                <Badge badgeContent={cartCount} color="secondary">
                  <ShoppingCartOutlinedIcon />
                </Badge>
              </IconButton>
            </Box>
          </Stack>
        </Toolbar>

        {/* Rangée 2 — en colonne sur mobile (TOP_NAV sous le bouton catégories) */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          alignItems={{ xs: 'stretch', md: 'center' }}
          spacing={{ xs: 1, md: 2 }}
          sx={{
            px: 2,
            pb: 1.25,
            overflowX: { xs: 'visible', md: 'auto' },
            scrollbarWidth: { md: 'none' as any },
            '&::-webkit-scrollbar': { display: { md: 'none' } },
          }}
        >
          {/* Bouton Catégories */}
          {isMdUp ? (
            <>
              <Button
                variant="outlined"
                startIcon={<MenuRoundedIcon />}
                endIcon={<ExpandMoreIcon />}
                onClick={handleOpenCatMenu}
                aria-controls={catMenuOpen ? 'categories-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={catMenuOpen ? 'true' : undefined}
                sx={{
                  borderRadius: 999,
                  px: 2,
                  whiteSpace: 'nowrap',
                  borderColor: 'divider',
                  flexShrink: 0, // ne pas rétrécir
                }}
              >
                Toutes les catégories
              </Button>
              <Menu
                id="categories-menu"
                anchorEl={catAnchor}
                open={catMenuOpen}
                onClose={() => setCatAnchor(null)}
                MenuListProps={{ dense: true, sx: { py: 0.5 } }}
              >
                {CATEGORIES.map((c) => (
                  <MenuItem
                    key={c.cat_code}
                    onClick={() => handleClickMenuItem(c.cat_code)}
                    selected={isActiveRoute(c.cat_code)}
                  >
                    {c.cat_libelle}
                  </MenuItem>
                ))}
              </Menu>
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                startIcon={<MenuRoundedIcon />}
                onClick={()=> setOpenCatsDrawer(true)}
                sx={{ borderRadius: 999, px: 2, whiteSpace: 'nowrap', borderColor: 'divider' }}
              >
                Catégories
              </Button>
              <Drawer
                anchor="left"
                open={openCatsDrawer}
                onClose={() => setOpenCatsDrawer(false)}
                PaperProps={{ sx: { width: 300 } }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1 }}>
                  <Typography variant="subtitle1" fontWeight={700}>Toutes les catégories</Typography>
                  <IconButton onClick={() => setOpenCatsDrawer(false)}><CloseRoundedIcon /></IconButton>
                </Box>
                <Divider />
                <List>
                  {CATEGORIES.map((c) => (
                    <ListItemButton
                      key={c.cat_code}
                      onClick={() => handleClickMenuItem(c.cat_code)}
                      selected={isActiveRoute(c.cat_code)}
                    >
                      <ListItemText primary={c.cat_libelle} />
                    </ListItemButton>
                  ))}
                </List>
              </Drawer>
            </>
          )}

          {/* TOP_NAV — dérivé des catégories */}
          <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                flexGrow: 1,
                flexWrap: { xs: 'wrap', md: 'wrap', lg: 'nowrap' }, // wrap en xs–md, une ligne en lg+
                columnGap: { xs: 1.5, md: 3 },
                rowGap: { xs: 1, md: 1 },
                minWidth: 0,
                overflowX: 'visible',
            }}
            >
            {TOP_NAV.map((item) => {
                return (
                <Typography
                    key={item.cat_code}
                    component="span"               // ← pas de Link/Button, juste du texte cliquable
                    role="link"
                    tabIndex={0}
                    onClick={() => handleClickMenuItem(item.cat_code)}
                    onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') router.push(`/c/${item.cat_code}`);
                    }}
                    sx={{
                    cursor: 'pointer',
                    textDecoration: 'none',
                    color: isActiveRoute(item.cat_code) ? 'primary.main' : 'text.primary', // équiv. “actif”
                    fontWeight: isActiveRoute(item.cat_code) ? 700 : 500,
                    '&:hover': { color: 'primary.main' },            // hover comme avant
                    whiteSpace: 'nowrap',
                    userSelect: 'none',
                    }}
                >
                    {item.cat_libelle}
                </Typography>
                );
            })}
            </Box>
        </Stack>
      </Container>
    </AppBar>
  );
}
