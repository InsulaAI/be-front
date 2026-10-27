import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import Analytics from "@/components/Analytics";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { LOCALES, SITE_URL, isLocale } from "@/lib/i18n";

export const dynamicParams = false;
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "be-front, powered by Insula e Begen", template: "%s | be-front" },
  description: "Do filme-mestre feito com IA a centenas de peças em todos os formatos, em um fluxo só. be-front, powered by Insula e Begen.",
  openGraph: { siteName: "be-front", type: "website", locale: "pt_BR" },
};

export const viewport: Viewport = { themeColor: "#000000", colorScheme: "dark" };

export default async function LangLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <html lang={lang === "pt" ? "pt-BR" : lang}>
      <body>
        <Header lang={lang} />
        <main id="conteudo">{children}</main>
        <Footer lang={lang} />
        <Analytics />
      </body>
    </html>
  );
}
