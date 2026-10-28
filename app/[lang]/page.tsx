import type { Metadata } from "next";
import Image from "next/image";
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
import { caseImage, clientes, displayBrand, empresas, getCase, listedCases, numeros, site, whatsappUrl } from "@/lib/content";
import { getDict } from "@/lib/dict";
import { hreflang, type Locale } from "@/lib/i18n";
import { ytThumb } from "@/lib/labels";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: { absolute: getDict(lang).meta.homeTitle },
    alternates: hreflang(lang as Locale, ""),
  };
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang: l } = await params;
  const lang = l as Locale;
  const t = getDict(lang);
  const h = t.home;
  const destaques = listedCases(lang).filter((c) => c.destaque).slice(0, 4);
  const kv = getCase(site.keyVisualCase, lang);
  const heroVariants = site.heroVariantes.map((v) => ({
    id: v.id,
    image: v.imagem ?? (v.youtubeId ? ytThumb(v.youtubeId) : ""),
    focus: v.foco,
    loop: v.loop,
    peso: v.peso,
  }));
  // Exemplo real junto do bloco do key visual: o primeiro case com o mosaico do desdobramento
  // (filme da Insula mais peças da Begen) ou, sem nenhum, o case da Begen.
  const cases = listedCases(lang);
  const begenCase = cases.find((c) => c.variacoes.length > 0) ?? cases.find((c) => c.origem === "begen");
  const begenImage = begenCase ? (begenCase.capa ?? caseImage(begenCase)) : null;
  const wa = whatsappUrl(lang);
  const nums = numeros(lang);
  const { insula, begen } = empresas(lang);

  return (
    <>
      <HeroSplit
        lang={lang}
        variants={heroVariants}
      />

      {/* 2. Método */}
      <section aria-labelledby="metodo" className="wrap pt-28 md:pt-40">
        <SectionHead id="metodo" n="01" label={h.methodLabel} title={h.methodTitle} />
        <Reveal>
          <Method lang={lang} />
        </Reveal>
        <Reveal className="mt-12">
          <Link href={`/${lang}/como-funciona`} className="btn btn-ghost">
            {h.methodMore} <span aria-hidden>→</span>
          </Link>
        </Reveal>
      </section>

      {/* 3. Cases em destaque */}
      <section aria-labelledby="cases" className="wrap pt-28 md:pt-40">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead id="cases" n="02" label={h.casesLabel} title={h.casesTitle} />
          <Reveal className="mb-12 md:mb-16">
            <Link href={`/${lang}/cases`} className="btn btn-ghost">
              {h.allCases} <span aria-hidden>→</span>
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
          <SectionHead id="kv" n="03" label={h.kvLabel} title={h.kvTitle}>
            {h.kvLede}
          </SectionHead>
          <Reveal>
            <KeyVisual lang={lang} image={site.keyVisualImagem || ytThumb(kv.youtubeId)} focus={site.keyVisualFoco} />
          </Reveal>
          {begenCase && (
            <Reveal className="mt-10">
              <Link
                href={`/${lang}/cases/${begenCase.slug}`}
                className="group grid items-center gap-6 rounded-[var(--radius)] border border-line p-4 transition-colors hover:border-line-2 sm:grid-cols-[minmax(0,280px)_1fr_auto] sm:gap-8"
              >
                <div className="frame aspect-video">
                  {begenImage && (
                    <Image src={begenImage} alt="" fill sizes="(min-width: 640px) 280px, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="eyebrow">
                    <b>{h.realExample}</b> · {displayBrand(begenCase)}
                  </p>
                  <p className="display mt-2 text-[24px] md:text-[28px]">
                    {begenCase.resultados[0] ? (
                      <>
                        <span className="text-accent">{begenCase.resultados[0].valor}</span> {begenCase.resultados[0].rotulo}
                      </>
                    ) : (
                      begenCase.campanha
                    )}
                  </p>
                </div>
                <span aria-hidden className="grid h-11 w-11 place-items-center rounded-full border border-line-2 transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-accent-ink">
                  →
                </span>
              </Link>
            </Reveal>
          )}
        </section>
      )}

      {/* 5. Logos */}
      {clientes.length > 0 && (
        <section aria-label={h.clientsAria} className="wrap pt-28 md:pt-40">
          <Reveal className="border-y border-line py-12">
            <p className="eyebrow mb-10 text-center md:text-left">{h.clientsLabel}</p>
            <LogoStrip clientes={clientes} />
          </Reveal>
        </section>
      )}

      {/* 6. Números */}
      {nums.length > 0 && (
        <section aria-labelledby="numeros" className="wrap pt-28 md:pt-40">
          <SectionHead id="numeros" n="04" label={h.numbersLabel} title={h.numbersTitle} />
          <Reveal>
            <Numbers items={nums.slice(0, 4)} sourceLabel={t.source} />
          </Reveal>
        </section>
      )}

      {/* 7. Insula e Begen */}
      <section aria-labelledby="quem" className="wrap pt-28 md:pt-40">
        <SectionHead id="quem" n="05" label={h.whoLabel} title={h.whoTitle} />
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
                  {h.siteOf} {e.nome} <span aria-hidden>↗</span>
                </a>
              )}
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8">
          <Link href={`/${lang}/insula-e-begen`} className="btn btn-ghost">
            {h.whoMore} <span aria-hidden>→</span>
          </Link>
        </Reveal>
      </section>

      {/* 8. Chamada final */}
      <section aria-labelledby="briefing" className="wrap pt-28 md:pt-40">
        <div className="grid gap-12 rounded-[var(--radius)] border border-line bg-surface p-8 md:grid-cols-[1fr_1.2fr] md:p-14">
          <div>
            <p className="eyebrow">
              <b>06</b> · {h.briefingLabel}
            </p>
            <h2 id="briefing" className="display mt-4 text-[clamp(34px,5vw,60px)]">
              {h.briefingTitle}
            </h2>
            <p className="lede mt-5">{h.briefingLede}</p>
            {wa && (
              <WhatsAppLink href={wa} className="btn btn-ghost mt-8">
                {h.whatsapp}
              </WhatsAppLink>
            )}
          </div>
          <BriefingForm lang={lang} />
        </div>
      </section>
    </>
  );
}
