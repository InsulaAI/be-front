import Link from "next/link";
import "./globals.css";

export default function NotFound() {
  return (
    <html lang="pt-BR">
      <body>
        <main className="wrap grid min-h-[100svh] content-center">
          <p className="eyebrow">
            <b>404</b> · be-front
          </p>
          <h1 className="display mt-4 text-[clamp(44px,7vw,96px)]">Essa página não existe.</h1>
          <Link href="/pt" className="btn btn-accent mt-10 self-start justify-self-start">
            Voltar ao início
          </Link>
        </main>
      </body>
    </html>
  );
}
