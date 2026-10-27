const STEPS = [
  { n: "01", t: "Filme-mestre", who: "Insula", d: "O conceito vira filme, com IA ou híbrido (captação real mais IA) e linguagem de cinema." },
  { n: "02", t: "Desdobramento", who: "Begen · AdMultify", d: "O key visual vira centenas de variações de formato e de mensagem." },
  { n: "03", t: "Entrega", who: "Todos os canais", d: "Cada peça sai no tamanho e no texto do canal onde vai rodar: TV, YouTube, social, display." },
];

/** Os três passos, ligados pela linha de acento: do filme aos formatos. */
export default function Method({ compact = false }: { compact?: boolean }) {
  return (
    <ol className="relative grid gap-10 md:grid-cols-3 md:gap-8">
      <span aria-hidden className="absolute left-[11px] top-3 bottom-3 w-px bg-gradient-to-b from-accent via-accent/60 to-accent/10 md:left-3 md:right-0 md:top-[11px] md:bottom-auto md:h-px md:w-auto md:bg-gradient-to-r" />
      {STEPS.map((s) => (
        <li key={s.n} className="relative pl-12 md:pl-0 md:pt-14">
          <span aria-hidden className="absolute left-0 top-0 grid h-6 w-6 place-items-center rounded-full border border-accent bg-ground">
            <span className="h-2 w-2 rounded-full bg-accent" />
          </span>
          <p className="eyebrow">
            <b>{s.n}</b> · {s.who}
          </p>
          <h3 className="display mt-3 text-[30px] md:text-[36px]">{s.t}</h3>
          {!compact && <p className="mt-3 max-w-[34ch] text-text-2">{s.d}</p>}
        </li>
      ))}
    </ol>
  );
}
