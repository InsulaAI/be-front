// Rótulos usados no cliente e no servidor. Fica separado de content.ts, que lê o disco.
import type { Entrega, Tipo } from "./content";

export const TIPO_LABEL: Record<Tipo, string> = { ia: "IA", hibrido: "Híbrido", captacao: "Captação" };

export function entregaLabel(e: Entrega[]): string {
  if (e.includes("filme") && e.includes("desdobramento")) return "Filme e desdobramento";
  return e.includes("desdobramento") ? "Desdobramento" : "Filme";
}

export function ytThumb(id: string, q: "maxresdefault" | "hqdefault" = "maxresdefault") {
  return `https://i.ytimg.com/vi/${id}/${q}.jpg`;
}
