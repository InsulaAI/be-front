import type { Cliente } from "@/lib/content";

/** Faixa monocromática: logos em silhueta na cor do texto secundário, em grade (5 por linha no desktop). */
export default function LogoStrip({ clientes }: { clientes: Cliente[] }) {
  return (
    <ul className="grid grid-cols-2 items-center justify-items-center gap-x-8 gap-y-10 sm:grid-cols-3 md:grid-cols-5 md:gap-y-12">
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
