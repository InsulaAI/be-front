import Image from "next/image";
import Link from "next/link";
import { caseImage, displayBrand, type Case } from "@/lib/content";
import { entregaLabel } from "@/lib/labels";

export default function CaseCard({ c, lang, large = false }: { c: Case; lang: string; large?: boolean }) {
  const r = c.resultados[0];
  const img = caseImage(c);
  return (
    <Link href={`/${lang}/cases/${c.slug}`} className="group block">
      <div className={`frame ${large ? "aspect-[16/10]" : "aspect-video"}`}>
        {img ? (
          <Image
            src={img}
            alt={c.youtubeId ? `Frame do filme ${c.confidencial ? displayBrand(c) : c.campanha}` : `${displayBrand(c)}: ${c.campanha}`}
            fill
            sizes={large ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-text-3">sem imagem</div>
        )}
        <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        {c.confidencial && <span className="tag tag-accent absolute left-4 top-4 bg-ground/70">Sob consulta</span>}
        {r && (
          <div className="absolute bottom-4 left-4 right-4 flex items-end gap-3">
            <span className="display text-[clamp(32px,4vw,52px)] leading-none text-accent">{r.valor}</span>
            <span className="max-w-[22ch] pb-1 text-sm leading-snug text-text">{r.rotulo}</span>
          </div>
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="display text-[22px] md:text-[26px]">{displayBrand(c)}</h3>
          <p className="mt-1 text-text-2">
            {c.confidencial ? c.resumo : c.campanha}
            {c.agencia && <span className="text-text-3"> · {c.agencia}</span>}
          </p>
        </div>
        <span
          aria-hidden
          className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line-2 transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-accent-ink"
        >
          →
        </span>
      </div>
      <p className="eyebrow mt-3">
        {[c.ano, c.setor, entregaLabel(c.entrega)].filter(Boolean).join(" · ")}
      </p>
    </Link>
  );
}
