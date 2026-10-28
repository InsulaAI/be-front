// PT é o idioma padrão; EN tem o mesmo site em /en. Os caminhos das páginas são os mesmos nos
// dois idiomas (/pt/filmes e /en/filmes), o que mantém o seletor de idioma trivial.
export const LOCALES = ["pt", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export function isLocale(v: string): v is Locale {
  return (LOCALES as readonly string[]).includes(v);
}

// Endereço oficial: be-front.ai em produção. As versões de teste da Vercel usam o próprio endereço
// e o ambiente local usa localhost. NEXT_PUBLIC_SITE_URL, se definida, vale sobre tudo.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_ENV === "production"
    ? "https://be-front.ai"
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

export const NAV = [
  { href: "/filmes", key: "filmes" },
  { href: "/cases", key: "cases" },
  { href: "/como-funciona", key: "comoFunciona" },
  { href: "/insula-e-begen", key: "insulaBegen" },
] as const;

/** O mesmo caminho no outro idioma: /pt/cases/kfc → /en/cases/kfc. */
export function swapLocale(pathname: string, to: Locale): string {
  return pathname.replace(/^\/(pt|en)(?=\/|$)/, `/${to}`) || `/${to}`;
}

export function hreflang(lang: Locale, pathname: string) {
  return {
    canonical: `/${lang}${pathname}`,
    languages: {
      "pt-BR": `/pt${pathname}`,
      en: `/en${pathname}`,
      "x-default": `/pt${pathname}`,
    },
  };
}
