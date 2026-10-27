import Link from "next/link";
import { site, whatsappUrl } from "@/lib/content";
import { NAV, PLANNED_LOCALES } from "@/lib/i18n";
import Logo from "./Logo";
import { WhatsAppLink } from "./Track";

export default function Footer({ lang }: { lang: string }) {
  const wa = whatsappUrl();
  return (
    <footer className="mt-32 border-t border-line">
      <div className="wrap grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:py-20">
        <div>
          <Logo className="h-7 w-auto text-text" />
          <p className="mt-5 max-w-[34ch] text-text-2">be-front, powered by Insula e Begen. Do filme-mestre a todos os formatos, em um fluxo só.</p>
        </div>

        <nav aria-label="Rodapé" className="grid content-start gap-3">
          <p className="eyebrow mb-1">Site</p>
          {NAV.map((n) => (
            <Link key={n.href} href={`/${lang}${n.href}`} className="text-text-2 hover:text-text">
              {n.label}
            </Link>
          ))}
          <Link href={`/${lang}/contato`} className="text-text-2 hover:text-text">
            Contato
          </Link>
        </nav>

        <div className="grid content-start gap-3">
          <p className="eyebrow mb-1">Contato</p>
          {site.email && (
            <a href={`mailto:${site.email}`} className="text-text-2 hover:text-text">
              {site.email}
            </a>
          )}
          {wa && (
            <WhatsAppLink href={wa} className="text-text-2 hover:text-text">
              WhatsApp
            </WhatsAppLink>
          )}
          {site.redes.map((r) => (
            <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer" className="text-text-2 hover:text-text">
              {r.nome}
            </a>
          ))}
          <Link href={`/${lang}/contato`} className="text-text hover:text-accent">
            Enviar briefing →
          </Link>
        </div>
      </div>

      <div className="wrap">
        <div className="flex flex-col gap-4 border-t border-line py-6 text-sm text-text-3 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} be-front, powered by Insula e Begen</p>
        <div className="flex items-center gap-6">
          <Link href={`/${lang}/privacidade`} className="hover:text-text">
            Privacidade
          </Link>
          <div className="flex items-center gap-1 font-mono text-xs" aria-label="Idioma">
            {PLANNED_LOCALES.map((l) =>
              l === lang ? (
                <span key={l} aria-current="true" className="rounded-full border border-line-2 px-2.5 py-1 uppercase text-text">
                  {l}
                </span>
              ) : (
                <span key={l} className="px-2.5 py-1 uppercase" title="Versão em inglês em preparação">
                  {l}
                </span>
              ),
            )}
          </div>
        </div>
        </div>
      </div>
    </footer>
  );
}
