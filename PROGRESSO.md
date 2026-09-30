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

## Falta
- Receber do cliente: pendências do DESIGN.md §i (logo vetor, horário, link de pedido, fotos de salão/fachada, autorizações).
- Opcional: AJ-01 e AJ-02 (versões por IA) para trocar o crop do ceviche e o retoque algorítmico do temaki.
- Etapa 3: motion (DESIGN.md §f) — a fita e o bambu não se movem.
