"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { ytThumb } from "@/lib/labels";

type Props = {
  id: string;
  title: string;
  /** Começa tocando (quando já veio de um clique, como no modal). */
  autoplay?: boolean;
  priority?: boolean;
  className?: string;
  caption?: string;
};

export function embedUrl(id: string, autoplay: boolean) {
  const p = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
    enablejsapi: "1",
    cc_load_policy: "1",
    autoplay: autoplay ? "1" : "0",
  });
  return `https://www.youtube-nocookie.com/embed/${id}?${p}`;
}

/**
 * Player em "facade": mostra a capa e um botão de play. O iframe do YouTube só entra no clique,
 * para não pesar a página nem chamar o YouTube antes da hora.
 */
export default function YouTube({ id, title, autoplay = false, priority = false, className = "", caption }: Props) {
  const [active, setActive] = useState(autoplay);
  const [thumb, setThumb] = useState(ytThumb(id));

  return (
    <figure className={className}>
      <div className="frame aspect-video">
        {active ? (
          <Player id={id} title={title} />
        ) : (
          <button
            type="button"
            onClick={() => setActive(true)}
            className="group absolute inset-0 h-full w-full cursor-pointer"
            aria-label={`Assistir: ${title}`}
          >
            <Image
              src={thumb}
              alt=""
              fill
              sizes="(min-width: 1240px) 1160px, 100vw"
              priority={priority}
              onError={() => setThumb(ytThumb(id, "hqdefault"))}
              className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <PlayBadge />
          </button>
        )}
      </div>
      {caption && <figcaption className="eyebrow mt-3">{caption}</figcaption>}
    </figure>
  );
}

export function PlayBadge({ small = false }: { small?: boolean }) {
  return (
    <span
      className={`absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-accent text-accent-ink shadow-[0_10px_40px_rgb(0_0_0/.45)] transition-transform duration-300 group-hover:scale-110 ${
        small ? "h-12 w-12" : "h-16 w-16 md:h-20 md:w-20"
      }`}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className={small ? "ml-0.5 h-4 w-4" : "ml-1 h-6 w-6"} fill="currentColor">
        <path d="M7 4.5v15l13-7.5z" />
      </svg>
    </span>
  );
}

/** O iframe em si, com escuta do fim do vídeo para o GA4. */
export function Player({ id, title }: { id: string; title: string }) {
  const ref = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    const frame = ref.current;
    if (!frame) return;
    let sent = false;
    const onLoad = () => frame.contentWindow?.postMessage(JSON.stringify({ event: "listening", id }), "*");
    const onMsg = (e: MessageEvent) => {
      if (e.source !== frame.contentWindow || typeof e.data !== "string") return;
      try {
        const d = JSON.parse(e.data);
        const state = d.event === "onStateChange" ? d.info : d.info?.playerState;
        if (state === 0 && !sent) {
          sent = true;
          track("filme_assistido_fim", { video_id: id, video_title: title });
        }
      } catch {
        /* mensagem de outro formato */
      }
    };
    frame.addEventListener("load", onLoad);
    window.addEventListener("message", onMsg);
    return () => {
      frame.removeEventListener("load", onLoad);
      window.removeEventListener("message", onMsg);
    };
  }, [id, title]);

  return (
    <iframe
      ref={ref}
      src={embedUrl(id, true)}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
      className="absolute inset-0 h-full w-full"
    />
  );
}
