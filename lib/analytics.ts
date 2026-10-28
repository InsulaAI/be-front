"use client";

type GaEvent = "filme_assistido_fim" | "case_aberto" | "formulario_enviado" | "clique_whatsapp" | "hero_variante" | "hero_clique";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(event: GaEvent, params: Record<string, string | number> = {}) {
  window.gtag?.("event", event, params);
}

/** Marca o visitante com a versão do hero que ele viu, para comparar no GA4 retenção, engajamento e briefings por versão. */
export function setHeroVariant(id: string) {
  window.gtag?.("set", "user_properties", { hero_variante: id });
}
