"use client";

type GaEvent = "filme_assistido_fim" | "case_aberto" | "formulario_enviado" | "clique_whatsapp";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(event: GaEvent, params: Record<string, string | number> = {}) {
  window.gtag?.("event", event, params);
}
