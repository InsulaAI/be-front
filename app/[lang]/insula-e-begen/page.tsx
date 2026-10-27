import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { site } from "@/lib/content";
import { hreflang, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/insula-e-begen">): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: "Insula e Begen",
    description: "Quem faz cada parte da be-front: a Insula faz o filme-mestre, a Begen faz o desdobramento.",
    alternates: hreflang(lang as Locale, "/insula-e-begen"),
  };
}

const PARTES = {
  insula: ["Conceito e roteiro", "Direção", "Filme 100% IA ou híbrido", "Finalização e online"],
  begen: ["Key visual em variações", "Formatos por canal", "Mensagens por público", "Escala com o AdMultify"],
};

export default async function InsulaEBegen({ params }: PageProps<"/[lang]/insula-e-begen">) {
  const { lang } = await params;
  const { insula, begen } = site.empresas;
  return (
    <div className="wrap pt-32 md:pt-44">
      <Reveal>
        <p className="eyebrow">be-front, powered by Insula e Begen</p>
        <h1 className="display mt-4 max-w-[14ch] text-[clamp(44px,7vw,96px)]">Duas empresas, um fluxo.</h1>
        <p className="lede mt-6">A Insula faz o filme. A Begen faz o filme virar campanha em cada formato. Na be-front, as duas trabalham no mesmo projeto, do primeiro dia à entrega.</p>
      </Reveal>

      <div className="mt-20 grid gap-6 md:grid-cols-2">
        {([
          [insula, PARTES.insula, "01"],
          [begen, PARTES.begen, "02"],
        ] as const).map(([e, partes, n], i) => (
          <Reveal key={e.nome} delay={i * 120} className="flex flex-col rounded-[var(--radius)] border border-line bg-surface p-8 md:p-12">
            <p className="eyebrow">
              <b>{n}</b> · {e.parte}
            </p>
            <h2 className="display mt-4 text-[48px] md:text-[64px]">{e.nome}</h2>
            <p className="mt-5 text-text-2">{e.texto}</p>
            <ul className="mt-8 grid gap-3 border-t border-line pt-8">
              {partes.map((p) => (
                <li key={p} className="flex items-center gap-3">
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {p}
                </li>
              ))}
            </ul>
            {e.site && (
              <a href={e.site} target="_blank" rel="noopener noreferrer" className="btn btn-ghost mt-10 self-start">
                Site da {e.nome} <span aria-hidden>↗</span>
              </a>
            )}
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-20 flex flex-wrap gap-3">
        <Link href={`/${lang}/como-funciona`} className="btn btn-accent">
          Como funciona <span aria-hidden>→</span>
        </Link>
        <Link href={`/${lang}/contato`} className="btn btn-ghost">
          Enviar briefing
        </Link>
      </Reveal>
    </div>
  );
}
