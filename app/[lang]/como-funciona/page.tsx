import type { Metadata } from "next";
import Link from "next/link";
import Method from "@/components/Method";
import Reveal from "@/components/Reveal";
import { hreflang, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/como-funciona">): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: "Como funciona",
    description: "Filme-mestre, desdobramento e entrega em todos os canais. O método da be-front, powered by Insula e Begen.",
    alternates: hreflang(lang as Locale, "/como-funciona"),
  };
}

const PIPELINE = [
  "Brainstorm e conceito",
  "Decupagem de roteiro",
  "Moodboard",
  "Aprovação do cliente",
  "Desenvolvimento offline",
  "Revisões",
  "Online final",
];
const GATES = ["Proposta criativa", "Storyboard", "Filme final"];
const FORMATOS = [
  { f: "16:9", c: "TV, YouTube, CTV" },
  { f: "9:16", c: "Reels, Shorts, Stories, TikTok" },
  { f: "1:1 e 4:5", c: "Feed e marketplace" },
  { f: "Display", c: "300×250, 728×90, 160×600, 320×100" },
];

export default async function ComoFunciona({ params }: PageProps<"/[lang]/como-funciona">) {
  const { lang } = await params;
  return (
    <div className="pt-32 md:pt-44">
      <header className="wrap">
        <Reveal>
          <p className="eyebrow">be-front, powered by Insula e Begen</p>
          <h1 className="display mt-4 max-w-[16ch] text-[clamp(44px,7vw,96px)]">Do filme aos formatos, sem troca de mãos.</h1>
          <p className="lede mt-6">
            Uma equipe cuida do conceito, do filme e de cada peça que sai dele. O que foi aprovado no filme chega igual ao banner.
          </p>
        </Reveal>
        <Reveal className="mt-16 md:mt-24">
          <Method compact />
        </Reveal>
      </header>

      <section aria-labelledby="mestre" className="wrap mt-32 grid gap-12 md:grid-cols-[1fr_1.3fr] md:gap-16">
        <Reveal>
          <p className="eyebrow">
            <b>01</b> · Insula
          </p>
          <h2 id="mestre" className="display mt-4 text-[clamp(34px,4.5vw,56px)]">
            Filme-mestre
          </h2>
          <p className="lede mt-5">
            Do roteiro ao filme final em cerca de 18 dias. A IA acelera geração e iteração; direção e aprovação continuam humanas.
          </p>
          <div className="mt-10 rounded-[var(--radius)] border border-line p-6">
            <p className="eyebrow">Três aprovações, nesta ordem</p>
            <ol className="mt-5 flex flex-wrap items-center gap-2">
              {GATES.map((g, i) => (
                <li key={g} className="flex items-center gap-2">
                  <span className="tag tag-accent">{g}</span>
                  {i < GATES.length - 1 && <span aria-hidden className="text-text-3">→</span>}
                </li>
              ))}
            </ol>
            <p className="mt-5 text-sm text-text-2">Com o storyboard aprovado, as cenas ficam fechadas, e o escopo também.</p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <ol className="divide-y divide-line border-y border-line">
            {PIPELINE.map((p, i) => (
              <li key={p} className="flex items-baseline gap-6 py-5">
                <span className="font-mono text-sm text-accent">{String(i + 1).padStart(2, "0")}</span>
                <span className="display text-[22px] md:text-[26px]">{p}</span>
                {p === "Aprovação do cliente" && <span className="tag ml-auto">aprovação</span>}
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      <section aria-labelledby="desdobramento" className="wrap mt-32 grid gap-12 md:grid-cols-[1fr_1.3fr] md:gap-16">
        <Reveal>
          <p className="eyebrow">
            <b>02</b> · Begen · AdMultify
          </p>
          <h2 id="desdobramento" className="display mt-4 text-[clamp(34px,4.5vw,56px)]">
            Desdobramento
          </h2>
          <p className="lede mt-5">
            O AdMultify, da Begen, transforma o key visual do filme em centenas de variações de formato e de mensagem.
          </p>
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
            <b>03</b> · Todos os canais
          </p>
          <h2 id="entrega" className="display mt-4 text-[clamp(34px,4.5vw,56px)]">
            Entrega
          </h2>
          <p className="lede mt-5">Cada peça sai no tamanho, na duração e no texto do canal onde vai rodar.</p>
        </Reveal>
        <Reveal className="mt-12">
          <dl className="grid gap-px overflow-hidden rounded-[var(--radius)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {FORMATOS.map((x) => (
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
          Ver cases <span aria-hidden>→</span>
        </Link>
        <Link href={`/${lang}/contato`} className="btn btn-ghost">
          Enviar briefing
        </Link>
      </Reveal>
    </div>
  );
}
