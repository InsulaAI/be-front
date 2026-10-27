import type { Metadata } from "next";
import FilmGallery from "@/components/FilmGallery";
import { JsonLd, videoObject } from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import { allFilms } from "@/lib/content";
import { getDict } from "@/lib/dict";
import { hreflang, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/filmes">): Promise<Metadata> {
  const { lang } = await params;
  const m = getDict(lang).meta.filmes;
  return { title: m.title, description: m.desc, alternates: hreflang(lang as Locale, "/filmes") };
}

export default async function Filmes({ params }: PageProps<"/[lang]/filmes">) {
  const lang = (await params).lang as Locale;
  const t = getDict(lang);
  const films = allFilms(lang);
  return (
    <div className="wrap pt-32 md:pt-44">
      {films.map((f) => (
        <JsonLd key={f.youtubeId} data={videoObject({ id: f.youtubeId, name: f.titulo, description: f.descricao })} />
      ))}
      <Reveal>
        <p className="eyebrow">{t.powered}</p>
        <h1 className="display mt-4 text-[clamp(44px,7vw,96px)]">{t.filmesPage.title}</h1>
        <p className="lede mt-5">{t.filmesPage.lede}</p>
      </Reveal>
      <div className="mt-14">
        <FilmGallery films={films} lang={lang} />
      </div>
    </div>
  );
}
