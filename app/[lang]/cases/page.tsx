import type { Metadata } from "next";
import CaseCard from "@/components/CaseCard";
import Reveal from "@/components/Reveal";
import { listedCases } from "@/lib/content";
import { hreflang, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/cases">): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: "Cases",
    description: "Cases da be-front, powered by Insula e Begen: filmes-mestre e desdobramentos para Unilever, KFC e Maturatta.",
    alternates: hreflang(lang as Locale, "/cases"),
  };
}

export default async function Cases({ params }: PageProps<"/[lang]/cases">) {
  const { lang } = await params;
  const cases = listedCases();
  return (
    <div className="wrap pt-32 md:pt-44">
      <Reveal>
        <p className="eyebrow">be-front, powered by Insula e Begen</p>
        <h1 className="display mt-4 text-[clamp(44px,7vw,96px)]">Cases</h1>
        <p className="lede mt-5">Do mais recente ao mais antigo. Cada um com o filme, o que foi entregue e, quando houver, o resultado.</p>
      </Reveal>
      <div className="mt-16 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 md:mt-24">
        {cases.map((c, i) => (
          <Reveal key={c.slug} delay={(i % 3) * 100}>
            <CaseCard c={c} lang={lang} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
