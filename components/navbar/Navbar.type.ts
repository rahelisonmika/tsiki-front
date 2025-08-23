import { Category } from '@/types/category'; // Assurez-vous que ce type est défini dans un fichier approprié

export type NavbarProps = {
  CATEGORIES: Category[];
  urlToRedirect?: string;
  urlLogin?: string;
  urlCart?: string;
};