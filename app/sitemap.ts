import type { MetadataRoute } from "next";
import { listedCases } from "@/lib/content";
import { LOCALES, SITE_URL } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/filmes", "/cases", "/como-funciona", "/insula-e-begen", "/contato", ...listedCases().map((c) => `/cases/${c.slug}`)];
  return LOCALES.flatMap((l) => pages.map((p) => ({ url: `${SITE_URL}/${l}${p}` })));
}
