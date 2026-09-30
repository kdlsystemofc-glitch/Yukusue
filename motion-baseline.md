# motion-baseline.md — linha de base antes do motion (2026-09-30)

Medido no commit `c8967eb` ("responsivo pronto"), sem nenhum JavaScript no site.

## Auditoria responsiva (`node tools/qa.mjs <modo>`, 12 telas: 2560×1440 … 320×568 e 844×390)
| Modo | Resultado |
|---|---|
| base | tudo ok |
| zoom (texto 200%) | tudo ok |
| nofont (Google Fonts bloqueado) | layout ok; único erro é o bloqueio de fonte provocado pelo teste |
| reduced (prefers-reduced-motion) | tudo ok |
| dark (prefers-color-scheme) | tudo ok |

## Lighthouse mobile (`bash tools/lh.sh`, 3 rodadas)
| Rodada | Performance | Acessibilidade | Boas práticas | SEO | FCP | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|---|
| 1 | 74 | 100 | 100 | 100 | 2,5 s | 6,0 s | 0 ms | 0,002 |
| 2 | 74 | 100 | 100 | 100 | 2,5 s | 6,0 s | 0 ms | 0,002 |
| 3 | 73 | 100 | 100 | 100 | 2,5 s | 6,9 s | 0 ms | 0,002 |

**Referência de Performance: 74** (mediana). Orçamento do motion: não cair mais de 3 pontos por fase, ou seja, **≥ 71**.
Ruído observado entre rodadas: ±1 ponto. JSON: `motion/lh-baseline*.json`.

## Custo de rolagem sem JS
Ver `screenshots/motion/custo.json`, linha `sem-js` (rolagem de 5 s com a roda do mouse, 1440×900, Chromium headless). É a referência de custo para as fases de motion.
