"use client";

import { useState } from "react";
import type { Variacao } from "@/lib/content";

function ratio(formato: string) {
  const m = formato.match(/^(\d+)\s*[:x×]\s*(\d+)$/);
  return m ? `${m[1]} / ${m[2]}` : "1 / 1";
}

/** As variações da Begen, filtráveis por formato e por canal. */
export default function ScaleMosaic({ items }: { items: Variacao[] }) {
  const [formato, setFormato] = useState("");
  const [canal, setCanal] = useState("");
  const formatos = [...new Set(items.map((v) => v.formato))];
  const canais = [...new Set(items.map((v) => v.canal))];
  const list = items.filter((v) => (!formato || v.formato === formato) && (!canal || v.canal === canal));

  const chip = (on: boolean) =>
    `h-9 rounded-full border px-4 text-sm transition-colors ${on ? "border-accent bg-accent text-accent-ink" : "border-line-2 text-text-2 hover:border-text hover:text-text"}`;

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:gap-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="eyebrow mr-2">Formato</span>
          {formatos.map((f) => (
            <button key={f} type="button" aria-pressed={formato === f} className={chip(formato === f)} onClick={() => setFormato(formato === f ? "" : f)}>
              {f}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="eyebrow mr-2">Canal</span>
          {canais.map((c) => (
            <button key={c} type="button" aria-pressed={canal === c} className={chip(canal === c)} onClick={() => setCanal(canal === c ? "" : c)}>
              {c}
            </button>
          ))}
        </div>
      </div>
      <p className="eyebrow mt-6" aria-live="polite">
        {list.length} de {items.length} peças
      </p>
      <div className="mt-4 columns-2 gap-3 sm:columns-3 lg:columns-4">
        {list.map((v, i) => (
          <figure key={i} className="mb-3 break-inside-avoid">
            <div className="frame !rounded-[8px]" style={{ aspectRatio: ratio(v.formato) }}>
              {v.src ? (
                <video src={v.src} poster={v.poster} muted loop playsInline autoPlay preload="none" className="h-full w-full object-cover" />
              ) : (
                <div className="absolute inset-0 grid place-items-center bg-[repeating-linear-gradient(135deg,var(--surface-2)_0_10px,var(--surface)_10px_20px)] text-text-3">
                  {v.formato}
                </div>
              )}
            </div>
            <figcaption className="eyebrow mt-1.5 !text-[10px]">
              {v.formato} · {v.canal}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
