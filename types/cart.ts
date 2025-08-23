import { Product } from '@/types/product';

export type CartItem = Product &{
    id: string;
    title: string;
    price: number;
    image?: string;
    qty: number;
    maxQty?: number;
    options?: Record<string, string>; // ⇐ on stocke les variantes choisies
}

// export type CartItem = {
//   id: string;
//   title: string;
//   price: number;
//   image?: string;
//   qty: number;
//   maxQty?: number;
//   options?: Record<string, string>; // ⇐ on stocke les variantes choisies
// };

export type Coupon = { code: string; percentOff: number };