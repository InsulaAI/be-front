// PT é o idioma padrão. EN tem rota prevista (/en) e entra quando o conteúdo em inglês existir:
// basta incluir "en" em LOCALES e preencher o dicionário.
export const LOCALES = ["pt"] as const;
export const PLANNED_LOCALES = ["pt", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export function isLocale(v: string): v is Locale {
  return (LOCALES as readonly string[]).includes(v);
}

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const NAV = [
  { href: "/filmes", label: "Filmes" },
  { href: "/cases", label: "Cases" },
  { href: "/como-funciona", label: "Como funciona" },
  { href: "/insula-e-begen", label: "Insula e Begen" },
];

export function hreflang(lang: Locale, pathname: string) {
  return {
    canonical: `/${lang}${pathname}`,
    languages: Object.fromEntries(LOCALES.map((l) => [l === "pt" ? "pt-BR" : l, `/${l}${pathname}`])),
  };
}
