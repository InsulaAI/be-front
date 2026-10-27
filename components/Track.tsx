"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/** Dispara um evento do GA4 quando a página abre. */
export function TrackView({ event, params }: { event: "case_aberto"; params: Record<string, string> }) {
  useEffect(() => {
    track(event, params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

export function WhatsAppLink({ href, className = "", children }: { href: string; className?: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} onClick={() => track("clique_whatsapp")}>
      {children}
    </a>
  );
}
