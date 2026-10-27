import type { Metadata } from "next";
import FilmGallery from "@/components/FilmGallery";
import { JsonLd, videoObject } from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import { allFilms } from "@/lib/content";
import { hreflang, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/filmes">): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: "Filmes",
    description: "Filmes publicitários e autorais feitos com IA e híbridos. be-front, powered by Insula e Begen.",
    alternates: hreflang(lang as Locale, "/filmes"),
  };
}

export default async function Filmes({ params }: PageProps<"/[lang]/filmes">) {
  const { lang } = await params;
  const films = allFilms();
  return (
    <div className="wrap pt-32 md:pt-44">
      {films.map((f) => (
        <JsonLd key={f.youtubeId} data={videoObject({ id: f.youtubeId, name: f.titulo, description: f.descricao })} />
      ))}
      <Reveal>
        <p className="eyebrow">be-front, powered by Insula e Begen</p>
        <h1 className="display mt-4 text-[clamp(44px,7vw,96px)]">Filmes</h1>
        <p className="lede mt-5">Publicidade e projetos autorais. Os que têm o selo &ldquo;com case&rdquo; contam a história inteira.</p>
      </Reveal>
      <div className="mt-14">
        <FilmGallery films={films} lang={lang} />
      </div>
    </div>
  );
}
