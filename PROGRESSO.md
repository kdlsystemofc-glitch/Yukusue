# PROGRESSO

## 2026-09-30 — Etapa 1: análise (concluída)
- Lidos `CLIENTE.md`, as 16 fotos de `imagens/` e o mockup `design/mockup-full.png.jpg`.
- `CLIENTE-bruto.md` não existe; o `CLIENTE.md` já é o dado bruto.
- Mockup fatiado em `design/secoes/` (01-header … 05-localizacao-cta).
- `DESIGN.md` criado: leitura mockup × realidade, paleta com contraste WCAG, tipografia, camadas, decorativos em CSS/SVG, motion, plano de imagens, perguntas e pendências do cliente.
- Commit: nenhum (a pasta ainda não é repositório git).

## 2026-09-30 — Etapa 2: construção estática (concluída)
Commits: `design pronto` → `header pronta` → `hero pronta` → `pratos pronta` → `bebidas e avaliações pronta` → `localização e CTA pronta` → ajustes finais.
- Assets: `tools/build_assets.py` → `site/assets/*.webp` (+ `assets.md`). SVGs: `tools/gen_svg.py` → `site/svg/`.
- Screenshots: `node tools/shot.mjs <seção> <anterior> <larguras> <rótulo>`; comparação: `python tools/compare.py`.
- Site: `site/index.html` (abrir direto no navegador; não precisa de build).
- Problema aberto: seção 05 sem foto nítida de salão/fachada (fundo de imgi_49 é desfocado no original).
- Push: não feito (`GH_TOKEN` ausente, sem remote).

## 2026-09-30 — Revisões de fidelidade e integração
- Revisão de fidelidade, PLATE-02/03 (água e bambu), AUDITORIA.md, caminho A aplicado, caminho B com slots prontos.
- Falta B: gerar as 4 versões de estúdio (prompts na resposta e em AUDITORIA.md) e salvar em imagens/estudio/.

## 2026-09-30 — Imagens 100% geradas
- 6 imagens geradas (design/plates/img-01..06) aplicadas como cenas completas recortadas por diferença de cor. As fotos reais saíram do site, exceto o logo.
- Falta: versões em alta resolução (2048 px+) das 6 imagens; aprovação do cliente para as imagens geradas.

## 2026-09-30 — Passada responsiva (commit "responsivo pronto")
- QA automatizado: `node tools/qa.mjs [base|zoom|nofont|reduced|dark]` em 12 telas (2560 a 320, mais 844x390). Todos os modos passam; no nofont, o único erro é o bloqueio de fonte que o próprio teste provoca.
- Corrigido:
  - alvos de toque de 44px no header;
  - sobreposição do menu no celular;
  - zoom de 200% (avaliações em fluxo, header com quebra, endereço limitado);
  - composição com teto em 1600px (`--vw`);
  - fita fora do texto no tablet e no celular deitado;
  - endereço abaixo da imagem no celular;
  - fallbacks para Safari (overflow clip, svh) e `color-scheme: light`;
  - favicon (404) e fita como fundo CSS (aspect ratio).
- Lighthouse mobile: Performance 75 · Acessibilidade 100 · Boas práticas 100 · SEO 100 (screenshots/qa/lighthouse-mobile.json).

## 2026-09-30 — Motion · Fase 1: núcleo (tag motion-base) ✅
- GSAP 3.15 + ScrollTrigger + Lenis 1.3.26 auto-hospedados em `site/js/vendor/`, carregados por um bootstrap inline depois do load ou na primeira interação.
- `site/js/motion.js`: modos full, reduced e paused (+ `?motion=off` para referência); qualidade high/low; atributos data-reveal, data-parallax e data-loop; loops param fora da tela e com a aba oculta; trava contra elemento preso escondido.
- Regressão: `node tools/motion-test.mjs [secoes] [--cost]`, VERDE. Lighthouse 73 (referência 74, orçamento ≥ 71).

## 2026-09-30 — Motion · Fase 2: seções ✅
- Hero: parallax de saída da cena de gelo (0 → −24 px), sem entrada (acima da dobra).
- Pratos: bambu entra da esquerda + balanço contínuo (±1,2°, só high, só na tela); cena entra + parallax 0,06.
- Bebidas: drinks entram + parallax 0,05; nota e citações em cascata (120 ms).
- Local: corredor com aproximação lenta (1,06 → 1, 1,1 s); logo, título, horário, serviços e CTA em cascata. Sem parallax (há texto sobre a imagem).
- Regressão: repouso 0% diferente do estático nas 4 seções (1440 e 390); fita e ancestrais intactos; empilhamento ok; navegação rápida ok.
- Lighthouse por seção: 72 · 72 · 73 · 72 (orçamento ≥ 71).
- Custo em headless: inconclusivo (variação da máquina maior que o efeito); precisa de medição em aparelho real.

## 2026-10-01 — Motion · Fase 3: menu, pausa, coerência (tag motion-pronto) ✅
- Botão "Pausar animações" (WCAG 2.2.2): fixo, 44 px, `aria-pressed`, preferência salva; só ícone no celular e em telas baixas; oculto no modo reduzido.
- Menu: sublinhado no hover (CSS), âncoras suaves via Lenis. Rodapé: o site não tem rodapé; a seção escura cumpre o papel e tem a cascata de entrada.
- Corrigido nesta fase: rolagem lateral causada pela aproximação do corredor (`overflow: hidden` no contêiner).
- `motion-inventario.md`: todas as animações, orçamento (máx. 1 loop e 5 tweens simultâneos) e efeitos rejeitados com o motivo.
- Vídeo: `screenshots/motion/video/pagina-1440.webm`.
- Botão de pausa vem no HTML (estava entrando tarde e piorava o Speed Index 2,9 → 5,0 s); o bootstrap trata o clique antes do motion carregar.
- Lighthouse final: 72 / 70 (2 rodadas; Speed Index oscilando entre 3,5 e 4,9 s). Linha de base 74.

## 2026-10-01 — Motion · Versão cinema (tag motion-cinema) ✅
- `site/js/cinema.js`: pin com mergulho no hero, varredura dos pratos, drinks com peso, citações palavra a palavra, contador da nota, afastamento do corredor.
- Header e hero com altura em pixel inteiro (o pin deslocava o resto em subpixel).
- Teste de repouso agora usa métrica perceptiva (desfoque de 1 px): DOM e estilos finais idênticos; o resto era antialiasing pós-composição.
- Regressão verde (60 checagens) · QA verde · Lighthouse 72 / 73.

## 2026-10-01 — Otimização (commit "otimizacao pronta") ✅
- Estrutura nova: **código-fonte em `src/`**, build `node tools/build.mjs` → **`site/` (publicar só esta pasta)**. Detalhes em otimizacao-baseline.md e DEPLOY.md.
- Lighthouse mobile 72 → **93** (deploy simulado) / 87 (servidor simples). Desktop 95.
- Regressão de motion verde; QA verde nos 5 modos (zoom 200% corrigido).

## 2026-10-01 — SEO local (commit "seo pronto") ✅
- `seo.config.json`: único lugar do domínio (`"domain": null` por enquanto). Canonical, og:url, og:image, twitter:image, url/@id/image do JSON-LD, Sitemap do robots e os <loc> do sitemap saem comentados até o domínio existir. Gerado por `tools/seo.mjs` dentro de `node tools/build.mjs`.
- JSON-LD `Restaurant`: só nome, endereço, telefone, culinária e serviços (ficha oficial). Preço, horário, geo, reservas e cardápio ficam comentados como pendência; sem aggregateRating (nota do Google é de terceiros).
- OG/Twitter 1200x630 (`site/og-image.jpg`) a partir do hero aprovado (`node tools/og.mjs`).
- Favicons e webmanifest a partir do LOGO REAL (`python tools/build_icons.py`); o peixe em SVG que eu tinha desenhado saiu.
- Semântica conferida: 1 h1, 3 h2 em ordem, alt em todas as imagens informativas.

## 2026-10-01 — Rodada final
### Números finais
- **QA:** Chromium e WebKit (por HTTP), 5 modos × 14 telas (320 → 5120 px), tudo verde.
- **Motion:** 60/60 no Chromium e 60/60 no WebKit.
- **Regressão visual** vs commit anterior: 0% em 1920, 1440, 768, 390 e 320.
- **Lighthouse mobile** (deploy simulado): 86 · 93 · 92 (mediana 92); servidor simples: 86. **Desktop:** 97. A11y, BP e SEO: 100.

### Polimento: corrigido agora (baixo risco, medido)
| Item (origem) | Correção | Verificação |
|---|---|---|
| Cópias "-800" idênticas à original em 4 imagens (otimização) | não são mais geradas | regressão visual 0% |
| `manifest.json` de assets dentro de `site/` (não usado) | movido para `assets.manifest.json` (raiz, não publicado) | — |
| Scripts sem versão no nome: cache longo inseguro (DEPLOY.md) | build adiciona `?v=<hash>` a gsap, ScrollTrigger, lenis, motion e cinema | funciona por file:// e http; motion verde |
| CSS recomendado do Lenis ausente (motion) | `html.lenis…` em base.css (só age com a classe do Lenis) | regressão de motion verde |
| Dados do cliente espalhados no HTML | `cliente.config.json` aplicado pelo build; aviso "NÃO PRONTO PARA PUBLICAR" | testado preenchido e vazio |
| WebKit não testado | QA e motion com `QA_BROWSER=webkit QA_HTTP=1` | ver números abaixo |
| Telas muito largas | 3840×2160 e 5120×1440 incluídas no QA | verde |
| Licenças não distribuídas | `site/licenses/` (OFL ×2, MIT Lenis, GSAP) | — |

### Polimento: espera cliente ou aparelho real
| Item | Por que esperar |
|---|---|
| Pedra de sal cortada na própria imagem gerada (IMG-02) | precisa gerar a imagem de novo (decisão e aprovação de imagem) |
| Logo de 150 px (seção escura, favicons suaves em 192/512) | depende do vetor do cliente |
| Imagens geradas em 1024 px (suaves em retina e 4K) | gerar versões 2048 px+; depende da aprovação das imagens |
| Fita esticada no celular deitado | julgamento visual em aparelho real |
| Custo do motion (fps) e estabilidade do pin no iOS | inconclusivo em headless; ROTEIRO-APARELHO-REAL.md |
| Rodízio, outra unidade, nomes dos pratos | conteúdo novo; depende do cliente |
| **CLS 0,09 no desktop** (hero preso: ao carregar o motion, o espaçador empurra para baixo o topo dos pratos que aparecia na tela) | correção muda o visual aprovado: hero com 100% da altura da tela no desktop, ou pin criado só no 1º gesto. Está dentro de "bom" (< 0,1). Decisão de design |
| Botão de pausa sobre conteúdo no fim da página (canto inferior direito) | não cobre texto nos testes; confirmar em aparelho com barra de navegação |

## Falta
- Domínio: preencher `seo.config.json` → `node tools/build.mjs`.
- Receber do cliente: pendências do DESIGN.md §i (logo vetor, horário, link de pedido, fotos de salão/fachada, autorizações).
- Opcional: AJ-01 e AJ-02 (versões por IA) para trocar o crop do ceviche e o retoque algorítmico do temaki.
- Motion: testar em aparelho real (ver motion-inventario.md).
