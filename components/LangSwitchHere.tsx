"use client";

import { usePathname } from "next/navigation";
import { LangSwitch } from "./Header";

/** Seletor de idioma para componentes do servidor (rodapé), que não sabem o caminho atual. */
export default function LangSwitchHere({ lang }: { lang: string }) {
  return <LangSwitch lang={lang} pathname={usePathname()} />;
}
