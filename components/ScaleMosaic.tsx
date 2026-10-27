"use client";

import { useEffect, useRef, useState } from "react";
import type { Variacao } from "@/lib/content";
import { getDict } from "@/lib/dict";

function ratio(formato: string) {
  const m = formato.match(/^(\d+)\s*[:x×]\s*(\d+)$/);
  return m ? `${m[1]} / ${m[2]}` : "1 / 1";
}

/** "1920x1080" → "1920×1080" para leitura. */
const pretty = (formato: string) => formato.replace(/(\d)\s*x\s*(\d)/, "$1×$2");

/** As variações da Begen, filtráveis por formato e por canal. */
export default function ScaleMosaic({ lang, items }: { lang: string; items: Variacao[] }) {
  const t = getDict(lang).mosaic;
  const [formato, setFormato] = useState("");
  const [canal, setCanal] = useState("");
  const formatos = [...new Set(items.map((v) => v.formato))];
  const canais = [...new Set(items.map((v) => v.canal))];
  const list = items.filter((v) => (!formato || v.formato === formato) && (!canal || v.canal === canal));

  const chip = (on: boolean) =>
    `h-9 rounded-full border px-4 text-sm transition-colors ${on ? "border-accent bg-accent text-accent-ink" : "border-line-2 text-text-2 hover:border-text hover:text-text"}`;

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:flex-wrap md:gap-x-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="eyebrow mr-2">{t.format}</span>
          {formatos.map((f) => (
            <button key={f} type="button" aria-pressed={formato === f} className={chip(formato === f)} onClick={() => setFormato(formato === f ? "" : f)}>
              {pretty(f)}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="eyebrow mr-2">{t.channel}</span>
          {canais.map((c) => (
            <button key={c} type="button" aria-pressed={canal === c} className={chip(canal === c)} onClick={() => setCanal(canal === c ? "" : c)}>
              {c}
            </button>
          ))}
        </div>
      </div>
      <p className="eyebrow mt-6" aria-live="polite">
        {list.length} {t.of} {items.length} {t.pieces}
      </p>
      <div className="mt-4 columns-2 gap-3 sm:columns-3 lg:columns-4">
        {list.map((v) => (
          <figure key={v.src ?? `${v.formato}-${v.canal}`} className="mb-3 break-inside-avoid">
            <div className="frame !rounded-[8px]" style={{ aspectRatio: ratio(v.formato) }}>
              {v.src ? (
                <Piece v={v} />
              ) : (
                <div className="absolute inset-0 grid place-items-center bg-[repeating-linear-gradient(135deg,var(--surface-2)_0_10px,var(--surface)_10px_20px)] text-text-3">
                  {pretty(v.formato)}
                </div>
              )}
            </div>
            <figcaption className="eyebrow mt-1.5 !text-[10px]">
              {pretty(v.formato)} · {v.canal}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

/** Peça animada: mostra a capa e só toca enquanto está na tela (e se o sistema não pede menos movimento). */
function Piece({ v }: { v: Variacao }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? el.play().catch(() => {}) : el.pause()), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <video ref={ref} muted loop playsInline preload="none" poster={v.poster} aria-label={`${pretty(v.formato)} · ${v.canal}`} className="absolute inset-0 h-full w-full object-cover">
      <source src={v.src!} type="video/mp4" />
      {v.webm && <source src={v.webm} type="video/webm" />}
    </video>
  );
}
