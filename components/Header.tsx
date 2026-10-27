"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { NAV } from "@/lib/i18n";

export default function Header({ lang }: { lang: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => pathname === `/${lang}${href}` || pathname.startsWith(`/${lang}${href}/`);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? "border-b border-line bg-ground/85 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 btn btn-accent">
        Pular para o conteúdo
      </a>
      <div className="wrap flex h-16 items-center justify-between gap-6 md:h-20">
        <Link href={`/${lang}`} aria-label="be-front, página inicial" className="shrink-0 text-text">
          <Logo className="h-[22px] w-auto md:h-[26px]" />
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-8 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={`/${lang}${n.href}`}
              aria-current={isActive(n.href) ? "page" : undefined}
              className={`relative text-[15px] transition-colors hover:text-text ${
                isActive(n.href) ? "text-text" : "text-text-2"
              }`}
            >
              {n.label}
              {isActive(n.href) && <span className="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent" />}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href={`/${lang}/contato`} className="btn btn-accent hidden h-11 sm:inline-flex">
            Enviar briefing
          </Link>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full border border-line-2 lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-3 w-4">
              <span className={`absolute left-0 h-px w-4 bg-text transition-transform ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 top-1.5 h-px w-4 bg-text transition-opacity ${open ? "opacity-0" : ""}`} />
              <span className={`absolute left-0 h-px w-4 bg-text transition-transform ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </div>

      <div id="menu-mobile" hidden={!open} className="h-[calc(100dvh-4rem)] border-t border-line bg-ground lg:hidden">
        <nav aria-label="Menu" className="wrap flex flex-col pt-6">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={`/${lang}${n.href}`}
              aria-current={isActive(n.href) ? "page" : undefined}
              className="display flex items-center justify-between border-b border-line py-5 text-[30px]"
            >
              {n.label}
              {isActive(n.href) && <span className="h-2 w-2 rounded-full bg-accent" />}
            </Link>
          ))}
          <Link href={`/${lang}/contato`} className="btn btn-accent mt-8 w-full justify-center">
            Enviar briefing
          </Link>
        </nav>
      </div>
    </header>
  );
}
