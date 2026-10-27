import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { empresas } from "@/lib/content";
import { getDict } from "@/lib/dict";
import { hreflang, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/insula-e-begen">): Promise<Metadata> {
  const { lang } = await params;
  const m = getDict(lang).meta.insulaBegen;
  return { title: m.title, description: m.desc, alternates: hreflang(lang as Locale, "/insula-e-begen") };
}

export default async function InsulaEBegen({ params }: PageProps<"/[lang]/insula-e-begen">) {
  const lang = (await params).lang as Locale;
  const t = getDict(lang);
  const { insula, begen } = empresas(lang);
  return (
    <div className="wrap pt-32 md:pt-44">
      <Reveal>
        <p className="eyebrow">{t.powered}</p>
        <h1 className="display mt-4 max-w-[14ch] text-[clamp(44px,7vw,96px)]">{t.ib.title}</h1>
        <p className="lede mt-6">{t.ib.lede}</p>
      </Reveal>

      <div className="mt-20 grid gap-6 md:grid-cols-2">
        {(
          [
            [insula, t.ib.partes.insula, "01"],
            [begen, t.ib.partes.begen, "02"],
          ] as const
        ).map(([e, partes, n], i) => (
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
                {t.home.siteOf} {e.nome} <span aria-hidden>↗</span>
              </a>
            )}
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-20 flex flex-wrap gap-3">
        <Link href={`/${lang}/como-funciona`} className="btn btn-accent">
          {t.hero.how} <span aria-hidden>→</span>
        </Link>
        <Link href={`/${lang}/contato`} className="btn btn-ghost">
          {t.como.sendBriefing}
        </Link>
      </Reveal>
    </div>
  );
}
