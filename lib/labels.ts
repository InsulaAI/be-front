// Rótulos usados no cliente e no servidor. Fica separado de content.ts, que lê o disco.
import type { Entrega, Tipo } from "./content";
import { getDict } from "./dict";

export function tipoLabel(t: Tipo, lang: string): string {
  return getDict(lang).labels.tipo[t];
}

export function entregaLabel(e: Entrega[], lang: string): string {
  const l = getDict(lang).labels.entrega;
  if (e.includes("filme") && e.includes("desdobramento")) return l.ambos;
  return e.includes("desdobramento") ? l.desdobramento : l.filme;
}

export function ytThumb(id: string, q: "maxresdefault" | "hqdefault" = "maxresdefault") {
  return `https://i.ytimg.com/vi/${id}/${q}.jpg`;
}
