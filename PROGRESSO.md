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

## Falta
- Receber do cliente: pendências do DESIGN.md §i (logo vetor, horário, link de pedido, fotos de salão/fachada, autorizações).
- Opcional: AJ-01 e AJ-02 (versões por IA) para trocar o crop do ceviche e o retoque algorítmico do temaki.
- Etapa 3: motion (DESIGN.md §f) — a fita e o bambu não se movem. Pedido do usuário: motion caprichado, "experiência fantástica".
