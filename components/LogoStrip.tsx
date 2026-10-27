import type { Cliente } from "@/lib/content";

/** Faixa monocromática: logos em silhueta na cor do texto secundário. */
export default function LogoStrip({ clientes }: { clientes: Cliente[] }) {
  return (
    <ul className="flex flex-wrap items-center justify-center gap-x-14 gap-y-8 md:justify-between" aria-label="Clientes">
      {clientes.map((c) => (
        <li key={c.slug} className="flex h-12 items-center text-text-2">
          <svg
            viewBox={c.viewBox}
            role="img"
            aria-label={c.nome}
            className="block w-auto fill-current"
            style={{ height: c.altura * 1.15 }}
            dangerouslySetInnerHTML={{ __html: c.svg }}
          />
        </li>
      ))}
    </ul>
  );
}
