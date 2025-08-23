import {CartItem} from '@/types/cart';

export type CartStore = {
  items: CartItem[];
  addItem: (product: Omit<CartItem, 'qty'>) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  set:(items:CartItem[]) => void;
  get: () => CartItem[];
  total: () => number;
};