import { NextResponse } from "next/server";

// Envio do briefing por e-mail (Resend). Anti-spam: campo-armadilha, tempo mínimo de preenchimento
// e limite simples por IP. Sem RESEND_API_KEY, o briefing só vai para o log (útil em desenvolvimento).

const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(ip)) return NextResponse.json({ error: "Muitos envios seguidos. Tente de novo em alguns minutos." }, { status: 429 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Envio inválido." }, { status: 400 });

  // Robô: preencheu o campo invisível ou enviou rápido demais. Responde OK e descarta.
  if (clean(body.site, 200) || Number(body.elapsed) < 2500) return NextResponse.json({ ok: true });

  const data = {
    nome: clean(body.nome, 120),
    empresa: clean(body.empresa, 160),
    email: clean(body.email, 200),
    perfil: clean(body.perfil, 40),
    entrega: clean(body.entrega, 60),
    mensagem: clean(body.mensagem, 5000),
  };
  if (!data.nome || !data.empresa || !data.mensagem || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return NextResponse.json({ error: "Preencha nome, empresa, um e-mail válido e a mensagem." }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.BRIEFING_TO;
  if (!key || !to) {
    console.info("[briefing] sem RESEND_API_KEY/BRIEFING_TO, só registrado:", data);
    return NextResponse.json({ ok: true });
  }

  const rows = Object.entries(data)
    .filter(([, v]) => v)
    .map(([k, v]) => `<p><b>${k}</b><br>${esc(v).replace(/\n/g, "<br>")}</p>`)
    .join("");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.BRIEFING_FROM || "be-front <onboarding@resend.dev>",
      to: to.split(",").map((s) => s.trim()),
      reply_to: data.email,
      subject: `Briefing: ${data.empresa} (${data.nome})`,
      html: rows,
    }),
  });
  if (!res.ok) {
    console.error("[briefing] Resend respondeu", res.status, await res.text());
    return NextResponse.json({ error: "Não foi possível enviar agora. Tente o WhatsApp ou de novo em instantes." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
