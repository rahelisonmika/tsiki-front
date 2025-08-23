import { CartItem } from '@/types/cart';

export type AddToCartButtonProps = {
  product: CartItem;
  /** 'basic' (par défaut) ou 'contained' */
  typeButton?: 'basic' | 'contained';
};