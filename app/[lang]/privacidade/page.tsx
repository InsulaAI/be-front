import type { Metadata } from "next";
import { site } from "@/lib/content";
import { hreflang, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/privacidade">): Promise<Metadata> {
  const { lang } = await params;
  return { title: "Privacidade", alternates: hreflang(lang as Locale, "/privacidade") };
}

// Rascunho: revisar com o jurídico antes de publicar (ver README).
export default function Privacidade() {
  return (
    <div className="wrap max-w-3xl pt-32 md:pt-44">
      <p className="eyebrow">be-front, powered by Insula e Begen</p>
      <h1 className="display mt-4 text-[clamp(40px,6vw,72px)]">Privacidade</h1>
      <div className="mt-10 grid gap-6 text-text-2 [&_h2]:display [&_h2]:mt-6 [&_h2]:text-[24px] [&_h2]:text-text">
        <h2>O que coletamos</h2>
        <p>Nome, empresa, e-mail e a mensagem que você envia pelo formulário de briefing. Usamos esses dados só para responder ao seu contato.</p>
        <h2>Métricas</h2>
        <p>O site usa o Google Analytics 4 para contar visitas e cliques, sem identificar você pelo nome.</p>
        <h2>Vídeos</h2>
        <p>Os filmes são do YouTube, no modo de privacidade reforçada (youtube-nocookie.com). O player só carrega quando você clica para assistir.</p>
        <h2>Seus direitos</h2>
        <p>
          Pela LGPD, você pode pedir acesso, correção ou exclusão dos seus dados
          {site.email ? (
            <>
              {" "}pelo e-mail <a className="text-text underline" href={`mailto:${site.email}`}>{site.email}</a>.
            </>
          ) : (
            " pelo nosso formulário de contato."
          )}
        </p>
      </div>
    </div>
  );
}
