import type { Metadata } from "next";
import Link from "next/link";
import BriefingForm from "@/components/BriefingForm";
import CaseCard from "@/components/CaseCard";
import HeroSplit from "@/components/HeroSplit";
import KeyVisual from "@/components/KeyVisual";
import LogoStrip from "@/components/LogoStrip";
import Method from "@/components/Method";
import Numbers from "@/components/Numbers";
import Reveal from "@/components/Reveal";
import { SectionHead } from "@/components/Section";
import { WhatsAppLink } from "@/components/Track";
import { clientes, getCase, listedCases, numeros, site, whatsappUrl } from "@/lib/content";
import { hreflang, type Locale } from "@/lib/i18n";
import { ytThumb } from "@/lib/labels";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: { absolute: "be-front, powered by Insula e Begen | Um filme. Todos os formatos." },
    alternates: hreflang(lang as Locale, ""),
  };
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  const destaques = listedCases().filter((c) => c.destaque).slice(0, 4);
  const hero = getCase(site.heroCase);
  const kv = getCase(site.keyVisualCase);
  const wa = whatsappUrl();
  const { insula, begen } = site.empresas;

  return (
    <>
      <HeroSplit
        lang={lang}
        title="Um filme. Todos os formatos."
        intro="Do conceito cinematográfico à entrega em cada canal, em um fluxo só: a Insula faz o filme-mestre e a Begen o transforma em centenas de peças."
        media={{ image: hero?.youtubeId ? ytThumb(hero.youtubeId) : "", loop: site.heroLoop }}
      />

      {/* 2. Método */}
      <section aria-labelledby="metodo" className="wrap pt-28 md:pt-40">
        <SectionHead id="metodo" n="01" label="Método" title="Três passos. Uma equipe só." />
        <Reveal>
          <Method />
        </Reveal>
        <Reveal className="mt-12">
          <Link href={`/${lang}/como-funciona`} className="btn btn-ghost">
            Como funciona em detalhe <span aria-hidden>→</span>
          </Link>
        </Reveal>
      </section>

      {/* 3. Cases em destaque */}
      <section aria-labelledby="cases" className="wrap pt-28 md:pt-40">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead id="cases" n="02" label="Cases" title="Filmes que já estão no ar." />
          <Reveal className="mb-12 md:mb-16">
            <Link href={`/${lang}/cases`} className="btn btn-ghost">
              Todos os cases <span aria-hidden>→</span>
            </Link>
          </Reveal>
        </div>
        <div className="grid gap-x-8 gap-y-16 md:grid-cols-2">
          {destaques.map((c, i) => (
            <Reveal key={c.slug} delay={(i % 2) * 120}>
              <CaseCard c={c} lang={lang} large />
            </Reveal>
          ))}
        </div>
      </section>

      {/* 4. Key visual interativo */}
      {kv?.youtubeId && (
        <section aria-labelledby="kv" className="wrap pt-28 md:pt-40">
          <SectionHead id="kv" n="03" label="Desdobramento" title="Um key visual. Dezenas de peças.">
            O mesmo quadro, recortado para cada formato e reescrito para cada mensagem.
          </SectionHead>
          <Reveal>
            <KeyVisual image={ytThumb(kv.youtubeId)} />
          </Reveal>
        </section>
      )}

      {/* 5. Logos */}
      {clientes.length > 0 && (
        <section aria-label="Clientes" className="wrap pt-28 md:pt-40">
          <Reveal className="border-y border-line py-12">
            <p className="eyebrow mb-10 text-center md:text-left">Marcas que já trabalharam com a gente</p>
            <LogoStrip clientes={clientes} />
          </Reveal>
        </section>
      )}

      {/* 6. Números */}
      {numeros.length > 0 && (
        <section aria-labelledby="numeros" className="wrap pt-28 md:pt-40">
          <SectionHead id="numeros" n="04" label="Números" title="Em números" />
          <Reveal>
            <Numbers items={numeros.slice(0, 4)} />
          </Reveal>
        </section>
      )}

      {/* 7. Insula e Begen */}
      <section aria-labelledby="quem" className="wrap pt-28 md:pt-40">
        <SectionHead id="quem" n="05" label="Quem faz" title="Insula e Begen" />
        <div className="grid gap-px overflow-hidden rounded-[var(--radius)] border border-line bg-line md:grid-cols-2">
          {[insula, begen].map((e, i) => (
            <Reveal key={e.nome} delay={i * 120} className="flex flex-col gap-6 bg-ground p-8 md:p-12">
              <p className="eyebrow">
                <b>{String(i + 1).padStart(2, "0")}</b> · {e.parte}
              </p>
              <h3 className="display text-[40px] md:text-[52px]">{e.nome}</h3>
              <p className="text-text-2">{e.texto}</p>
              {e.site && (
                <a href={e.site} target="_blank" rel="noopener noreferrer" className="btn btn-ghost mt-auto self-start">
                  Site da {e.nome} <span aria-hidden>↗</span>
                </a>
              )}
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8">
          <Link href={`/${lang}/insula-e-begen`} className="btn btn-ghost">
            Quem faz cada parte <span aria-hidden>→</span>
          </Link>
        </Reveal>
      </section>

      {/* 8. Chamada final */}
      <section aria-labelledby="briefing" className="wrap pt-28 md:pt-40">
        <div className="grid gap-12 rounded-[var(--radius)] border border-line bg-surface p-8 md:grid-cols-[1fr_1.2fr] md:p-14">
          <div>
            <p className="eyebrow">
              <b>06</b> · Briefing
            </p>
            <h2 id="briefing" className="display mt-4 text-[clamp(34px,5vw,60px)]">
              Tem um filme para fazer?
            </h2>
            <p className="lede mt-5">Conte a marca, o prazo e onde a campanha vai rodar. A gente volta com um caminho.</p>
            {wa && (
              <WhatsAppLink href={wa} className="btn btn-ghost mt-8">
                Falar no WhatsApp
              </WhatsAppLink>
            )}
          </div>
          <BriefingForm />
        </div>
      </section>
    </>
  );
}
