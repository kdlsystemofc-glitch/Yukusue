# Yukusue Sushi Antártico — site

Landing page de uma página do restaurante japonês Yukusue Sushi Antártico (Av. Antártico, 240, Jardim do Mar, São Bernardo do Campo, SP). HTML e CSS estáticos, com motion cinematográfico guiado pela rolagem (GSAP + ScrollTrigger + Lenis) que entra como camada extra: sem JavaScript o site aparece inteiro.

> ⚠️ **Imagens geradas por IA.** Todas as fotos de comida, bebida e ambiente do site (`site/assets/cena-*`, fita de água, bambu, textura de gelo) foram **criadas por IA**. Elas representam pratos que a casa serve, mas não são fotos do restaurante. Precisam de aprovação do cliente antes de publicar; ver [PENDENCIAS-CLIENTE.md](PENDENCIAS-CLIENTE.md). O único arquivo real do cliente no site é o **logo**.

## Como rodar
Ver o site: abra `site/index.html` no navegador (funciona por `file://`), ou sirva a pasta:
```
node tools/serve.mjs          # http://localhost:8766 (com os cabeçalhos do DEPLOY.md)
```

Depois de editar `src/` ou os configs:
```
npm install                    # uma vez (playwright, terser, gsap, lenis)
npx playwright install chromium webkit
node tools/build.mjs           # src/ -> site/ (CSS inline, JS minificado, SEO, dados do cliente)
```

Regenerar assets (só quando as fontes mudarem; requer Python com Pillow, numpy e opencv):
```
python tools/build_assets.py   # design/plates/*.png -> site/assets/*.webp
python tools/build_icons.py    # logo -> favicon e ícones
node tools/og.mjs              # imagem de compartilhamento 1200x630 (a partir do hero)
```

Testes:
```
node tools/qa.mjs <base|zoom|nofont|reduced|dark>   # 14 telas (320 a 5120 px); QA_BROWSER=webkit QA_HTTP=1 para Safari/WebKit
node tools/motion-test.mjs                          # 60 checagens de motion (modos, fita intacta, nada preso, repouso = estático)
node tools/visual-diff.mjs <antes.html> <depois.html>
bash tools/lh-deploy.sh saida.json                  # Lighthouse mobile com cabeçalhos de deploy
```

## Estrutura
```
src/                 código-fonte: index.html, css/ (tokens, base, sections), js/ (motion, cinema)
site/                SAÍDA DO BUILD — é a única pasta a publicar
  assets/            imagens WebP (degraus 300/480/800/original)
  fonts/             Cinzel e Instrument Sans (WOFF2, auto-hospedadas)
  js/                motion.min.js, cinema.min.js, vendor/ (gsap, ScrollTrigger, lenis)
  icons/ favicon.ico og-image.jpg robots.txt sitemap.xml site.webmanifest licenses/
design/              referência visual (mockup, fatias) e plates gerados — NÃO usados como imagem no site
imagens/             fotos reais do cliente (referência; só o logo é usado)
tools/               build, assets, QA, motion, SEO, Lighthouse
cliente.config.json  dados que ainda faltam do cliente (horário, pedido on-line, WhatsApp…)
seo.config.json      domínio (único campo) e metadados de compartilhamento
```

## Documentos
| Arquivo | Conteúdo |
|---|---|
| [DESIGN.md](DESIGN.md) | Decisões de design: paleta e contraste, tipografia, camadas, motion, plano de imagens e decisões registradas (§j–§m) |
| [AUDITORIA.md](AUDITORIA.md) | Por que as fotos de celular pareciam "coladas" e o caminho escolhido |
| [motion-inventario.md](motion-inventario.md) | Todas as animações, orçamento e efeitos rejeitados |
| [otimizacao-baseline.md](otimizacao-baseline.md) | Lighthouse antes e depois, o que foi otimizado |
| [DEPLOY.md](DEPLOY.md) | O que publicar, cabeçalhos de cache e compressão, domínio |
| [PENDENCIAS-CLIENTE.md](PENDENCIAS-CLIENTE.md) | O que falta do cliente e o efeito de cada item |
| [ROTEIRO-APARELHO-REAL.md](ROTEIRO-APARELHO-REAL.md) | Checklist de teste em iPhone e Android |
| [assets.md](assets.md) | Inventário das imagens e origem de cada uma |
| [PROGRESSO.md](PROGRESSO.md) | Histórico por etapa |

## Decisões principais (detalhes no DESIGN.md)
- **Fiel ao mockup** em composição, com todo texto em HTML real e só dados confirmados (CLIENTE.md); o que é incerto fica comentado ou em `cliente.config.json`.
- **Imagens geradas** com um bloco de estilo único (mesmo fundo `#E8F1F8`, luz e câmera), por decisão do cliente interno (DESIGN.md §m), em vez de fotos de celular.
- **Motion:** só `transform` e `opacity`; a fita de água nunca se move; modos completo, reduzido (só fades) e pausado (botão); qualidade baixa em aparelhos fracos; cada cena termina idêntica ao estático aprovado.
- **Desempenho:** CSS inline, fontes locais, JS depois do `load`, imagem de LCP priorizada por breakpoint.

## Licenças de terceiros (cópias em `site/licenses/`)
| Componente | Licença |
|---|---|
| GSAP 3.15 + ScrollTrigger | GSAP Standard "no charge" License — https://gsap.com/standard-license (uso comercial gratuito) |
| Lenis 1.3 | MIT |
| Fonte Cinzel | SIL Open Font License 1.1 |
| Fonte Instrument Sans | SIL Open Font License 1.1 |
| Playwright (só desenvolvimento) | Apache-2.0 |
| terser (só build) | BSD-2-Clause |
| rembg, OpenCV, Pillow (só ferramentas de imagem) | MIT, Apache-2.0, HPND |

O conteúdo do restaurante (nome, logo, dados) pertence ao cliente. As imagens geradas por IA dependem dos termos do gerador usado.
