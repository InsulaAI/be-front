import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CaseCard from "@/components/CaseCard";
import { JsonLd, videoObject } from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import ScaleMosaic from "@/components/ScaleMosaic";
import { TrackView } from "@/components/Track";
import YouTube from "@/components/YouTube";
import { allCases, displayBrand, getCase, nextCase, type Case } from "@/lib/content";
import { hreflang, type Locale } from "@/lib/i18n";
import { TIPO_LABEL, entregaLabel, ytThumb } from "@/lib/labels";

export const dynamicParams = false;
export function generateStaticParams() {
  return allCases().map((c) => ({ slug: c.slug }));
}

function titleOf(c: Case) {
  return c.confidencial ? `${displayBrand(c)} · sob consulta` : `${c.marca} — ${c.campanha}`;
}

export async function generateMetadata({ params }: PageProps<"/[lang]/cases/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const c = getCase(slug);
  if (!c) return {};
  return {
    title: titleOf(c),
    description: `${c.resumo} be-front, powered by Insula e Begen.`,
    alternates: hreflang(lang as Locale, `/cases/${slug}`),
    robots: c.privado || c.rascunho ? { index: false, follow: false } : undefined,
    openGraph: c.youtubeId ? { images: [ytThumb(c.youtubeId)] } : undefined,
  };
}

export default async function CasePage({ params }: PageProps<"/[lang]/cases/[slug]">) {
  const { lang, slug } = await params;
  const c = getCase(slug);
  if (!c) notFound();
  const next = c.privado ? undefined : nextCase(slug);
  const brand = displayBrand(c);
  const tags = [c.setor, c.tipo ? TIPO_LABEL[c.tipo] : null, entregaLabel(c.entrega)].filter(Boolean) as string[];
  const creditos = (
    [
      ["Insula", c.creditos.insula],
      ["Begen", c.creditos.begen],
      ["Agência", c.creditos.agencia],
      ["Cliente", c.confidencial ? [] : c.creditos.cliente],
    ] as const
  ).filter(([, v]) => v.length);

  return (
    <article>
      <TrackView event="case_aberto" params={{ case_slug: c.slug }} />
      {c.youtubeId && <JsonLd data={videoObject({ id: c.youtubeId, name: titleOf(c), description: c.resumo })} />}

      <header className="wrap pt-32 md:pt-44">
        <Reveal>
          <Link href={`/${lang}/cases`} className="eyebrow hover:text-text">
            ← Cases
          </Link>
          <p className="eyebrow mt-8">be-front, powered by Insula e Begen{c.ano ? ` · ${c.ano}` : ""}</p>
          <h1 className="display mt-4 text-[clamp(44px,7vw,104px)]">{brand}</h1>
          <p className="display mt-3 text-[clamp(22px,2.6vw,34px)] text-text-2">
            {c.confidencial ? "Marca sob consulta" : c.campanha}
            {c.agencia && <span className="text-text-3"> · {c.agencia}</span>}
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {c.confidencial && <span className="tag tag-accent">Sob consulta</span>}
            {tags.map((t) => (
              <span key={t} className="tag">
                {t}
              </span>
            ))}
          </div>
        </Reveal>
      </header>

      {c.youtubeId && (
        <Reveal className="wrap mt-14 md:mt-20">
          <YouTube id={c.youtubeId} title={titleOf(c)} priority caption={c.semAudio ? "Filme-mestre · sem áudio" : "Filme-mestre"} />
        </Reveal>
      )}

      <div className="wrap mt-20 grid gap-16 md:mt-28 md:grid-cols-2 md:gap-12">
        {c.desafio && (
          <Reveal>
            <p className="eyebrow">
              <b>01</b> · O desafio
            </p>
            <p className="mt-5 text-[clamp(20px,2vw,26px)] leading-snug">{c.desafio}</p>
          </Reveal>
        )}
        {c.solucao && (
          <Reveal delay={120}>
            <p className="eyebrow">
              <b>{c.desafio ? "02" : "01"}</b> · A solução
            </p>
            <p className="mt-5 text-[clamp(20px,2vw,26px)] leading-snug">{c.solucao}</p>
          </Reveal>
        )}
      </div>

      {c.frames.length > 0 && (
        <div className="wrap mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">
          {c.frames.map((src, i) => (
            <div key={src} className="frame aspect-[4/5]">
              <Image src={src} alt={`Making of ${i + 1}`} fill sizes="(min-width: 768px) 25vw, 50vw" />
            </div>
          ))}
        </div>
      )}

      {c.variacoes.length > 0 && (
        <section aria-labelledby="escala" className="wrap mt-28">
          <p className="eyebrow">
            <b>·</b> A escala
          </p>
          <h2 id="escala" className="display mt-4 text-[clamp(32px,4vw,52px)]">
            {c.variacoes.length} peças a partir do mesmo filme
          </h2>
          <div className="mt-10">
            <ScaleMosaic items={c.variacoes} />
          </div>
        </section>
      )}

      {c.resultados.length > 0 && (
        <section aria-labelledby="resultados" className="wrap mt-28">
          <h2 id="resultados" className="eyebrow">
            Resultados
          </h2>
          <dl className={`mt-6 grid gap-px overflow-hidden rounded-[var(--radius)] border border-line bg-line ${["", "", "md:grid-cols-2", "md:grid-cols-3"][Math.min(c.resultados.length, 3)]}`}>
            {c.resultados.slice(0, 3).map((r) => (
              <div key={r.rotulo} className="flex flex-col gap-4 bg-ground p-8">
                <dt className="order-2 text-text-2">
                  {r.rotulo}
                  <span className="eyebrow mt-3 block !normal-case !tracking-normal">
                    Fonte: {r.fonte} · {r.periodo}
                  </span>
                </dt>
                <dd className="display order-1 text-[clamp(48px,5vw,72px)] leading-none text-accent">{r.valor}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {creditos.length > 0 && (
        <section aria-labelledby="creditos" className="wrap mt-28">
          <h2 id="creditos" className="eyebrow">
            Créditos
          </h2>
          <dl className="mt-6 grid gap-8 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-4">
            {creditos.map(([k, v]) => (
              <div key={k}>
                <dt className="eyebrow">{k}</dt>
                <dd className="mt-2 text-text-2">{v.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {next && (
        <section aria-label="Próximo case" className="wrap mt-32">
          <p className="eyebrow mb-6">Próximo case</p>
          <div className="max-w-2xl">
            <CaseCard c={next} lang={lang} large />
          </div>
        </section>
      )}
    </article>
  );
}
