# assets.md — inventário de imagens

Gerado por `tools/build_assets.py` (reprodutível). Destino: `site/assets/`.
**Decisão de 2026-09-30 (DESIGN.md §m): nenhuma foto real no site. Todas as imagens são geradas por IA**, exceto o logo.
Publicação depende de aprovação do cliente. As fotos reais em `imagens/` ficam só como referência dos pratos que a casa serve.

| Slot | Arquivo(s) em site/assets | Origem | Tipo | Tratamento | Nota |
|---|---|---|---|---|---|
| Logo (seção 05) | `logo-yukusue-146.png` | `imagens/imgi_2_…_n.jpg` | FOTO REAL (logo do cliente) | recorte + fundo preto removido | Provisório; pendência: vetor |
| Hero: temaki + rosa de salmão no gelo | `cena-hero-800.webp`, `cena-hero.webp` | `design/plates/img-01-hero.png` | **GERADA POR IA** | recorte por diferença de cor (mantém sombra e transparência do gelo) | Representa pratos reais da casa; confirmar com o cliente |
| Pratos: ceviche + pedra de sal | `cena-pratos.webp` | `design/plates/img-02-pratos.png` | **GERADA POR IA** | idem | idem |
| Bebidas: dois drinks | `cena-drinks.webp` | `design/plates/img-03-drinks.png` | **GERADA POR IA** | idem | idem |
| Seção 05: ambiente | `cena-ambiente-800.webp`, `cena-ambiente.webp` | `design/plates/img-04-ambiente.png` | **GERADA POR IA** | sem recorte | Decorativo; **não é a fachada real** |
| Fita de água (03→04) | `fita-agua.webp` | `design/plates/img-05-fita-agua.png` | GERADA (decorativo) | recorte por diferença de cor | estática |
| Bambu | `bambu.webp` | `design/plates/img-06-bambu.png` | GERADA (decorativo) | idem | girado −28° no CSS |
| Letras de gelo do H1 | `plate-gelo-800.webp`, `plate-gelo.webp` | `design/plates/Gemini_Generated_Image_s9ein8s9ein8s9ei.jpg` | GERADA (decorativo) | redimensionamento | — |

## Limitação conhecida
As imagens geradas vieram em 1024 px de largura. O hero aparece a ~1,1× em 1440 px e cerca de 2× em telas retina. Uma versão em 2048 px ou mais (mesmo prompt, "upscale") deixa tudo nítido: basta sobrescrever o arquivo em `design/plates/` e rodar `python tools/build_assets.py`.
