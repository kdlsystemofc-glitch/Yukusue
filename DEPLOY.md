# DEPLOY.md — publicação do site (sem escolher hospedagem)

## O que publicar
Somente a pasta **`site/`**, que é a saída do build. Não publicar `src/`, `design/`, `imagens/`, `tools/`, `screenshots/`, `motion/` nem `node_modules/`.

Antes de publicar:
```
python tools/build_assets.py   # imagens (só quando design/plates mudar)
node tools/build.mjs           # src/ -> site/ (CSS inline, JS minificado, SEO de seo.config.json)
python tools/build_icons.py    # favicons (só quando o logo mudar)
node tools/og.mjs              # imagem de compartilhamento (só quando o hero mudar)
node tools/motion-test.mjs && node tools/qa.mjs base   # regressão
```

## Cabeçalhos recomendados por tipo de arquivo
| Arquivo | `Cache-Control` | Compressão | Observação |
|---|---|---|---|
| `index.html` | `no-cache` (revalida sempre) | brotli (ou gzip) | contém o CSS inline: muda a cada deploy |
| `js/*.min.js`, `js/vendor/*.js` | `public, max-age=31536000, immutable` **só se o nome tiver hash ou versão**; senão `public, max-age=86400` | brotli (ou gzip) | hoje os nomes não têm hash: usar 1 dia ou adicionar `?v=<commit>` no build |
| `fonts/*.woff2` | `public, max-age=31536000, immutable` | não (já comprimido) | `Access-Control-Allow-Origin` não é necessário (mesmo domínio) |
| `assets/*.webp`, `assets/*.png` | `public, max-age=31536000, immutable` se versionados; senão `public, max-age=604800` | não | ao trocar uma imagem, mudar o nome do arquivo |
| `assets/manifest.json` | `no-cache` | brotli (ou gzip) | não é usado pela página |

Também recomendados (todos os arquivos):
- `Content-Type` correto: `text/html; charset=utf-8`, `text/javascript; charset=utf-8`, `font/woff2`, `image/webp`.
- `Vary: Accept-Encoding` nos arquivos comprimidos.
- `X-Content-Type-Options: nosniff`.
- `Referrer-Policy: strict-origin-when-cross-origin`.
- HTTPS obrigatório; HTTP/2 ou HTTP/3, que importam porque a página faz cerca de 15 requisições pequenas.
- **CSP sugerida:** `default-src 'self'; img-src 'self' data:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self'`. Os scripts e o CSS inline são intencionais (bootstrap de motion e CSS crítico); para remover o `unsafe-inline`, o build precisaria gerar hashes.

`tools/serve.mjs` reproduz esses cabeçalhos localmente para medir (`bash tools/lh-deploy.sh`).

## Pesos (build atual)
| Arquivo | Bytes (min) | gzip |
|---|---|---|
| `index.html` (com CSS inline) | ≈ 23 KB | ≈ 8 KB |
| `js/motion.min.js` | 5,4 KB | 2,2 KB |
| `js/cinema.min.js` | 3,8 KB | 1,6 KB |
| `js/vendor/gsap.min.js` | 71,2 KB | 27,8 KB |
| `js/vendor/ScrollTrigger.min.js` | 43,5 KB | 17,6 KB |
| `js/vendor/lenis.min.js` | 18,3 KB | 5,3 KB |
| `fonts/*.woff2` (2 arquivos) | 55 KB | — |

Todo o JS carrega depois do `load` (ou na primeira interação) e não bloqueia a primeira pintura.

## Antes de publicar: domínio
Preencher `"domain"` em `seo.config.json` (ex.: `"https://www.yukusue.com.br"`) e rodar `node tools/build.mjs`. Isso ativa canonical, og:url, og:image, twitter:image, url/@id/image do JSON-LD, a linha `Sitemap:` do robots.txt e o `<loc>` do sitemap.xml.
Cache recomendado: `robots.txt`, `sitemap.xml` e `site.webmanifest` com `public, max-age=86400`; `og-image.jpg`, `favicon.ico` e `icons/*` com `public, max-age=604800`.
