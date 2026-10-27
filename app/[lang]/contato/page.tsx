import type { Metadata } from "next";
import BriefingForm from "@/components/BriefingForm";
import Reveal from "@/components/Reveal";
import { WhatsAppLink } from "@/components/Track";
import { site, whatsappUrl } from "@/lib/content";
import { hreflang, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/contato">): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: "Contato",
    description: "Envie um briefing para a be-front, powered by Insula e Begen.",
    alternates: hreflang(lang as Locale, "/contato"),
  };
}

export default async function Contato() {
  const wa = whatsappUrl();
  return (
    <div className="wrap grid gap-16 pt-32 md:grid-cols-[1fr_1.3fr] md:pt-44">
      <Reveal>
        <p className="eyebrow">be-front, powered by Insula e Begen</p>
        <h1 className="display mt-4 text-[clamp(44px,7vw,88px)]">Briefing</h1>
        <p className="lede mt-6">Marca, prazo, formatos e canais. Com isso a gente volta com um caminho e um cronograma.</p>
        <div className="mt-10 grid gap-3">
          {wa && (
            <WhatsAppLink href={wa} className="btn btn-ghost self-start">
              Falar no WhatsApp
            </WhatsAppLink>
          )}
          {site.agenda && (
            <a href={site.agenda} target="_blank" rel="noopener noreferrer" className="btn btn-ghost self-start">
              Agendar uma conversa
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
        <BriefingForm full />
      </Reveal>
    </div>
  );
}
