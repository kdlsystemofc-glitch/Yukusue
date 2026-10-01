# motion-inventario.md — todas as animações (2026-10-01, versão cinema)

## Versão cinema (`site/js/cinema.js`) — tomadas guiadas pela rolagem
Substitui as entradas e o parallax discretos da versão anterior nos elementos marcados com `data-scrub`. Cada tomada é amarrada à rolagem (scrub 0,9 s) e **termina no quadro estático aprovado**.

| Tomada | O que acontece | Trecho de rolagem |
|---|---|---|
| Hero · mergulho no gelo | a página segura o hero; o título cresce 1,45× e se dissolve; a cena do gelo aproxima até 1,5× e é levada para cima pela rolagem (sem tempo morto) | pin de 90% da altura da tela (só se o hero tiver ≥ 70% da tela; no celular, mergulho sem pin, durante a saída) |
| Pratos · varredura | o bambu varre da esquerda (−16vw → 0) e os pratos sobem da câmera (y +16vw, escala 0,78 → 1, fade); depois, balanço do bambu | do topo da seção entrando até 25% da tela |
| Bebidas · peso | os drinks sobem (y +14vw, escala 0,92 → 1, fade) | idem |
| Avaliações · máscara | citações palavra a palavra saindo de uma máscara (18 ms por palavra); nota conta 0,0 → 4,3 e 0 → 2.722 | dispara a 82–85% da tela, uma vez; o texto original é restaurado no fim |
| Local · afastamento | o corredor começa aproximado (1,35×) e escuro e abre até o enquadramento; logo, título, horário, serviços, CTA e endereço entram em cascata | da seção entrando até o fim da página |

Parâmetros do roteiro anterior relaxados a pedido ("impactante e cinematográfico"): deslocamentos acima de 24 px e duração ligada à rolagem em vez de 600–900 ms.
Mantido: só transform e opacity; fita e ancestrais intocados; nada acima da dobra depende de JS; reduced = sem cinema (só fade); pausado = tudo no quadro final.
A tabela abaixo descreve a versão anterior; os elementos com `data-scrub` passaram para o cinema.


Motor: GSAP 3.15 + ScrollTrigger + Lenis 1.3.26, auto-hospedados (`site/js/vendor/`), carregados depois do `load` ou na primeira interação. Código: `site/js/motion.js`.
Propriedades animadas: **só transform (x, y, yPercent, scale, rotation) e opacity, só em camadas-folha.**

## Por seção
| Seção | Elemento | Tipo | Detalhe | full·high | full·low | reduced | paused |
|---|---|---|---|---|---|---|---|
| Header | links | hover | sublinhado cresce (CSS `background-size`, 350 ms) | sim | sim | instantâneo | sim |
| Hero | `.s-hero__cena` (gelo + temaki + salmão) | parallax de saída | 0 no topo → −24 px ao rolar a seção (fator 0,10) | sim | metade (−12 px) | não | congelado |
| Hero | título "YUKUSUE" | — | **sem entrada**: acima da dobra, visível sem JS | — | — | — | — |
| Pratos | `.s-pratos__bambu` | entrada + loop | da esquerda (−40 px → 0, fade, ~0,8 s); depois balanço ±1,2° pela base, 5,5–7 s, só na tela | sim | entrada sem loop | fade 200 ms | parado |
| Pratos | `.s-pratos__cena` | entrada + parallax | sobe 32 px + fade (+120 ms); parallax 0,06, máx. 24 px, 0 no centro da tela | sim | parallax 0,03 | fade 200 ms | congelado |
| Bebidas | `.s-bebidas__cena` | entrada + parallax | sobe + fade; parallax 0,05 | sim | parallax 0,025 | fade 200 ms | congelado |
| Bebidas | nota + 2 citações | entrada em cascata | sobe 32 px + fade, 120 ms entre itens; parallax nunca sobre texto | sim | sim | fade 200 ms | visível |
| Local | imagem do corredor | entrada | aproximação 1,06 → 1 + fade, 1,1 s (fechamento mais lento, de propósito) | sim | sim | fade 200 ms | visível |
| Local | logo, título, horário, serviços, CTA | entrada em cascata | 120 ms entre itens | sim | sim | fade 200 ms | visível |
| Local | CTA | hover | troca de cor de fundo (300 ms) | sim | sim | instantâneo | sim |
| Global | rolagem | Lenis | `lerp 0.1`, âncoras suaves | sim | **não** (rolagem nativa) | não | parado |
| Global | botão "Pausar animações" | controle | fixo no canto inferior direito, 44 px, `aria-pressed`; preferência salva | sim | sim | **não exibido** | sim |

**Elementos que nunca se movem:** a fita de água (`.flow__fita`) e todos os seus ancestrais (`.flow`, `main`, `body`). A regressão confere isso a cada 180 px de rolagem.

## Orçamento
| Métrica | Orçamento | Medido |
|---|---|---|
| Loops simultâneos por posição de rolagem | ≤ 2 | **máx. 1** (bambu, só com os pratos na tela) |
| Tweens ativos ao mesmo tempo | ≤ 6 | **máx. 5** (entrada de bebidas + local) |
| Deslocamento de parallax | ≤ 24 px | 24 px (hero), ≤ 24 px (demais) |
| Duração de entrada | 600–900 ms | 600–900 ms; corredor 1,1 s (exceção deliberada) |

## Efeitos avaliados e NÃO implementados (critério visual)
| Efeito | Motivo |
|---|---|
| Vapor/fumaça sobre os pratos | Sashimi, ceviche e temaki são pratos **frios**: vapor seria fisicamente errado e de banco de imagem. |
| Partículas/neve ("Antártico") | Clichê de template; brigaria com o gelo fotográfico, que já carrega a ideia. |
| Brilho deslizando no "YUKUSUE" (DESIGN.md §f) | Exigiria animar `background-position` ou máscara no texto (fora da regra só transform/opacity); um brilho genérico em cima de uma textura fotográfica parece efeito pronto. |
| Cintilação no gelo / reflexo animado na fita | A fita é o elemento contínuo: proibido mover. Brilho sobre o gelo pareceria sticker. |
| Pulsar da luz LED no corredor | Luz real não pulsa; leria como defeito de lâmpada. |
| Flutuação da cena do hero ou dos drinks | Objetos apoiados numa mesa (sombra de contato real) não flutuam. Flutuar descolaria a sombra e reabriria o problema de "figura colada". |

## Ferramentas
- `node tools/motion-test.mjs [secoes] [--cost]`: regressão (modos, fita intacta, empilhamento, navegação rápida, repouso × estático ≤ 0,5%, custo).
- `node tools/keyframes.mjs <seletor> <rótulo> [largura] [entrada|scroll]`: tira de quadros-chave.
- `node tools/coerencia.mjs`: loops por posição de rolagem + vídeo `screenshots/motion/video/pagina-1440.webm`.
