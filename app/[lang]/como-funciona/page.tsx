import type { Metadata } from "next";
import Link from "next/link";
import Method from "@/components/Method";
import Reveal from "@/components/Reveal";
import { getDict } from "@/lib/dict";
import { hreflang, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/como-funciona">): Promise<Metadata> {
  const { lang } = await params;
  const m = getDict(lang).meta.comoFunciona;
  return { title: m.title, description: m.desc, alternates: hreflang(lang as Locale, "/como-funciona") };
}

export default async function ComoFunciona({ params }: PageProps<"/[lang]/como-funciona">) {
  const lang = (await params).lang as Locale;
  const t = getDict(lang);
  const c = t.como;
  const [master, rollout] = t.method;
  return (
    <div className="pt-32 md:pt-44">
      <header className="wrap">
        <Reveal>
          <p className="eyebrow">{t.powered}</p>
          <h1 className="display mt-4 max-w-[16ch] text-[clamp(44px,7vw,96px)]">{c.title}</h1>
          <p className="lede mt-6">{c.lede}</p>
        </Reveal>
        <Reveal className="mt-16 md:mt-24">
          <Method lang={lang} compact />
        </Reveal>
      </header>

      <section aria-labelledby="mestre" className="wrap mt-32 grid gap-12 md:grid-cols-[1fr_1.3fr] md:gap-16">
        <Reveal>
          <p className="eyebrow">
            <b>01</b> · {master.who}
          </p>
          <h2 id="mestre" className="display mt-4 text-[clamp(34px,4.5vw,56px)]">
            {master.t}
          </h2>
          <p className="lede mt-5">{c.masterLede}</p>
          <div className="mt-10 rounded-[var(--radius)] border border-line p-6">
            <p className="eyebrow">{c.gatesLabel}</p>
            <ol className="mt-5 flex flex-wrap items-center gap-2">
              {c.gates.map((g, i) => (
                <li key={g} className="flex items-center gap-2">
                  <span className="tag tag-accent">{g}</span>
                  {i < c.gates.length - 1 && <span aria-hidden className="text-text-3">→</span>}
                </li>
              ))}
            </ol>
            <p className="mt-5 text-sm text-text-2">{c.gatesNote}</p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <ol className="divide-y divide-line border-y border-line">
            {c.pipeline.map((p, i) => (
              <li key={p} className="flex items-baseline gap-6 py-5">
                <span className="font-mono text-sm text-accent">{String(i + 1).padStart(2, "0")}</span>
                <span className="display text-[22px] md:text-[26px]">{p}</span>
                {i === c.approvalStep && <span className="tag ml-auto">{c.approvalTag}</span>}
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      <section aria-labelledby="desdobramento" className="wrap mt-32 grid gap-12 md:grid-cols-[1fr_1.3fr] md:gap-16">
        <Reveal>
          <p className="eyebrow">
            <b>02</b> · {rollout.who}
          </p>
          <h2 id="desdobramento" className="display mt-4 text-[clamp(34px,4.5vw,56px)]">
            {rollout.t}
          </h2>
          <p className="lede mt-5">{c.rolloutLede}</p>
        </Reveal>
        <Reveal delay={120} className="grid grid-cols-3 items-end gap-3">
          <div className="frame aspect-video col-span-3 grid place-items-center border border-accent/50 bg-surface">
            <span className="eyebrow">Key visual</span>
          </div>
          {["9 / 16", "1 / 1", "4 / 5"].map((r) => (
            <div key={r} className="frame grid place-items-center border border-line bg-surface" style={{ aspectRatio: r }}>
              <span className="eyebrow">{r.replace(" / ", ":")}</span>
            </div>
          ))}
        </Reveal>
      </section>

      <section aria-labelledby="entrega" className="wrap mt-32">
        <Reveal>
          <p className="eyebrow">
            <b>03</b> · {c.deliveryLabel}
          </p>
          <h2 id="entrega" className="display mt-4 text-[clamp(34px,4.5vw,56px)]">
            {t.method[2].t}
          </h2>
          <p className="lede mt-5">{c.deliveryLede}</p>
        </Reveal>
        <Reveal className="mt-12">
          <dl className="grid gap-px overflow-hidden rounded-[var(--radius)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {c.formats.map((x) => (
              <div key={x.f} className="bg-ground p-7">
                <dt className="display text-[30px]">{x.f}</dt>
                <dd className="mt-2 text-text-2">{x.c}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      <Reveal className="wrap mt-24 flex flex-wrap gap-3">
        <Link href={`/${lang}/cases`} className="btn btn-accent">
          {t.hero.seeCases} <span aria-hidden>→</span>
        </Link>
        <Link href={`/${lang}/contato`} className="btn btn-ghost">
          {c.sendBriefing}
        </Link>
      </Reveal>
    </div>
  );
}
