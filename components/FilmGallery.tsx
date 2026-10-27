"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Filme } from "@/lib/content";
import { TIPO_LABEL, entregaLabel, ytThumb } from "@/lib/labels";
import { PlayBadge, Player } from "./YouTube";

type Filters = { categoria: string; tipo: string; setor: string; entrega: string; ano: string };
const EMPTY: Filters = { categoria: "", tipo: "", setor: "", entrega: "", ano: "" };

export default function FilmGallery({ films, lang }: { films: Filme[]; lang: string }) {
  const [f, setF] = useState<Filters>(EMPTY);
  const [open, setOpen] = useState<Filme | null>(null);

  // Link copiado abre o filme direto: /filmes?v=<id>
  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get("v");
    const film = v && films.find((x) => x.youtubeId === v);
    if (film) setOpen(film);
  }, [films]);

  const options = useMemo(() => {
    const uniq = <T,>(a: T[]) => [...new Set(a.filter(Boolean))] as T[];
    return {
      tipo: uniq(films.map((x) => x.tipo)).map((t) => ({ v: t!, l: TIPO_LABEL[t!] })),
      setor: uniq(films.map((x) => x.setor)).sort().map((s) => ({ v: s!, l: s! })),
      ano: uniq(films.map((x) => x.ano)).sort((a, b) => b! - a!).map((a) => ({ v: String(a), l: String(a) })),
    };
  }, [films]);

  const list = films.filter(
    (x) =>
      (!f.categoria || x.categoria === f.categoria) &&
      (!f.tipo || x.tipo === f.tipo) &&
      (!f.setor || x.setor === f.setor) &&
      (!f.ano || String(x.ano) === f.ano) &&
      (!f.entrega || entregaLabel(x.entrega) === f.entrega),
  );

  const set = (k: keyof Filters) => (v: string) => setF((s) => ({ ...s, [k]: s[k] === v ? "" : v }));
  const active = Object.values(f).some(Boolean);

  return (
    <>
      <div className="flex flex-col gap-5 border-y border-line py-6">
        <ChipRow label="Tipo de filme" value={f.categoria} onChange={set("categoria")} options={[{ v: "publicidade", l: "Publicidade" }, { v: "autoral", l: "Autoral" }]} />
        {options.tipo.length > 0 && <ChipRow label="Técnica" value={f.tipo} onChange={set("tipo")} options={options.tipo} />}
        <ChipRow
          label="Entrega"
          value={f.entrega}
          onChange={set("entrega")}
          options={["Filme", "Desdobramento", "Filme e desdobramento"].map((l) => ({ v: l, l: l === "Filme e desdobramento" ? "Ambos" : l }))}
        />
        <ChipRow label="Setor" value={f.setor} onChange={set("setor")} options={options.setor} />
        <ChipRow label="Ano" value={f.ano} onChange={set("ano")} options={options.ano} />
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="eyebrow" aria-live="polite">
          {list.length} {list.length === 1 ? "filme" : "filmes"}
        </p>
        {active && (
          <button type="button" className="eyebrow underline-offset-4 hover:text-text hover:underline" onClick={() => setF(EMPTY)}>
            Limpar filtros
          </button>
        )}
      </div>

      <ul className="mt-6 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((x) => (
          <li key={x.youtubeId}>
            <button type="button" onClick={() => setOpen(x)} className="group block w-full text-left" aria-label={`Assistir: ${x.titulo}`}>
              <div className="frame aspect-video">
                <Thumb id={x.youtubeId} />
                <span className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/0" />
                <PlayBadge small />
                {x.caseSlug && <span className="tag tag-accent absolute left-3 top-3 bg-ground/75">com case</span>}
                {x.semAudio && <span className="tag absolute right-3 top-3 bg-ground/75">sem áudio</span>}
              </div>
              <h3 className="display mt-4 text-[22px]">{x.titulo}</h3>
              <p className="eyebrow mt-2">
                {[x.categoria === "autoral" ? "Autoral" : null, x.ano, x.setor, x.tipo ? TIPO_LABEL[x.tipo] : null].filter(Boolean).join(" · ")}
              </p>
            </button>
          </li>
        ))}
      </ul>
      {list.length === 0 && <p className="mt-10 text-text-2">Nenhum filme com essa combinação de filtros.</p>}

      {open && <FilmModal film={open} lang={lang} onClose={() => setOpen(null)} />}
    </>
  );
}

function Thumb({ id }: { id: string }) {
  const [src, setSrc] = useState(ytThumb(id));
  return (
    <Image
      src={src}
      alt=""
      fill
      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
      onError={() => setSrc(ytThumb(id, "hqdefault"))}
      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
    />
  );
}

function ChipRow({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { v: string; l: string }[] }) {
  if (!options.length) return null;
  return (
    <div className="flex flex-col gap-2.5 md:flex-row md:items-center md:gap-6">
      <span className="eyebrow w-32 shrink-0">{label}</span>
      <div className="-mx-1 flex flex-wrap gap-2 px-1">
        {options.map((o) => (
          <button
            key={o.v}
            type="button"
            aria-pressed={value === o.v}
            onClick={() => onChange(o.v)}
            className={`h-9 rounded-full border px-4 text-sm capitalize transition-colors ${
              value === o.v ? "border-accent bg-accent text-accent-ink" : "border-line-2 text-text-2 hover:border-text hover:text-text"
            }`}
          >
            {o.l}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Player em tela cheia, com som e legendas. Fecha com Esc, no X ou clicando fora. */
function FilmModal({ film, lang, onClose }: { film: Filme; lang: string; onClose: () => void }) {
  const dialog = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const close = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete("v");
    window.history.replaceState(null, "", url);
    onClose();
  }, [onClose]);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    const url = new URL(window.location.href);
    url.searchParams.set("v", film.youtubeId);
    window.history.replaceState(null, "", url);
    document.body.style.overflow = "hidden";
    dialog.current?.querySelector<HTMLElement>("button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab" && dialog.current) {
        const els = dialog.current.querySelectorAll<HTMLElement>("button, a, iframe");
        const first = els[0];
        const last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prev?.focus();
    };
  }, [film, close]);

  async function copy() {
    const url = new URL(`/${lang}/filmes`, window.location.origin);
    url.searchParams.set("v", film.youtubeId);
    try {
      await navigator.clipboard.writeText(url.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copie o link:", url.toString());
    }
  }

  return (
    <div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-label={film.titulo}
      className="fixed inset-0 z-[100] flex flex-col bg-ground"
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div className="wrap flex h-16 shrink-0 items-center justify-between gap-4">
        <p className="display truncate text-[18px] md:text-[22px]">{film.titulo}</p>
        <div className="flex shrink-0 items-center gap-2">
          <button type="button" onClick={copy} className="btn btn-ghost h-10 px-4 text-sm">
            {copied ? "Link copiado" : "Copiar link"}
          </button>
          {film.caseSlug && (
            <Link href={`/${lang}/cases/${film.caseSlug}`} className="btn btn-ghost hidden h-10 px-4 text-sm sm:inline-flex">
              Ver case
            </Link>
          )}
          <button type="button" onClick={close} aria-label="Fechar" className="grid h-10 w-10 place-items-center rounded-full border border-line-2 text-lg hover:border-text">
            ×
          </button>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center px-4 pb-6" onClick={(e) => e.target === e.currentTarget && close()}>
        <div className="relative aspect-video w-full max-w-[min(1400px,calc((100dvh-7rem)*16/9))] overflow-hidden rounded-[var(--radius)] bg-surface">
          <Player id={film.youtubeId} title={film.titulo} />
        </div>
      </div>
    </div>
  );
}
