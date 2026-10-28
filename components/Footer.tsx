import Link from "next/link";
import { site, whatsappUrl } from "@/lib/content";
import { getDict } from "@/lib/dict";
import { NAV, type Locale } from "@/lib/i18n";
import LangSwitchHere from "./LangSwitchHere";
import GooglePartner from "./GooglePartner";
import Logo from "./Logo";
import { WhatsAppLink } from "./Track";

export default function Footer({ lang }: { lang: Locale }) {
  const t = getDict(lang);
  const wa = whatsappUrl(lang);
  return (
    <footer className="mt-32 border-t border-line">
      <div className="wrap grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:py-20">
        <div>
          <Logo className="h-7 w-auto text-text" />
          <p className="mt-5 max-w-[34ch] text-text-2">{t.footer.tagline}</p>
          <GooglePartner label={t.googlePartner} className="mt-8" />
        </div>

        <nav aria-label={t.footer.nav} className="grid content-start gap-3">
          <p className="eyebrow mb-1">{t.footer.site}</p>
          {NAV.map((n) => (
            <Link key={n.href} href={`/${lang}${n.href}`} className="text-text-2 hover:text-text">
              {t.nav[n.key]}
            </Link>
          ))}
          <Link href={`/${lang}/contato`} className="text-text-2 hover:text-text">
            {t.nav.contato}
          </Link>
        </nav>

        <div className="grid content-start gap-3">
          <p className="eyebrow mb-1">{t.footer.contact}</p>
          {site.email && (
            <a href={`mailto:${site.email}`} className="text-text-2 hover:text-text">
              {site.email}
            </a>
          )}
          {wa && (
            <WhatsAppLink href={wa} className="text-text-2 hover:text-text">
              {t.footer.whatsapp}
            </WhatsAppLink>
          )}
          {site.redes.map((r) => (
            <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer" className="text-text-2 hover:text-text">
              {r.nome}
            </a>
          ))}
          <Link href={`/${lang}/contato`} className="text-text hover:text-accent">
            {t.footer.sendBriefing}
          </Link>
        </div>
      </div>

      <div className="wrap">
        <div className="flex flex-col gap-4 border-t border-line py-6 text-sm text-text-3 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {t.powered}</p>
          <div className="flex items-center gap-6">
            <Link href={`/${lang}/privacidade`} className="hover:text-text">
              {t.footer.privacy}
            </Link>
            <LangSwitchHere lang={lang} />
          </div>
        </div>
      </div>
    </footer>
  );
}
