import type { ReactNode } from "react";
import Reveal from "./Reveal";

/** Cabeçalho de seção: rótulo numerado em mono, título e texto de apoio. */
export function SectionHead({ n, label, title, children, id }: { n?: string; label: string; title: ReactNode; children?: ReactNode; id?: string }) {
  return (
    <Reveal className="mb-12 md:mb-16">
      <p className="eyebrow">
        {n && <b>{n}</b>}
        {n && " · "}
        {label}
      </p>
      <h2 id={id} className="display mt-4 max-w-[20ch] text-[clamp(34px,5vw,64px)]">
        {title}
      </h2>
      {children && <div className="lede mt-5">{children}</div>}
    </Reveal>
  );
}
