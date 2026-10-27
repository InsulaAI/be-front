import fs from "node:fs";
import path from "node:path";
import clientesJson from "@/content/clientes.json";
import filmesJson from "@/content/filmes.json";
import numerosJson from "@/content/numeros.json";
import siteJson from "@/content/site.json";

export type Entrega = "filme" | "desdobramento";
export type Tipo = "ia" | "hibrido" | "captacao";

export type Variacao = { src: string | null; poster?: string; formato: string; canal: string };
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
  destaque: boolean;
  confidencial: boolean;
  privado: boolean;
  semAudio?: boolean;
  resumo: string;
  desafio: string | null;
  solucao: string | null;
  frames: string[];
  variacoes: Variacao[];
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

/** Todos os cases, inclusive os privados (acessíveis só por link). Rascunhos só em desenvolvimento. */
export function allCases(): Case[] {
  return fs
    .readdirSync(CASES_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(CASES_DIR, f), "utf8")) as Case)
    .filter((c) => isDev || !c.rascunho)
    .sort((a, b) => a.ordem - b.ordem);
}

/** Cases que aparecem em listas e destaques. */
export function listedCases(): Case[] {
  return allCases().filter((c) => !c.privado);
}

export function getCase(slug: string): Case | undefined {
  return allCases().find((c) => c.slug === slug);
}

/** O case seguinte na lista pública, voltando ao primeiro no fim. */
export function nextCase(slug: string): Case | undefined {
  const list = listedCases();
  if (list.length < 2) return undefined;
  const i = list.findIndex((c) => c.slug === slug);
  return list[(i + 1) % list.length];
}

/** Nome que pode ser mostrado: case confidencial mostra o setor, nunca a marca. */
export function displayBrand(c: Case): string {
  if (c.confidencial) return c.setor.charAt(0).toUpperCase() + c.setor.slice(1);
  return c.produto ? `${c.produto} · ${c.marca}` : c.marca;
}

/** Galeria: filmes dos cases (com selo "com case") mais os filmes sem case. */
export function allFilms(): Filme[] {
  const fromCases: Filme[] = listedCases()
    .filter((c) => c.youtubeId)
    .map((c) => ({
      youtubeId: c.youtubeId!,
      titulo: c.confidencial ? `${displayBrand(c)} · sob consulta` : c.campanha,
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
  const avulsos = (filmesJson.filmes as Filme[]).filter((f) => !f.privado);
  return [...fromCases, ...avulsos];
}

export type Cliente = { slug: string; nome: string; viewBox: string; altura: number; svg: string };
export const clientes = clientesJson.clientes as Cliente[];

export type Numero = { valor: string; rotulo: string; fonte: string };
export const numeros = numerosJson.numeros as Numero[];

export type Empresa = { nome: string; site: string; parte: string; texto: string };
export const site = siteJson as {
  heroCase: string;
  heroLoop: { mp4: string; webm: string; poster: string };
  keyVisualCase: string;
  email: string;
  whatsapp: string;
  agenda: string;
  redes: { nome: string; url: string }[];
  empresas: { insula: Empresa; begen: Empresa };
};

export function whatsappUrl(text = "Olá! Quero conversar sobre um briefing com a be-front."): string | null {
  const n = site.whatsapp.replace(/\D/g, "");
  return n ? `https://wa.me/${n}?text=${encodeURIComponent(text)}` : null;
}
