/**
 * Type d'un produit minimaliste pour l'affichage.
 */

import { Product } from '@/types/product';
export type ProductsProps = {
  /** Liste de produits à afficher */
  items: Product[];
  /** Callback quand on clique une carte produit (optionnel) */
  //onSelect?: (product: Product) => void;
  /** Localisation/monnaie pour l'affichage du prix */
  locale?: string; // ex: "fr-FR"
  currency?: string; // ex: "EUR", "MGA"
  /** Tri par prix (asc|desc), défaut: asc */
  sortByPrice?: "asc" | "desc";
  urlProduct?: string; // URL de la page produit, par défaut "products"
};