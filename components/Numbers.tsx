import type { Numero } from "@/lib/content";

export default function Numbers({ items, sourceLabel }: { items: Numero[]; sourceLabel: string }) {
  if (!items.length) return null;
  return (
    <dl className="grid gap-px overflow-hidden rounded-[var(--radius)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(0,1fr))]">
      {items.map((n) => (
        <div key={n.valor + n.rotulo} className="flex flex-col gap-5 bg-ground p-7 md:p-9">
          <dt className="order-2 text-text-2">
            {n.rotulo}
            <span className="eyebrow mt-3 block !normal-case !tracking-normal">{sourceLabel}: {n.fonte}</span>
          </dt>
          <dd className="display order-1 text-[clamp(48px,6vw,80px)] leading-none text-accent">{n.valor}</dd>
        </div>
      ))}
    </dl>
  );
}
