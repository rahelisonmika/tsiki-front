import { create } from 'zustand';
import { CartStore } from './cart.type';
import { persist } from 'zustand/middleware';

const LS_KEY = 'tsiki-cart';

export const useCart = create<CartStore>()(
  persist(
          (set, get) => ({
          items: [],
          addItem: (product) => {
            const items    = get().items;
            const existing = items.find((p) => p.id === product.id);

            if (existing) {
              set({
                items: items.map((p) =>
                  p.id === product.id ? { ...p, qty: p.qty + 1 } : p
                ),
              });
            } else {
              set({ items: [...items, { ...product, qty: 1 }] });
            }
          },
          removeItem: (id) =>
            set({
              items: get().items.filter((p) => p.id !== id),
            }),
          clearCart: () => set({ items: [] }),
          total: () =>
            get().items.reduce((acc, p) => acc + p.price * p.qty, 0),
          get: () => get().items,
          set: (items) => set({items}),
        }),
    {
      name: LS_KEY, // nom de la clé dans localStorage
  }));