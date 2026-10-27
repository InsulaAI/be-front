# be-front

Site da be-front, powered by Insula e Begen. Next.js 16 (App Router) + TypeScript + Tailwind 4.
A especificação e as decisões estão em `CLAUDE.md`.

## Rodar

```
npm install
npm run dev        # http://localhost:3000 → /pt
npm run build      # build de produção
npm run lint       # checagem de tipos
```

Variáveis em `.env.example`. Sem `RESEND_API_KEY`, o formulário funciona e só registra o briefing no log.
Sem `NEXT_PUBLIC_GA_ID`, nenhum script de métricas é carregado.

## Editar conteúdo

- **Case novo**: copiar um arquivo de `content/cases/` e trocar os campos. `ordem` define a posição; `destaque: true` coloca na home.
- **Filme sem case**: `content/filmes.json`.
- **Logo de cliente**: `content/clientes.json`, só cliente autorizado. SVG de uma cor, `fill` em `currentColor`.
- **Números da home**: `content/numeros.json`. Só número com fonte.
- **Contatos e links**: `content/site.json`. Campo vazio esconde o item.

## Deploy

Vercel: importar o repositório e configurar as variáveis de `.env.example`. `NEXT_PUBLIC_SITE_URL` precisa do domínio final para canonical, hreflang e sitemap.
