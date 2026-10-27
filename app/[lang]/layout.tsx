import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import Analytics from "@/components/Analytics";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getDict } from "@/lib/dict";
import { LOCALES, SITE_URL, isLocale } from "@/lib/i18n";

export const dynamicParams = false;
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const t = getDict((await params).lang);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t.meta.siteTitle, template: "%s | be-front" },
    description: t.meta.siteDesc,
    openGraph: { siteName: "be-front", type: "website", locale: t.ogLocale },
  };
}

export const viewport: Viewport = { themeColor: "#000000", colorScheme: "dark" };

export default async function LangLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <html lang={getDict(lang).htmlLang}>
      <body>
        <Header lang={lang} />
        <main id="conteudo">{children}</main>
        <Footer lang={lang} />
        <Analytics />
      </body>
    </html>
  );
}
