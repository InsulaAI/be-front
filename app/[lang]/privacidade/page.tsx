import type { Metadata } from "next";
import { site } from "@/lib/content";
import { getDict } from "@/lib/dict";
import { hreflang, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/privacidade">): Promise<Metadata> {
  const { lang } = await params;
  return { title: getDict(lang).meta.privacidade.title, alternates: hreflang(lang as Locale, "/privacidade") };
}

// Rascunho: revisar com o jurídico antes de publicar (ver README).
export default async function Privacidade({ params }: PageProps<"/[lang]/privacidade">) {
  const t = getDict((await params).lang);
  return (
    <div className="wrap max-w-3xl pt-32 md:pt-44">
      <p className="eyebrow">{t.powered}</p>
      <h1 className="display mt-4 text-[clamp(40px,6vw,72px)]">{t.meta.privacidade.title}</h1>
      <div className="mt-10 grid gap-6 text-text-2 [&_h2]:display [&_h2]:mt-6 [&_h2]:text-[24px] [&_h2]:text-text">
        {t.priv.sections.map(([h, p]) => (
          <section key={h} className="contents">
            <h2>{h}</h2>
            <p>{p}</p>
          </section>
        ))}
        <h2>{t.priv.rightsTitle}</h2>
        <p>
          {site.email ? (
            <>
              {t.priv.rightsEmail}{" "}
              <a className="text-text underline" href={`mailto:${site.email}`}>
                {site.email}
              </a>
              .
            </>
          ) : (
            t.priv.rightsForm
          )}
        </p>
      </div>
    </div>
  );
}
