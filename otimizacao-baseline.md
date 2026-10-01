# otimizacao-baseline.md — antes × depois da otimização (2026-10-01)

## Antes (commit `f603cd4`)
Lighthouse mobile, servidor simples (`bash tools/lh.sh`, Python http.server, sem compressão nem cache):

| Performance | Acessibilidade | Boas práticas | SEO | FCP | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|
| **72** | 100 | 100 | 100 | 2,5 s | 7,8 s | 30 ms | 0,002 |

Principais causas medidas:
- CSS do Google Fonts + 3 CSS próprios bloqueando a renderização (≈ 1,5 s).
- LCP no celular = cena dos pratos com `loading="lazy"`.
- Imagens acima da dobra sem degrau para celular; textura das letras (287 KB) servida em 1376 px.
- O cinema escondia, ao carregar, a cena dos pratos que já estava visível no celular, o que também repintava o LCP (bug).
- JS próprio sem minificação.

JSON: `motion/lh-otim-baseline.json`.

## Depois (commit "otimizacao pronta")
| Servidor | Performance | FCP | LCP | TBT | CLS | Rodadas |
|---|---|---|---|---|---|---|
| Deploy simulado (`bash tools/lh-deploy.sh`: gzip/brotli + cache do DEPLOY.md) | **93 · 98 · 92** (mediana 93) | 0,9 s | 2,5–3,3 s | 0 ms | 0 | 3 |
| Servidor simples (mesma condição do "antes") | 87 | 1,0 s | 4,1 s | 20 ms | 0 | 1 |
| Desktop (deploy simulado) | 95 | — | 1,3 s | — | — | 1 |

Acessibilidade, boas práticas e SEO: 100 em todas as rodadas.
LCP real (navegador, celular emulado com CPU 4× mais lenta): **0,43 s**. Os 3,3 s do Lighthouse são a simulação de 4G lento somando todos os bytes acima da dobra.

JSON: `motion/lh-otim-final-*.json` e `motion/lh-otim-7*.json`.

## O que foi feito
| Área | Mudança |
|---|---|
| Fontes | Cinzel e Instrument Sans auto-hospedadas (`site/fonts/`, WOFF2 variável, subconjunto latino, 55 KB); uma face por peso usado; `font-display: swap`; preload das duas, que estão acima da dobra, só em http(s). Sem CDN de fontes. |
| CSS | `src/css/*` juntados, minificação conservadora (só comentários e espaços: fallbacks preservados) e embutidos no `<head>`: 12,9 KB, nenhum CSS bloqueando a renderização. |
| Imagens | Degrau de 480 px para celular (hero, pratos, drinks, bambu, corredor) e de 300 px para a fita; `sizes` por breakpoint; `aspect-ratio` fixo (o layout não muda com o degrau); WebP 80 na comida e 62 nos decorativos (fita, bambu, textura); textura das letras em 800 px no celular. |
| Prioridade | Candidato a LCP por breakpoint via `<link rel=preload media>` (desktop: hero; celular: pratos), o único com `fetchpriority="high"`; hero `low` no celular; bambu `low`; `lazy` em drinks, bambu, corredor e logo. A cena dos pratos não é mais `lazy`. |
| JS | `src/js/*` → `site/js/*.min.js` (terser): motion 11,4 → 5,4 KB; cinema 7,5 → 3,8 KB. |
| Bug | O cinema escondia a cena dos pratos que já estava visível no celular (piscava e repintava o LCP); agora só cria a entrada se a seção estiver abaixo da tela. |
| Pesados | Os SVGs com filtro `feTurbulence` (fita e bambu antigos) não eram usados: saíram de `site/` para `design/legacy-svg/`. Nada pesado inline restou. |

## Regressão visual (página inteira, sem motion, métrica perceptiva, tolerância 0,5%)
1920: 0% · 1440: 0% · 768: 0,006% · 390: 0,001% · **320: diferença deliberada.** Na versão anterior, em 320 px, a pílula da nota não quebrava linha e estourava a coluna: as citações encostavam na borda direita da tela e a estrela era espremida até sumir. Agora a pílula quebra em duas linhas e respeita a margem. A mesma correção resolveu o zoom de texto 200% em 320–430 px, que estava quebrado desde a etapa anterior. O título ganhou `min(3,5rem, 16vw)` para não passar da tela com zoom, sem mudar o tamanho no zoom normal.
