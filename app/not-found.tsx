import Link from "next/link";
import "./globals.css";

// Fora de /pt e /en não dá para saber o idioma: a página fala os dois.
export default function NotFound() {
  return (
    <html lang="pt-BR">
      <body>
        <main className="wrap grid min-h-[100svh] content-center">
          <p className="eyebrow">
            <b>404</b> · be-front
          </p>
          <h1 className="display mt-4 text-[clamp(44px,7vw,96px)]">Essa página não existe.</h1>
          <p lang="en" className="display mt-3 text-[clamp(22px,3vw,36px)] text-text-3">
            This page doesn&apos;t exist.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/pt" className="btn btn-accent">
              Voltar ao início
            </Link>
            <Link href="/en" lang="en" className="btn btn-ghost">
              Back to home
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
