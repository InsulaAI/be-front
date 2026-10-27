"use client";

import Image from "next/image";
import { useId, useMemo, useState } from "react";

// Formatos e mensagens de exemplo, só para ilustrar o desdobramento.
const FORMATS = [
  { r: "16 / 9", f: "16:9", c: "YouTube" },
  { r: "9 / 16", f: "9:16", c: "Reels" },
  { r: "1 / 1", f: "1:1", c: "Feed" },
  { r: "4 / 5", f: "4:5", c: "Feed" },
  { r: "300 / 250", f: "300×250", c: "Display" },
  { r: "9 / 16", f: "9:16", c: "Shorts" },
  { r: "728 / 90", f: "728×90", c: "Display" },
  { r: "1 / 1", f: "1:1", c: "Marketplace" },
  { r: "160 / 600", f: "160×600", c: "Display" },
  { r: "9 / 16", f: "9:16", c: "Stories" },
  { r: "320 / 100", f: "320×100", c: "Mobile" },
  { r: "4 / 5", f: "4:5", c: "Pinterest" },
];
const MESSAGES = ["Mensagem A", "Mensagem B", "Mensagem C", "Mensagem D", "Mensagem E", "Mensagem F"];
const POS = ["50% 50%", "30% 50%", "70% 50%", "50% 30%", "50% 70%", "20% 40%", "80% 60%"];
const MAX = 120;

export default function KeyVisual({ image }: { image: string }) {
  const [n, setN] = useState(1);
  const id = useId();

  const pieces = useMemo(
    () =>
      Array.from({ length: MAX }, (_, i) => ({
        ...FORMATS[i % FORMATS.length],
        m: MESSAGES[(i + Math.floor(i / FORMATS.length)) % MESSAGES.length],
        pos: POS[(i * 5) % POS.length],
      })),
    [],
  );

  const shown = pieces.slice(0, n);
  const formats = new Set(shown.map((p) => p.f)).size;
  const messages = new Set(shown.map((p) => p.m)).size;
  // Mais peças, colunas mais estreitas: tudo cabe no mesmo quadro.
  const cols = Math.min(12, Math.max(1, Math.round(Math.sqrt(n * 1.6))));

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-14">
      <div className="flex flex-col justify-between gap-8">
        <div>
          <p className="display text-[clamp(64px,9vw,120px)] leading-none text-accent tabular-nums" aria-live="polite">
            {n}
          </p>
          <p className="mt-2 text-text-2">
            {n === 1 ? "key visual" : "peças"} · {formats} {formats === 1 ? "formato" : "formatos"} · {messages}{" "}
            {messages === 1 ? "mensagem" : "mensagens"}
          </p>
        </div>
        <div>
          <label htmlFor={id} className="eyebrow mb-4 block">
            Arraste para desdobrar
          </label>
          <input
            id={id}
            type="range"
            min={1}
            max={MAX}
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            className="kv-range w-full"
            aria-valuetext={`${n} peças`}
          />
          <div className="eyebrow mt-3 flex justify-between">
            <span>1</span>
            <span>{MAX}</span>
          </div>
          <p className="mt-6 text-sm text-text-3">Ilustrativo. Os números de cada campanha estão nas páginas de case.</p>
        </div>
      </div>

      <div className="relative h-[420px] overflow-hidden rounded-[var(--radius)] border border-line bg-surface p-2 md:h-[560px]">
        <div className={n === 1 ? "flex h-full items-center" : "h-full"} style={n === 1 ? undefined : { columnCount: cols, columnGap: 6 }}>
          {shown.map((p, i) => (
            <div
              key={i}
              className="kv-piece relative mb-1.5 w-full break-inside-avoid overflow-hidden rounded-[6px] bg-surface-2"
              style={{ aspectRatio: n === 1 ? "16 / 9" : p.r }}
            >
              <Image
                src={image}
                alt=""
                fill
                sizes={`${Math.ceil(100 / cols)}vw`}
                className="object-cover"
                style={{ objectPosition: p.pos }}
              />
              {cols <= 6 && (
                <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/80 to-transparent px-2 pb-1.5 pt-4 font-mono text-[9px] uppercase tracking-wider text-text-2">
                  <span className="truncate">{p.f} · {p.c}</span>
                  {n > 1 && <span className="hidden truncate text-accent sm:inline">{p.m}</span>}
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-surface to-transparent" />
      </div>
    </div>
  );
}
