"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Frame } from "@/lib/content";
import { getDict } from "@/lib/dict";

/** Frames da solução: imagem ou loop curto sem som, com botão de pausa. */
export default function CaseMedia({ lang, frames }: { lang: string; frames: Frame[] }) {
  const t = getDict(lang);
  return (
    <div className="columns-1 gap-4 sm:columns-2">
      {frames.map((f, i) => {
        const item = typeof f === "string" ? { src: f } : f;
        return (
          <figure key={item.src} className="mb-4 break-inside-avoid">
            <div className="frame">
              {item.src.endsWith(".mp4") ? (
                <Loop src={item.src} webm={item.webm} poster={item.poster} label={item.legenda ?? `${t.casePage.makingOf} ${i + 1}`} play={t.loop.play} pause={t.loop.pause} />
              ) : (
                <Image
                  src={item.src}
                  alt={item.legenda ?? `${t.casePage.makingOf} ${i + 1}`}
                  width={1600}
                  height={900}
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="h-auto w-full"
                />
              )}
            </div>
            {item.legenda && <figcaption className="eyebrow mt-2.5">{item.legenda}</figcaption>}
          </figure>
        );
      })}
    </div>
  );
}

function Loop({ src, webm, poster, label, play, pause }: { src: string; webm?: string; poster?: string; label: string; play: string; pause: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(true);

  // Toca só quando aparece na tela e se o sistema não pede menos movimento.
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().then(() => setPaused(false)).catch(() => {});
      else {
        v.pause();
        setPaused(true);
      }
    });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  function toggle() {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play().then(() => setPaused(false)).catch(() => {});
    else {
      v.pause();
      setPaused(true);
    }
  }

  return (
    <>
      <video ref={ref} muted loop playsInline preload="none" poster={poster} aria-label={label} className="block h-auto w-full">
        {webm && <source src={webm} type="video/webm" />}
        <source src={src} type="video/mp4" />
      </video>
      <button
        type="button"
        onClick={toggle}
        aria-pressed={paused}
        className="eyebrow absolute bottom-3 right-3 rounded-full border border-line-2 bg-ground/70 px-3 py-1.5 !text-text-2 backdrop-blur hover:!text-text"
      >
        {paused ? play : pause}
      </button>
    </>
  );
}
