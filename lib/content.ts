import fs from "node:fs";
import path from "node:path";
import clientesJson from "@/content/clientes.json";
import filmesJson from "@/content/filmes.json";
import numerosJson from "@/content/numeros.json";
import siteJson from "@/content/site.json";
import { getDict } from "./dict";
import type { Locale } from "./i18n";
import { ytThumb } from "./labels";

export type Entrega = "filme" | "desdobramento";
export type Tipo = "ia" | "hibrido" | "captacao";

/** Uma peça do desdobramento: loop curto (mp4, com webm opcional) e a capa, no formato e canal dela. */
export type Variacao = { src: string | null; webm?: string; poster?: string; formato: string; canal: string };
/** Imagem ou loop curto (mp4, com webm e poster opcionais) da solução ou do making of. */
export type Frame = string | { src: string; webm?: string; poster?: string; legenda?: string };
export type Resultado = { valor: string; rotulo: string; fonte: string; periodo: string };

export type Case = {
  slug: string;
  ordem: number;
  rascunho?: boolean;
  origem: "insula" | "begen" | "be-front";
  marca: string;
  produto: string | null;
  campanha: string;
  agencia: string | null;
  ano: number | null;
  setor: string;
  tipo: Tipo | null;
  entrega: Entrega[];
  youtubeId: string | null;
  /** Imagem do case quando não há filme no YouTube (ex.: cases de desdobramento da Begen). */
  capa?: string | null;
  destaque: boolean;
  confidencial: boolean;
  privado: boolean;
  semAudio?: boolean;
  resumo: string;
  desafio: string | null;
  solucao: string | null;
  frames: Frame[];
  variacoes: Variacao[];
  /** Observação sobre o mosaico, quando ele mostra só parte do desdobramento. */
  escalaNota?: string | null;
  resultados: Resultado[];
  creditos: { insula: string[]; begen: string[]; agencia: string[]; cliente: string[] };
};

export type Filme = {
  youtubeId: string;
  titulo: string;
  categoria: "publicidade" | "autoral";
  origem: Case["origem"];
  ano: number | null;
  setor: string | null;
  tipo: Tipo | null;
  entrega: Entrega[];
  descricao: string;
  privado: boolean;
  caseSlug?: string;
  semAudio?: boolean;
};

const CASES_DIR = path.join(process.cwd(), "content", "cases");
const isDev = process.env.NODE_ENV !== "production";

/**
 * Versão do conteúdo no idioma pedido. Qualquer objeto do content/ pode ter um campo "en" com os
 * textos em inglês (no case, num resultado, numa legenda); em /en eles substituem os em português.
 * Campo que não tem versão em inglês fica em português.
 */
export function localize<T>(value: T, lang: Locale): T {
  if (Array.isArray(value)) return value.map((v) => localize(v, lang)) as T;
  if (value && typeof value === "object") {
    const { en, ...rest } = value as Record<string, unknown>;
    const merged: Record<string, unknown> = lang === "en" && en && typeof en === "object" ? { ...rest, ...(en as object) } : rest;
    return Object.fromEntries(Object.entries(merged).map(([k, v]) => [k, localize(v, lang)])) as T;
  }
  return value;
}

/** Todos os cases, inclusive os privados (acessíveis só por link). Rascunhos só em desenvolvimento. */
export function allCases(lang: Locale = "pt"): Case[] {
  return fs
    .readdirSync(CASES_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => localize(JSON.parse(fs.readFileSync(path.join(CASES_DIR, f), "utf8")) as Case, lang))
    .filter((c) => isDev || !c.rascunho)
    .sort((a, b) => a.ordem - b.ordem);
}

/** Cases que aparecem em listas e destaques. */
export function listedCases(lang: Locale = "pt"): Case[] {
  return allCases(lang).filter((c) => !c.privado);
}

export function getCase(slug: string, lang: Locale = "pt"): Case | undefined {
  return allCases(lang).find((c) => c.slug === slug);
}

/** O case seguinte na lista pública, voltando ao primeiro no fim. */
export function nextCase(slug: string, lang: Locale = "pt"): Case | undefined {
  const list = listedCases(lang);
  if (list.length < 2) return undefined;
  const i = list.findIndex((c) => c.slug === slug);
  return list[(i + 1) % list.length];
}

/** Nome que pode ser mostrado: case confidencial mostra o setor, nunca a marca. */
export function displayBrand(c: Case): string {
  if (c.confidencial) return c.setor.charAt(0).toUpperCase() + c.setor.slice(1);
  return c.produto ? `${c.produto} · ${c.marca}` : c.marca;
}

/** Imagem que representa o case: a capa do filme no YouTube ou, sem filme, a capa própria. */
export function caseImage(c: Case): string | null {
  return c.youtubeId ? ytThumb(c.youtubeId) : (c.capa ?? null);
}

/** Galeria: filmes dos cases (com selo "com case") mais os filmes sem case. */
export function allFilms(lang: Locale = "pt"): Filme[] {
  const fromCases: Filme[] = listedCases(lang)
    .filter((c) => c.youtubeId)
    .map((c) => ({
      youtubeId: c.youtubeId!,
      titulo: c.confidencial ? `${displayBrand(c)} · ${getDict(lang).gallery.underRequest}` : c.campanha,
      categoria: "publicidade",
      origem: c.origem,
      ano: c.ano,
      setor: c.setor,
      tipo: c.tipo,
      entrega: c.entrega,
      descricao: c.resumo,
      privado: c.privado,
      caseSlug: c.slug,
      semAudio: c.semAudio,
    }));
  const avulsos = localize(filmesJson.filmes as Filme[], lang).filter((f) => !f.privado);
  return [...fromCases, ...avulsos];
}

export type Cliente = { slug: string; nome: string; viewBox: string; altura: number; svg: string };
export const clientes = clientesJson.clientes as Cliente[];

export type Numero = { valor: string; rotulo: string; fonte: string };
export function numeros(lang: Locale = "pt"): Numero[] {
  return localize(numerosJson.numeros as Numero[], lang);
}

export type Empresa = { nome: string; site: string; parte: string; texto: string };
type Site = {
  heroCase: string;
  /** Frame próprio para o hero e o key visual (ex.: /media/hero/kfc.webp). Vazio: usa a capa do YouTube do heroCase. */
  heroImagem: string;
  /** object-position do frame nos recortes (hero e key visual), para o rosto não sair do quadro */
  heroFoco: string;
  heroLoop: { mp4: string; webm: string; poster: string };
  keyVisualCase: string;
  email: string;
  whatsapp: string;
  agenda: string;
  redes: { nome: string; url: string }[];
  empresas: { insula: Empresa; begen: Empresa };
};
export const site = siteJson as Site;

/** As duas empresas, com os textos no idioma da página. */
export function empresas(lang: Locale = "pt"): Site["empresas"] {
  return localize(site.empresas, lang);
}

export function whatsappUrl(lang: Locale = "pt"): string | null {
  const n = site.whatsapp.replace(/\D/g, "");
  return n ? `https://wa.me/${n}?text=${encodeURIComponent(getDict(lang).whatsappText)}` : null;
}
