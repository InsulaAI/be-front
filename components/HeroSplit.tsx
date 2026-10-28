"use client";

import Image from "next/image";
import Link from "next/link";
import { setHeroVariant, track } from "@/lib/analytics";
import GooglePartner from "./GooglePartner";
import { getDict } from "@/lib/dict";
import { useEffect, useRef, useState } from "react";

type Rect = { x: number; y: number; w: number; h: number };
/** Uma versão do hero: imagem (ou loop) e o ponto de recorte. As versões são sorteadas por visitante. */
export type HeroVariant = { id: string; image: string; focus?: string; loop?: { mp4: string; webm: string; poster: string } | null; peso?: number };

const STORAGE_KEY = "bf-hero";

/** Escolhe a versão do hero: ?hero=<id> na URL (para conferir cada uma), a já sorteada para este visitante ou um novo sorteio por peso. */
function pickVariant(variants: HeroVariant[]): HeroVariant {
  const byId = (id: string | null) => variants.find((v) => v.id === id);
  const forced = byId(new URLSearchParams(window.location.search).get("hero"));
  if (forced) return forced;
  let saved: string | null = null;
  try {
    saved = window.localStorage.getItem(STORAGE_KEY);
  } catch {}
  // Quem já sorteou uma versão fica nela, a menos que ela tenha saído do sorteio (peso 0).
  const kept = byId(saved);
  if (kept && (kept.peso ?? 1) > 0) return kept;
  const total = variants.reduce((n, v) => n + (v.peso ?? 1), 0);
  let r = Math.random() * total;
  const chosen = variants.find((v) => (r -= v.peso ?? 1) < 0) ?? variants[0];
  try {
    window.localStorage.setItem(STORAGE_KEY, chosen.id);
  } catch {}
  return chosen;
}

const TILE_KEYS = ["master", "vertical", "square", "banner"] as const;

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

/** "50% 42%" → [0,5, 0,42]. Ponto de recorte do object-position, reaproveitado no desenho dos formatos. */
function parseFocus(f?: string): [number, number] {
  const [x, y] = (f ?? "50% 50%").split(/\s+/).map((v) => parseFloat(v) / 100);
  return [Number.isFinite(x) ? x : 0.5, Number.isFinite(y) ? y : 0.5];
}

/** Desenha o quadro atual do vídeo no canvas como object-fit: cover, no mesmo ponto de recorte. */
function drawCover(video: HTMLVideoElement, canvas: HTMLCanvasElement, [fx, fy]: [number, number]) {
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const cw = Math.round(canvas.clientWidth * dpr);
  const ch = Math.round(canvas.clientHeight * dpr);
  if (!cw || !ch || !video.videoWidth) return;
  if (canvas.width !== cw) canvas.width = cw;
  if (canvas.height !== ch) canvas.height = ch;
  const vw = video.videoWidth;
  const vh = video.videoHeight;
  const scale = Math.max(cw / vw, ch / vh);
  const sw = cw / scale;
  const sh = ch / scale;
  canvas.getContext("2d")?.drawImage(video, (vw - sw) * fx, (vh - sh) * fy, sw, sh, 0, 0, cw, ch);
}
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export default function HeroSplit({ lang, variants }: { lang: string; variants: HeroVariant[] }) {
  const t = getDict(lang);
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const tiles = useRef<(HTMLDivElement | null)[]>([]);
  const copy = useRef<HTMLDivElement>(null);
  const after = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const canvases = useRef<(HTMLCanvasElement | null)[]>([]);
  // Quanto o quadro já se dividiu (0 a 1). Os formatos só são redesenhados depois que aparecem.
  const split = useRef(0);
  const [mobile, setMobile] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [paused, setPaused] = useState(false);
  // Sorteada só no navegador; até lá o palco fica no fundo escuro, sem trocar de imagem na frente de quem vê.
  const [media, setMedia] = useState<HeroVariant | null>(null);
  const hasLoop = !!(media?.loop && (media.loop.mp4 || media.loop.webm));

  useEffect(() => {
    const v = pickVariant(variants);
    setMedia(v);
    setHeroVariant(v.id);
    track("hero_variante", { variante: v.id });
  }, [variants]);

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
      split.current = t;
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
    const v = video.current;
    if (!v) return;
    if (paused) v.pause();
    else v.play().catch(() => {});
  }, [paused, media]);

  // Um vídeo só é baixado: os formatos derivados copiam o quadro dele num canvas, sempre em sincronia.
  useEffect(() => {
    if (!hasLoop) return;
    const focus = parseFocus(media?.focus);
    let raf = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      const v = video.current;
      if (!v || v.readyState < 2 || split.current < 0.01) return;
      canvases.current.forEach((c) => c && drawCover(v, c, focus));
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [hasLoop, media]);

  const labels = mobile ? t.hero.tilesMobile : t.hero.tiles;

  return (
    <section ref={section} aria-label={t.hero.aria} className={reduced ? "relative h-[100svh]" : "relative h-[260svh]"}>
      <div ref={stage} className="sticky top-0 h-[100svh] overflow-hidden">
        {TILE_KEYS.map((key, i) => (
          <div
            key={key}
            ref={(el) => {
              tiles.current[i] = el;
            }}
            className="absolute left-0 top-0 overflow-hidden bg-surface-2 will-change-transform"
            style={{ width: "100%", height: "100%", zIndex: i === 0 ? 2 : 1, opacity: i === 0 ? 1 : 0 }}
            aria-hidden={i > 0}
          >
            {!media ? null : hasLoop && i > 0 ? (
              <canvas
                ref={(el) => {
                  canvases.current[i] = el;
                }}
                className="h-full w-full"
              />
            ) : hasLoop ? (
              <video
                ref={video}
                className="h-full w-full object-cover"
                style={{ objectPosition: media.focus }}
                autoPlay={!reduced}
                muted
                loop
                playsInline
                preload="auto"
                poster={media.loop!.poster || media.image}
              >
                {media.loop!.webm && <source src={media.loop!.webm} type="video/webm" />}
                {media.loop!.mp4 && <source src={media.loop!.mp4} type="video/mp4" />}
              </video>
            ) : (
              <Image
                src={media.image}
                alt={i === 0 ? t.hero.frameAlt : ""}
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
              {labels[i]}
            </span>
          </div>
        ))}

        <div data-shade className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-t from-ground via-ground/40 to-ground/30" />

        <div ref={copy} className="absolute inset-x-0 bottom-0 z-[4] pb-[12svh]">
          <div className="wrap">
            <p className="eyebrow mb-5">
              <b>●</b>&nbsp; {t.powered}
            </p>
            <h1 className="display max-w-[14ch] text-[clamp(44px,8vw,112px)]">{t.hero.title}</h1>
            <p className="lede mt-6">{t.hero.intro}</p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href={`/${lang}/cases`}
                className="btn btn-accent"
                onClick={() => media && track("hero_clique", { variante: media.id, destino: "cases" })}
              >
                {t.hero.seeCases}
                <span aria-hidden>→</span>
              </Link>
              <Link
                href={`/${lang}/como-funciona`}
                className="btn btn-ghost"
                onClick={() => media && track("hero_clique", { variante: media.id, destino: "como-funciona" })}
              >
                {t.hero.how}
              </Link>
            </div>
            <GooglePartner label={t.googlePartner} className="mt-9" />
          </div>
        </div>

        <div ref={after} className="pointer-events-none absolute inset-x-0 top-[80px] z-[4] opacity-0">
          <div className="wrap">
            <p className="display text-[clamp(22px,3vw,36px)]">
              {t.hero.after[0]} <span className="text-text-3">{t.hero.after[1]}</span>
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
                {paused ? t.loop.play : t.loop.pause}
              </button>
            )}
            <span className="eyebrow hidden md:inline">{t.hero.scroll}</span>
          </div>
        )}
      </div>
    </section>
  );
}
