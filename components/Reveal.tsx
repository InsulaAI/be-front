"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

type Props = { as?: ElementType; className?: string; delay?: number; children: ReactNode };

/** Sobe e aparece quando entra na tela. Sem JS ou com menos movimento, já aparece pronto. */
export default function Reveal({ as: Tag = "div", className = "", delay = 0, children }: Props) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`reveal ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </Tag>
  );
}
