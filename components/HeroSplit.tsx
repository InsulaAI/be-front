"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Rect = { x: number; y: number; w: number; h: number };
type Tile = { key: string; label: string };
type Media = { image: string; focus?: string; loop?: { mp4: string; webm: string; poster: string } };

const TILES_DESKTOP: Tile[] = [
  { key: "master", label: "16:9 · YouTube e TV" },
  { key: "vertical", label: "9:16 · Reels e Shorts" },
  { key: "square", label: "1:1 · Feed" },
  { key: "banner", label: "728×90 · Display" },
];
const TILES_MOBILE: Tile[] = [
  { key: "master", label: "16:9 · YouTube" },
  { key: "vertical", label: "9:16 · Reels" },
  { key: "square", label: "1:1 · Feed" },
  { key: "banner", label: "320×100" },
];

/** Onde cada formato termina, em pixels, com o bloco começando em y = 0 e cabendo em `ah` de altura. */
function layout(W: number, ah: number): Rect[] {
  const mobile = W < 900;
  const g = mobile ? 10 : 16;
  const pad = mobile ? 20 : 40;
  const top = 0;
  const aw = Math.min(W - pad * 2, 1160);

  if (mobile) {
    let w = aw;
    const total = (ww: number) => ww * 0.5625 + g + ww * 0.42 * (16 / 9);
    if (total(w) > ah) w = ah / (0.5625 + 0.42 * (16 / 9) + g / w);
    const x0 = (W - w) / 2;
    const h1 = w * 0.5625;
    const wv = w * 0.42;
    const hv = wv * (16 / 9);
    const wr = w - wv - g;
    const yb = top + h1 + g;
    return [
      { x: x0, y: top, w, h: h1 },
      { x: x0, y: yb, w: wv, h: hv },
      { x: x0 + wv + g, y: yb, w: wr, h: wr },
      { x: x0 + wv + g, y: yb + wr + g, w: wr, h: Math.max(hv - wr - g, 24) },
    ];
  }

  // Linha de cima: 16:9, 9:16 e 1:1 com a mesma altura. Embaixo, o banner com a largura toda.
  const k = 16 / 9 + 9 / 16 + 1;
  let h1 = (aw - 2 * g) / k;
  const height = (hh: number) => hh + g + (hh * k + 2 * g) / 8.1;
  if (height(h1) > ah) h1 = (ah - g - (2 * g) / 8.1) / (1 + k / 8.1);
  const rowW = h1 * k + 2 * g;
  const x0 = (W - rowW) / 2;
  const wM = h1 * (16 / 9);
  const wV = h1 * (9 / 16);
  return [
    { x: x0, y: top, w: wM, h: h1 },
    { x: x0 + wM + g, y: top, w: wV, h: h1 },
    { x: x0 + wM + wV + 2 * g, y: top, w: h1, h: h1 },
    { x: x0, y: top + h1 + g, w: rowW, h: rowW / 8.1 },
  ];
}

const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export default function HeroSplit({ lang, media, title, intro }: { lang: string; media: Media; title: string; intro: string }) {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const tiles = useRef<(HTMLDivElement | null)[]>([]);
  const copy = useRef<HTMLDivElement>(null);
  const after = useRef<HTMLDivElement>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const [mobile, setMobile] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [paused, setPaused] = useState(false);
  const hasLoop = !!(media.loop && (media.loop.mp4 || media.loop.webm));

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const set = () => {
      setReduced(mq.matches);
      if (mq.matches) setPaused(true);
    };
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  useEffect(() => {
    let raf = 0;
    let ends: Rect[] = [];
    let W = 0;
    let H = 0;

    const measure = () => {
      const s = stage.current;
      if (!s) return;
      W = s.clientWidth;
      H = s.clientHeight;
      setMobile(W < 900);
      // Legenda e bloco de formatos centralizados juntos, abaixo do cabeçalho.
      const header = W < 768 ? 64 : 80;
      const capH = after.current?.offsetHeight ?? 40;
      const gap = W < 900 ? 16 : 28;
      const room = H - header - capH - gap - (W < 900 ? 32 : 48);
      const rects = layout(W, room);
      const blockH = Math.max(...rects.map((r) => r.y + r.h));
      const y0 = header + Math.max(16, (H - header - (capH + gap + blockH)) / 2);
      if (after.current) after.current.style.top = `${y0}px`;
      ends = rects.map((r) => ({ ...r, y: r.y + y0 + capH + gap }));
    };

    const paint = () => {
      raf = 0;
      const sec = section.current;
      if (!sec || !ends.length) return;
      const r = sec.getBoundingClientRect();
      const span = sec.offsetHeight - window.innerHeight;
      const p = reduced || span <= 0 ? 0 : clamp01(-r.top / span);
      // 0 → 0,15: quadro inteiro parado. 0,15 → 0,85: divide. Depois: segura o resultado.
      const t = ease(clamp01((p - 0.15) / 0.7));
      tiles.current.forEach((el, i) => {
        if (!el) return;
        const e = ends[i];
        const x = e.x * t;
        const y = e.y * t;
        const w = W + (e.w - W) * t;
        const h = H + (e.h - H) * t;
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        el.style.width = `${w}px`;
        el.style.height = `${h}px`;
        el.style.borderRadius = `${14 * t}px`;
        // Os formatos derivados nascem de dentro do mestre.
        el.style.opacity = i === 0 ? "1" : String(clamp01(t * 3));
        const label = el.querySelector<HTMLElement>("[data-label]");
        if (label) label.style.opacity = String(clamp01((t - 0.7) / 0.3));
      });
      if (copy.current) {
        copy.current.style.opacity = String(1 - clamp01(p / 0.15));
        copy.current.style.transform = `translate3d(0, ${-40 * clamp01(p / 0.15)}px, 0)`;
        copy.current.style.pointerEvents = p > 0.1 ? "none" : "";
      }
      if (after.current) {
        const a = clamp01((t - 0.6) / 0.4);
        after.current.style.opacity = String(a);
        after.current.style.transform = `translate3d(0, ${16 * (1 - a)}px, 0)`;
      }
      const shade = stage.current?.querySelector<HTMLElement>("[data-shade]");
      if (shade) shade.style.opacity = String(1 - t);
    };

    const req = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const onResize = () => {
      measure();
      req();
    };
    measure();
    paint();
    window.addEventListener("scroll", req, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", req);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  useEffect(() => {
    videos.current.forEach((v) => {
      if (!v) return;
      if (paused) v.pause();
      else v.play().catch(() => {});
    });
  }, [paused]);

  const list = mobile ? TILES_MOBILE : TILES_DESKTOP;

  return (
    <section ref={section} aria-label="Abertura" className={reduced ? "relative h-[100svh]" : "relative h-[260svh]"}>
      <div ref={stage} className="sticky top-0 h-[100svh] overflow-hidden">
        {list.map((tile, i) => (
          <div
            key={tile.key}
            ref={(el) => {
              tiles.current[i] = el;
            }}
            className="absolute left-0 top-0 overflow-hidden bg-surface-2 will-change-transform"
            style={{ width: "100%", height: "100%", zIndex: i === 0 ? 2 : 1, opacity: i === 0 ? 1 : 0 }}
            aria-hidden={i > 0}
          >
            {hasLoop ? (
              <video
                ref={(el) => {
                  videos.current[i] = el;
                }}
                className="h-full w-full object-cover"
                style={{ objectPosition: media.focus }}
                autoPlay={!reduced}
                muted
                loop
                playsInline
                preload={i === 0 ? "auto" : "metadata"}
                poster={media.loop!.poster || media.image}
              >
                {media.loop!.webm && <source src={media.loop!.webm} type="video/webm" />}
                {media.loop!.mp4 && <source src={media.loop!.mp4} type="video/mp4" />}
              </video>
            ) : (
              <Image
                src={media.image}
                alt={i === 0 ? "Frame do filme-mestre" : ""}
                fill
                sizes="100vw"
                priority={i === 0}
                className="object-cover"
                style={{ objectPosition: media.focus }}
              />
            )}
            <span
              data-label
              className="eyebrow absolute bottom-0 left-0 whitespace-nowrap rounded-tr-lg bg-ground/80 px-2.5 py-1.5 !text-[10px] !text-text-2 opacity-0 md:!text-[11px]"
            >
              {tile.label}
            </span>
          </div>
        ))}

        <div data-shade className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-t from-ground via-ground/40 to-ground/30" />

        <div ref={copy} className="absolute inset-x-0 bottom-0 z-[4] pb-[12svh]">
          <div className="wrap">
            <p className="eyebrow mb-5">
              <b>●</b>&nbsp; be-front, powered by Insula e Begen
            </p>
            <h1 className="display max-w-[14ch] text-[clamp(44px,8vw,112px)]">{title}</h1>
            <p className="lede mt-6">{intro}</p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href={`/${lang}/cases`} className="btn btn-accent">
                Ver cases
                <span aria-hidden>→</span>
              </Link>
              <Link href={`/${lang}/como-funciona`} className="btn btn-ghost">
                Como funciona
              </Link>
            </div>
          </div>
        </div>

        <div ref={after} className="pointer-events-none absolute inset-x-0 top-[80px] z-[4] opacity-0">
          <div className="wrap">
            <p className="display text-[clamp(22px,3vw,36px)]">
              Um filme-mestre. <span className="text-text-3">Todos os formatos.</span>
            </p>
          </div>
        </div>

        {!reduced && (
          <div className="absolute bottom-6 right-5 z-[5] flex items-center gap-3 md:right-10">
            {hasLoop && (
              <button
                type="button"
                onClick={() => setPaused((v) => !v)}
                className="eyebrow rounded-full border border-line-2 bg-ground/60 px-3 py-2 !text-text-2 backdrop-blur hover:!text-text"
                aria-pressed={paused}
              >
                {paused ? "▶ Tocar" : "❚❚ Pausar"}
              </button>
            )}
            <span className="eyebrow hidden md:inline">Role para ver ↓</span>
          </div>
        )}
      </div>
    </section>
  );
}
