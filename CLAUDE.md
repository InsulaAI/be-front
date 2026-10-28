# Website be-front — especificação para o Claude Code

Este arquivo é a fonte de verdade do projeto. Leia-o inteiro antes de qualquer tarefa.

## O que é

Site da **be-front, powered by Insula e Begen**: operação conjunta de criação e distribuição de conteúdo publicitário com IA.

- **Insula**: produz o filme-mestre com IA e híbridos (captação real + IA), com linguagem cinematográfica.
- **Begen (AdMultify)**: transforma o key visual em centenas de variações de formato e mensagem.
- **Promessa central**: do conceito cinematográfico à entrega em todos os formatos, em um fluxo só.

O site mostra os **filmes** (Insula) e os **cases** de desdobramento (Begen) como resultado de um único método. Ele não é um portfólio de duas empresas lado a lado.

Objetivo de negócio: gerar briefings. Os públicos são o Google (programa AI 3P Creative Tech Partner), agências, marcas, imprensa e festivais.

## Regras de marca (obrigatórias em todo texto)

- Escreva sempre `be-front`, em minúsculas e com hífen. Nunca "Be Front", "BeFront" ou "be front".
- Na primeira menção de cada página, use "be-front, powered by Insula e Begen". Depois, use só "be-front".
- Ao citar as duas empresas, mantenha a ordem: Insula e Begen.

## Stack recomendada

- **Next.js** (App Router) + **TypeScript** + **Tailwind CSS**.
- Conteúdo dos cases em arquivos MDX ou JSON dentro de `/content/cases`, um por case, para que um case novo seja só um arquivo novo.
- Se o time preferir editar sem código, trocar depois por um CMS headless (Sanity). Não faça isso sem pedir.
- Idiomas: PT (padrão) e EN, com rotas `/pt` e `/en`.
- Deploy previsto: Vercel.

## Mapa do site

```
/            Home
/filmes      Galeria de filmes (Publicidade | Autoral)
/cases       Lista de cases
/cases/[slug] Página de case (modelo único)
/como-funciona  Filme-mestre → desdobramento → entrega
/insula-e-begen Quem faz cada parte + links para os sites
/contato     Formulário de briefing + WhatsApp + agenda
```

O rodapé aparece em todas as páginas, com: "be-front, powered by Insula e Begen", contato, redes sociais, seletor PT/EN e política de privacidade.

## Home (nesta ordem)

1. **Hero**: loop de vídeo sem som de um filme-mestre. Ao rolar, o quadro se divide em formatos (16:9, 9:16, 1:1, banners). Leva um título curto e um botão "Ver cases".
2. **Método em 3 passos**: Filme-mestre (Insula) → Desdobramento (Begen/AdMultify) → Entrega em todos os canais.
3. **Cases em destaque**: 3 a 4 cards grandes, cada um com frame, marca, agência e um número de resultado.
4. **Bloco interativo do key visual**: um controle deslizante faz um key visual se multiplicar em dezenas de peças.
5. **Faixa de logos**: só clientes autorizados (ver `content/clientes.json`).
6. **Números da operação**: 3 a 4 indicadores. Use apenas valores presentes em `content/numeros.json`. Nunca invente números.
7. **Insula e Begen**: um parágrafo para cada empresa, com link para o site de cada uma.
8. **Chamada final**: formulário curto (nome, empresa, e-mail, mensagem) e link de WhatsApp.

## Página de case (modelo único)

| Bloco | Conteúdo |
| --- | --- |
| Cabeçalho | Marca, campanha, agência, ano, tags (setor, tipo de entrega) |
| Filme-mestre | Player grande (YouTube, ver abaixo) |
| O desafio | 2 a 3 frases |
| A solução | Técnica (IA, híbrido, captação), mais 2 a 4 frames de making of |
| A escala | Mosaico das variações da Begen, filtrável por formato e canal |
| Resultados | 3 cards de número, cada um com fonte e período |
| Créditos | Equipe Insula, equipe Begen, agência e cliente |
| Próximo case | Card com link |

Um case marcado `confidencial: true` mostra o setor, mas não a marca, e exibe o selo "sob consulta".

## Filmes da Insula: integração com o YouTube (obrigatório)

Os filmes da Insula vêm do **canal da Insula no YouTube**. Não suba arquivos de filme para o repositório.

- Cada filme é referenciado pelo **ID do vídeo do YouTube** no conteúdo (campo `youtubeId`).
- Use o domínio de privacidade `youtube-nocookie.com`.
- **Carregue o player só no clique** (padrão "facade", por exemplo com `lite-youtube-embed` ou um componente próprio). A página mostra a capa (`https://i.ytimg.com/vi/<id>/maxresdefault.jpg`, com fallback para `hqdefault.jpg`) e um botão de play. O iframe do YouTube só entra quando a pessoa clica.
- Parâmetros do embed: `rel=0`, `modestbranding=1`, `playsinline=1`. Os vídeos sugeridos ficam restritos ao próprio canal.
- Filmes ainda não liberados pelo cliente ficam como **não listados** no YouTube e aparecem só em páginas acessadas por link privado.
- **Galeria** (`/filmes`): grade de miniaturas com filtros por tipo (IA, híbrido), setor, entrega (filme, desdobramento, ambos) e ano. Cada miniatura mostra um selo "com case" quando houver página de case. O player abre em modal de tela cheia, com som, legendas e um botão para copiar o link.
- **Fase 2 (opcional, só quando pedido)**: puxar a lista automaticamente das playlists do canal (Publicidade, Autoral) pela YouTube Data API v3. A chave de API fica em `YOUTUBE_API_KEY`, apenas no servidor, com cache (ISR) para não estourar a cota.

**Fora do YouTube**: os loops sem som da home e das miniaturas, e os desdobramentos da Begen. Esses são arquivos curtos próprios, em `/public/media` ou num CDN, com no máximo 10 s, nos formatos MP4 (H.264) e WebM, cada um com imagem de capa (`poster`).

## Direção visual

- **Fundo preto** (o preto do logo, `#000`), com muito espaço vazio. Os filmes dão a cor da página.
  Decisão de 27/10: fundo preto e linguagem próxima do site da Insula, no lugar da base cinza prevista.
- **Um único acento: o laranja do ponto do logo, `#FA4D23`** (6,1:1 sobre o preto, AA). Usado com economia: botões, números de resultado e a linha que liga "filme" a "formatos".
- **Títulos em Mulish 800** (geométrica, próxima do desenho do logo). Corpo em Archivo. Rótulos em JetBrains Mono, caixa-alta, com ponto-médio ("01 · Método"), como no material da Insula. Fontes servidas pelo próprio site (`@fontsource-variable`), sem Google Fonts.
- **Menos "tech", mais emoção**: nada de circuitos, neon ou clichês de IA. Prefira frames de filme, rostos, luz e textura.
- **Movimento com propósito**: a animação principal é sempre o filme se desdobrando em formatos.
- As cores são tokens CSS em `app/globals.css` (`:root`), expostos ao Tailwind por `@theme`. Não escrever cor crua nos componentes. O site é escuro só; não há modo claro.

## Tom de voz

- Direto, confiante e curto. Frases de no máximo duas linhas.
- Fale do resultado do cliente, não da ferramenta. Exemplo: "300 peças em 10 dias", e não "IA generativa de ponta".
- A versão em inglês tem o mesmo tom; não é tradução literal.

## Requisitos técnicos

- **Performance**: LCP abaixo de 2,5 s no celular. Imagens em AVIF/WebP via `next/image`. Vídeos com lazy load.
- **SEO**: `title` e `description` próprios em cada página e case, no formato "Marca — Campanha | be-front". Dados estruturados `VideoObject` em cada filme e `hreflang` para PT/EN.
- **Acessibilidade**: legendas, `alt` em todas as imagens, botão para pausar os loops e respeito a `prefers-reduced-motion`. Contraste AA, inclusive no acento.
- **Métricas**: GA4 com os eventos `filme_assistido_fim`, `case_aberto`, `formulario_enviado` e `clique_whatsapp`.
- **Formulário**: envio por API route para o e-mail de contato (Resend ou similar), com proteção anti-spam.

## Modelo de conteúdo de um case (exemplo)

```json
{
  "slug": "marca-campanha",
  "marca": "Marca",
  "campanha": "Nome da campanha",
  "agencia": "Agência",
  "ano": 2026,
  "setor": "alimentos",
  "tipo": "hibrido",
  "entrega": ["filme", "desdobramento"],
  "youtubeId": "XXXXXXXXXXX",
  "confidencial": false,
  "desafio": "…",
  "solucao": "…",
  "frames": ["/media/cases/marca/frame-01.jpg"],
  "variacoes": [{ "src": "/media/cases/marca/var-01.mp4", "formato": "9:16", "canal": "Reels" }],
  "resultados": [{ "valor": "320", "rotulo": "peças entregues", "fonte": "Begen", "periodo": "10 dias" }],
  "creditos": { "insula": ["…"], "begen": ["…"], "agencia": ["…"] }
}
```

Os dados de exemplo devem ser claramente fictícios (marca "Marca Exemplo"). Nunca use nomes reais de clientes que não estejam em `content/clientes.json`.

## Como o projeto está montado

```
app/[lang]/            páginas, em /pt e /en (mesmos caminhos nos dois idiomas)
app/api/briefing/      envio do formulário (Resend), com anti-spam
components/            HeroSplit (quadro que se divide), KeyVisual (controle deslizante),
                       YouTube (facade), FilmGallery (galeria + modal), ScaleMosaic etc.
content/cases/*.json   um arquivo por case. Case novo = arquivo novo
content/filmes.json    filmes sem página de case (ex.: autoral)
content/clientes.json  logos autorizados, SVG em currentColor
content/numeros.json   números da home, sempre com fonte
content/site.json      contatos, links das empresas, case do hero e do key visual
lib/content.ts         leitura do conteúdo (servidor). lib/labels.ts serve aos dois lados
lib/dict.ts            todos os textos da interface, em PT e EN
```

Campos além do modelo acima: `origem` (insula, begen, be-front), `produto`, `destaque` (entra na
home), `privado` (fora das listas e do sitemap, só por link direto, com `noindex`), `rascunho`
(só aparece em `npm run dev`), `semAudio` (selo na galeria) e `resumo`. Campo sem dado fica
`null` ou lista vazia, e o bloco correspondente some da página. Não preencher com texto genérico.

## Decisões tomadas

- **27/10**: repositório próprio, `InsulaAI/be-front`, separado do InfoMemo (`InsulaAI/projetoframe`), que é confidencial.
- **27/10**: Next.js 16 + Tailwind 4, como recomendado acima.
- **27/10**: site em PT e EN. Textos da interface em `lib/dict.ts` (o inglês segue o mesmo tom, sem tradução literal). No conteúdo, qualquer objeto pode ter um campo `"en"` com os textos em inglês (no case, num resultado, numa legenda); em /en eles substituem os em português, e o que não tiver `"en"` aparece em português. Seletor PT | EN no cabeçalho e no rodapé, que leva à mesma página no outro idioma. A raiz (`/`) abre em /pt para navegador em português e em /en para os demais. Termos: filme-mestre = master film, desdobramento = rollout, entrega = delivery, peças = assets.
- **27/10**: os clientes que podem aparecer com nome são os do InfoMemo da Insula: Unilever (Brilhante, Clear Men, CIF), KFC, JBS (pela Maturatta) e Natura. Os seis cases da Insula vêm de lá, com os mesmos IDs do YouTube e só os fatos que estão lá. O filme e o logo da Natura saíram do site em 27/10, a pedido; o logo voltou em 28/10 (ver abaixo).
- **27/10**: no ar na Vercel em https://be-front-ten.vercel.app/pt, ligado ao `main` deste repositório: cada push publica sozinho.
- **28/10**: o hero virou teste A/B, a partir do retorno do Daniel (Begen, sponsor): testar retenção e engajamento com outros temas e moods, e algo animado. `heroVariantes` em `site.json` lista as versões, sorteadas por visitante com peso relativo e fixas para ele (localStorage `bf-hero`). Para ver uma versão: `/pt?hero=<id>`. O GA4 recebe o evento `hero_variante` e a propriedade de usuário `hero_variante`, além de `hero_clique` nos dois botões do hero; o teste só mede depois de `NEXT_PUBLIC_GA_ID` configurado. Versões: `coronel` (o filme do KFC inteiro em loop, ver abaixo), `maturatta` (loop de 4,6 s em câmera lenta, tirado dos 2,6 s iniciais do vídeo vertical de 15 s da Begen, sem texto; `public/media/hero/maturatta-loop.*`) e `clear` (Vini Jr. de perfil, quadro automático `maxres1` do YouTube, sem o texto "MENTALIZA" da capa). O key visual continua com o Coronel chorando, `17_CORONEL_06.png` do Drive (`keyVisualImagem`).
- **28/10**: exceção à regra dos loops de até 10 s, a pedido do usuário: na versão `coronel` do hero roda o filme do KFC inteiro, sem som, em loop, e ao rolar ele se divide nos formatos. São os 25,2 s da história; a cartela de preço ("Terça do Balde", R$ 19,90) e a de marca, do fim, ficaram fora, porque são oferta datada e brigam com o título. Fonte: `kfc-digital.mp4` do Drive (1080p, 30 s). Arquivos: `public/media/hero/kfc-filme.webm` (VP9 1080p, 2,9 MB), `kfc-filme.mp4` (H.264 720p, 2,9 MB, para quem não toca WebM) e `kfc-filme-poster.webp` (primeiro quadro). Só o vídeo do quadro principal é baixado: os outros formatos copiam o quadro dele num canvas (`HeroSplit`), em sincronia. O print do Coronel feliz olhando a TV (`kfc-coronel-tv.webp`) ficou no repositório para uso futuro.
- O bloco do key visual é ilustrativo (formatos e "Mensagem A, B…"), e diz isso na tela. Não mostra números de resultado.
- **27/10**: o case da Maturatta (Mês do Churrasco) virou o exemplo completo de filme mais desdobramento: o filme da Insula e as peças que a Begen gerou a partir dele (pasta "ADSGERADOS" no Drive, compartilhada em 27/10). São 90 peças: 6 variações, uma por corte, em 5 formatos (1920x1080, 1080x1920, 300x600, 970x250, 640x170), cada uma estática e animada (6 s), mais 30 vídeos de 10 e 15 s. O mosaico mostra as 30 animadas (em `public/media/cases/jbs-maturatta/`, reduzidas para 960 px e com MP4, WebM e capa). Os números do case são a contagem desses arquivos; os canais do filtro são descritivos (Horizontal, Vertical, Display), não planos de mídia. A home liga esse case como "Exemplo real". Na mesma pasta há uma série "Begen+Insula_Friboi": é a mesma campanha (Maturatta é linha da Friboi), uma segunda versão das peças (8 s; 1920x1080 e 1080x1920 quase idênticos, 970x250 rediagramado). Ficou fora para não duplicar peças nem inflar a contagem (decisão de 27/10).
- **27/10**: exemplo da Begen em `content/cases/begen-admultify.json`, montado só com o material de demonstração que a própria Begen publica no begen.ai (key visual "Campaign rollout at a glance", telas da plataforma, "114 Ads successfully generated" e as animações Resize, Variety e Amplify, convertidas para MP4/WebM em `public/media/cases/begen-admultify/`). Ficaram de fora as peças da Unisul e as fotos de modelos do mesmo site: parecem trabalho de cliente, sem autorização. A home liga esse exemplo no bloco do key visual. Campo novo no case: `capa` (imagem quando não há filme), e `frames` aceita loops (`{ src, webm, poster, legenda }`).

- **28/10**: a faixa "Marcas que já trabalharam com a gente" ganhou Mercado Pago, Samsung, Ânima, Natura, Bradesco, Ambev e Trident, a pedido do usuário, depois de Unilever, KFC e JBS. Virou grade (5 por linha no desktop, 2 no celular). Mercado Pago, Samsung, Natura, Bradesco e Ambev vêm do SVG do InfoMemo; a Ânima (Ânima Educação) foi vetorizada do logo branco do site oficial; o Trident, só a palavra, foi vetorizado do selo no fim de um filme da campanha The Town no Drive. A Natura volta só na faixa de logos; o filme dela continua fora.
- **28/10**: logo do Google com a frase "Official Google Partner" (igual em PT e EN) no hero, abaixo dos botões, e no rodapé, abaixo do logo (`components/GooglePartner.tsx`). Pedido do usuário: a Insula é parceira do Google há um ano e nunca pediu o selo do programa Google Partners, então não há selo; entram o wordmark do Google nas cores oficiais e a frase, sem montar selo. O wordmark não pode ser recolorido nem distorcido, e fica sempre menor que o logo da be-front. Se o selo oficial vier, ele substitui este bloco.

## Decisões em aberto (pergunte antes de assumir)

- Domínio definitivo da be-front. Até lá, o site fica no endereço genérico da Vercel (decisão de 27/10), que `lib/i18n.ts` pega sozinho de `VERCEL_PROJECT_PRODUCTION_URL`.
- Quais cases entram no lançamento e quais clientes autorizam aparecer com nome.
- O "90 peças" da Maturatta conta só a pasta "ADSGERADOS". Em 28/10 apareceram no Drive animações da mesma campanha em mais de 30 outros formatos (de 128x128 a 1710x962). Confirmar com a Begen o total entregue antes de mudar o número.
- Demonstração ao vivo do AdMultify ou apenas o bloco ilustrativo.
- Logo final (o atual foi vetorizado da imagem enviada em 27/10).
- Os cases da Begen: o begen.ai não tem cases publicados (o item "Cases" do menu não leva a nenhuma seção, conferido em 27/10); vêm da equipe da Begen. Sites: Insula em https://insula-ai.com/ e Begen em https://begen.ai/ (já ligados em `content/site.json`).
- E-mail, WhatsApp, agenda e redes (`content/site.json`).
- Técnica (IA ou híbrido) e agência dos cases da Insula que não trazem esse dado.
- Os filmes estão como "não listados" no YouTube. Confirmar que cada cliente liberou a exibição pública; senão, marcar `privado: true`.
- Texto de privacidade: rascunho, revisar com o jurídico.
