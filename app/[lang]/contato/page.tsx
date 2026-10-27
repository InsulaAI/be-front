import type { Metadata } from "next";
import BriefingForm from "@/components/BriefingForm";
import Reveal from "@/components/Reveal";
import { WhatsAppLink } from "@/components/Track";
import { site, whatsappUrl } from "@/lib/content";
import { getDict } from "@/lib/dict";
import { hreflang, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/contato">): Promise<Metadata> {
  const { lang } = await params;
  const m = getDict(lang).meta.contato;
  return { title: m.title, description: m.desc, alternates: hreflang(lang as Locale, "/contato") };
}

export default async function Contato({ params }: PageProps<"/[lang]/contato">) {
  const lang = (await params).lang as Locale;
  const t = getDict(lang);
  const wa = whatsappUrl(lang);
  return (
    <div className="wrap grid gap-16 pt-32 md:grid-cols-[1fr_1.3fr] md:pt-44">
      <Reveal>
        <p className="eyebrow">{t.powered}</p>
        <h1 className="display mt-4 text-[clamp(44px,7vw,88px)]">{t.contato.title}</h1>
        <p className="lede mt-6">{t.contato.lede}</p>
        <div className="mt-10 grid gap-3">
          {wa && (
            <WhatsAppLink href={wa} className="btn btn-ghost self-start">
              {t.contato.whatsapp}
            </WhatsAppLink>
          )}
          {site.agenda && (
            <a href={site.agenda} target="_blank" rel="noopener noreferrer" className="btn btn-ghost self-start">
              {t.contato.schedule}
            </a>
          )}
          {site.email && (
            <a href={`mailto:${site.email}`} className="mt-2 text-text-2 underline-offset-4 hover:text-text hover:underline">
              {site.email}
            </a>
          )}
        </div>
      </Reveal>
      <Reveal delay={120}>
        <BriefingForm lang={lang} full />
      </Reveal>
    </div>
  );
}
