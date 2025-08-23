export type FooterCategory = { cat_code: string; cat_libelle: string };

export type FooterProps = {
  categories?: FooterCategory[];
  loginUrl?: string;
  registerUrl?: string;
};