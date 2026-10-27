import type { Metadata } from "next";
import CaseCard from "@/components/CaseCard";
import Reveal from "@/components/Reveal";
import { listedCases } from "@/lib/content";
import { getDict } from "@/lib/dict";
import { hreflang, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/cases">): Promise<Metadata> {
  const { lang } = await params;
  const m = getDict(lang).meta.cases;
  return { title: m.title, description: m.desc, alternates: hreflang(lang as Locale, "/cases") };
}

export default async function Cases({ params }: PageProps<"/[lang]/cases">) {
  const lang = (await params).lang as Locale;
  const t = getDict(lang);
  const cases = listedCases(lang);
  return (
    <div className="wrap pt-32 md:pt-44">
      <Reveal>
        <p className="eyebrow">{t.powered}</p>
        <h1 className="display mt-4 text-[clamp(44px,7vw,96px)]">{t.casesPage.title}</h1>
        <p className="lede mt-5">{t.casesPage.lede}</p>
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
