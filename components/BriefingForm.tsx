"use client";

import { useState, type FormEvent } from "react";
import { track } from "@/lib/analytics";
import { getDict } from "@/lib/dict";

type State = "idle" | "sending" | "ok" | "error";

export default function BriefingForm({ lang, full = false }: { lang: string; full?: boolean }) {
  const t = getDict(lang).form;
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");
  const [startedAt] = useState(() => Date.now());

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/briefing", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...data, lang, elapsed: Date.now() - startedAt }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || t.errGeneric);
      setState("ok");
      track("formulario_enviado", { origem: full ? "contato" : "home" });
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : t.errGeneric);
    }
  }

  if (state === "ok") {
    return (
      <div role="status" className="rounded-[var(--radius)] border border-accent/50 bg-surface p-8">
        <p className="display text-[28px]">{t.okTitle}</p>
        <p className="mt-2 text-text-2">{t.okText}</p>
      </div>
    );
  }

  const field =
    "w-full rounded-[10px] border border-line-2 bg-surface px-4 py-3.5 text-text placeholder:text-text-3 outline-none transition-colors focus:border-accent";

  return (
    <form onSubmit={onSubmit} className="relative grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t.name} name="nome" autoComplete="name" required className={field} />
        <Field label={t.company} name="empresa" autoComplete="organization" required className={field} />
      </div>
      <Field label={t.email} name="email" type="email" autoComplete="email" required className={field} />
      {full && (
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2">
            <span className="eyebrow">{t.youAre}</span>
            <select name="perfil" className={field} defaultValue="">
              <option value="" disabled>
                {t.choose}
              </option>
              {t.roles.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-2">
            <span className="eyebrow">{t.need}</span>
            <select name="entrega" className={field} defaultValue="">
              <option value="" disabled>
                {t.choose}
              </option>
              {t.needs.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </label>
        </div>
      )}
      <label className="grid gap-2">
        <span className="eyebrow">{t.message}</span>
        <textarea name="mensagem" rows={full ? 6 : 4} required className={field} placeholder={t.placeholder} />
      </label>
      {/* Armadilha para robôs: invisível para pessoas, campo que só robô preenche. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          {t.honeypot}
          <input name="site" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-4">
        <button type="submit" className="btn btn-accent" disabled={state === "sending"}>
          {state === "sending" ? t.sending : t.send}
        </button>
        {state === "error" && (
          <p role="alert" className="text-sm text-accent">
            {error}
          </p>
        )}
      </div>
    </form>
  );
}

function Field({ label, className, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="grid gap-2">
      <span className="eyebrow">{label}</span>
      <input {...rest} className={className} />
    </label>
  );
}
