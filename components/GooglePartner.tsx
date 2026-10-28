import Image from "next/image";

// Selo oficial Google Partner, enviado pelo usuário em 28/10 (substituiu o wordmark do Google com a frase).
// Vai sem alteração, sobre o quadro branco em que o Google o apresenta: o texto cinza do selo some no fundo preto
// e recolorir o selo não é permitido. Fica sempre menor que o logo da be-front.
type Props = { className?: string; label: string };

export default function GooglePartner({ className = "", label }: Props) {
  return (
    <span className={`inline-flex rounded-[10px] bg-badge p-1 ${className}`}>
      <Image src="/media/google-partner.webp" alt={label} width={320} height={319} className="h-14 w-auto md:h-16" />
    </span>
  );
}
