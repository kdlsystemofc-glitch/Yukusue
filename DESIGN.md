# DESIGN.md — Yukusue Sushi Antártico

> Etapa: **análise** (nenhuma linha do site escrita ainda). Data: 2026-09-30.
> Fontes lidas: `CLIENTE.md` (dado bruto do Google Maps), as 16 imagens em `imagens/`,
> o mockup `design/mockup-full.png.jpg` (768×1376).
> **`CLIENTE-bruto.md` não existe no projeto.** O próprio `CLIENTE.md` já é o dado bruto
> (o cabeçalho dele diz isso), então ele foi tratado como fonte única e filtrado abaixo.

---

## 0. Fatos reais extraídos do CLIENTE.md (filtrados)

| Dado | Valor | Confiança |
|---|---|---|
| Nome | Yukusue Sushi Antártico | Oficial (ficha do Maps) |
| Categoria | Restaurante japonês | Oficial |
| Endereço | Av. Antártico, 240 – Jardim do Mar, São Bernardo do Campo – SP, 09726-150 | Oficial |
| Telefone | (11) 4121-5552 | Oficial (fixo; WhatsApp desconhecido) |
| Plus code | 8C6Q+J3 Jardim do Mar, São Bernardo do Campo – SP | Oficial |
| Serviços | Refeição no local · Retirada na porta · Entrega sem contato · "Pedir on-line" | Oficial (link do pedido **não informado**) |
| Horário | Só "Abre às 12:00" (retrato de um único dia) | **Incompleto** |
| Nota Google | 4,3 · 2.722 avaliações | Público, muda com o tempo (datar no site) |
| Faixa de preço | R$ 80–160 por pessoa | **Informado por usuários (261)**, não oficial |
| Descrição | "Gastronomia japonesa tradicional de pratos variados, diversas marcas de saquê e ambiente casual e familiar." | Texto editorial do Google, não do cliente |
| Mais pedidos | Combinado Boat · Shimeji | Público (Maps) |
| Rodízio | "Rodízio de sushi e sashimi" (atualização de visitante, 4 anos atrás) + tag "rodízio" em 100 avaliações | **Provável, não confirmado** (valor, dias, inclusões desconhecidos; uma avaliação diz "não há frutos do mar no rodízio") |
| Texto do próprio cliente | "CEVICHES FRESCOS E TEMPERADINHOS" (sobreposto na foto imgi_45) e "eu só estava com fome" (sobreposto em imgi_47) | Copy real do cliente (Instagram) — pode virar texto HTML |

**Descartado:** interface do Maps, "Lugares também pesquisados" (Itoshi, EYÔ, Asami, Kawage), resumo do Gemini (não é fala do cliente), avaliação negativa (Bianca), histograma de pico.

**Contradição/ambiguidade a registrar:** "Yukusue Sushi Saúde" aparece como *concorrente sugerido* — provavelmente é outra unidade da mesma marca. Não assumir; perguntar ao cliente se o site é só da unidade Antártico.

---

## 1. Fatias do mockup (`design/secoes/`)

Cortadas por bloco de conteúdo. A fita de água e o bambu atravessam 03→04 e **não** determinaram os cortes.

| Arquivo | Y (px no mockup) | Conteúdo |
|---|---|---|
| `01-header.png` | 0–64 | Nav + wordmark |
| `02-hero.png` | 64–429 | "YUKUSUE" gigante em gelo + temaki e sashimi sobre bloco de gelo |
| `03-pratos-destaque.png` | 429–791 | Bowl azul (ceviche) + sashimi na pedra de sal; bambu e fita de água à esquerda |
| `04-bebidas-avaliacoes.png` | 791–1124 | Dois drinks + selo 4.3★ + 2 depoimentos |
| `05-localizacao-cta.png` | 1124–1376 | Fundo escuro, entrada de madeira, endereço, "aberto às 12:00", botão pedir/reservar |

---

## a) Leitura honesta: mockup × realidade

### O que o mockup inventa
| # | Onde | O que o mockup mostra | Realidade |
|---|---|---|---|
| 1 | Header | Nav "Home · Editorial · Navigos · Sensomes · Blog · Contact" | Placeholder sem sentido, em inglês. Não existe blog nem editorial. |
| 2 | Header | Wordmark "YUKUSUE SUSHI" em serifa clássica | **Logo real é outro:** silhueta de peixe em traço branco, palavra "Yukusue" em fonte grossa arredondada, bloco verde-musgo (#596E45) atrás da palavra, fundo preto, slogan miúdo ilegível. Só existe em 150×150 px (imgi_2). |
| 3 | Hero | Temaki + leque de salmão com folha de shissô, sobre **bloco de gelo esculpido** | Temaki existe (imgi_47, servido em tábua de bambu). Bloco de gelo **não existe** nas fotos; o real é gelo picado em travessa laqueada (imgi_48, imgi_54) e gelo seco com fumaça (imgi_27). Shissô não aparece. |
| 4 | Pratos | Bowl azul-marinho redondo com ceviche de **camarão** e ovas | O real é cerâmica **azul-cobalto** em formato de onda com ceviche de **polvo/lula**, cebola roxa e tobiko (imgi_45). Camarão inventado. |
| 5 | Pratos | Sashimi de peixe branco/hamachi na pedra de sal com wasabi | Pedra de sal é real (imgi_27, imgi_46), mas com salmão, raspas de limão e ovas; wasabi e o corte mostrado são inventados. |
| 6 | Pratos/Bebidas | Planta de bambu com folhas + fita de água cristalina | Decorativos. Não há bambu vivo no salão; o que existe é **ripado de madeira** e **esteira de bambu (sudare)** (imgi_48, imgi_49). |
| 7 | Bebidas | Drink verde (kiwi) e vermelho com guarda-chuvinhas amarelos | **Real** (imgi_48), mas o mockup trocou cores dos guarda-chuvas (reais: verde-água e rosa) e tirou o morango. |
| 8 | Avaliações | "Conktalistán a pre-gurançe…", "Averiau-ainel Signature coloois craft coctails…", autor "Swiss" / "Swiss typography" | **Lorem ipsum embaralhado.** Nenhuma palavra é aproveitável. Números "4.3 · 2,722" batem com o Maps, mas em formato EN (o certo é "4,3 · 2.722"). |
| 9 | Final | Corredor/entrada de madeira curva, "WORM MODERN ENTRANCE" | **Ambiente inventado.** Não há nenhuma foto de fachada. O salão real: painéis de ripado de madeira clara, estofados capitonê azul-marinho, mesas de madeira mel, mural de pôr do sol com barco (imgi_49), bancos verde-azulados (imgi_30). |
| 10 | Final | "LIVE ABERTO ÀS 12:00" | "Abre às 12:00" é real, mas é o retrato de **um** dia. "LIVE" é lixo de placeholder. Horário semanal desconhecido. |
| 11 | Final | Botão "PEDIR ONLINE / RESERVAR" | "Pedir on-line" existe no Maps, mas **sem link conhecido**. **Reserva não é informada** em lugar nenhum. |
| 12 | Global | Paleta gelo/azul-pálido, clima "nórdico" | Não vem da marca (preto + branco + verde-musgo), mas **é defensável**: a unidade se chama *Antártico*, e o gelo aparece de verdade nas fotos (gelo picado, gelo seco). Mantida como conceito. |

### O que o mockup acerta e vamos preservar
- Estrutura em 5 blocos, ritmo claro → médio → escuro no fim.
- O endereço "Av. Antártico, 240 – SBC".
- A ideia de gelo/frescor ligada ao nome "Antártico".
- Comida recortada e "flutuando" sobre fundo claro.

---

## b) Paleta (HEX amostrado do mockup + âncoras das fotos reais)

Amostragem por mediana/percentil em regiões do mockup (script em Python/PIL). Âncoras de marca vindas do logo e das fotos reais estão marcadas.

| Token CSS | HEX | Origem | Uso |
|---|---|---|---|
| `--gelo-50` | `#E8F1F8` | fundo do hero/header (mockup) | fundo principal |
| `--gelo-100` | `#E7F1F5` | fundo da seção de bebidas | fundo alternado |
| `--gelo-200` | `#D5E6F0` | brilho da fita de água | superfícies, fita |
| `--aco-300` | `#A8BDCE` | letras de gelo (claro) | **só decorativo** |
| `--aco-500` | `#718795` | letras de gelo (médio) | só texto ≥ 24px / decorativo |
| `--aco-700` | `#455E72` | letras de gelo (sombra) | texto secundário, contorno do H1 |
| `--tinta` | `#1A1C1D` | texto da nav | texto principal |
| `--noite` | `#0B0806` | fundo da seção final | fundo escuro |
| `--creme` | `#FCF9F4` | rótulos brancos no escuro | texto sobre escuro |
| `--musgo` | `#596E45` | **logo real** (≈ `#6B7D54` do mockup) | acento de marca, só decorativo/grande |
| `--musgo-claro` | `#A9BD92` | "aberto às 12:00" (mockup) | texto de acento sobre escuro |
| `--musgo-escuro` | `#4E5E3C` | correção (ver abaixo) | texto de acento sobre claro |
| `--cobalto` | `#1B2FA8` | **cerâmica real** (imgi_52) — mockup `#033490` | acento forte, links, foco |
| `--madeira` | `#A6683C` | madeira da entrada (mockup) ≈ mesa real `#C17F1F` | detalhes, fios |
| `--madeira-escura` | `#8A5530` | correção | texto em tom madeira |
| `--ambar` | `#F1A60D` | estrela da avaliação | ícone estrela |
| `--texto-meta` | `#5F666A` | correção de `#797F82` | autoria, legendas |

### Contraste WCAG (calculado)

| Par | Razão | AA normal (4,5) | AA grande (3) | Decisão |
|---|---|---|---|---|
| `--tinta` / `--gelo-50` | 14,96 | OK | OK | — |
| meta mockup `#797F82` / `--gelo-50` | 3,55 | **FALHA** | OK | **Corrigido → `#5F666A` (5,11)** |
| `--aco-500` / `--gelo-50` | 3,28 | **FALHA** | OK | Só ≥ 24px; texto pequeno usa `--aco-700` (5,93) |
| `--aco-300` / `--gelo-50` | 1,70 | FALHA | FALHA | Nunca como texto; só preenchimento decorativo |
| `--musgo` mockup `#6B7D54` / `--noite` | 4,46 | **FALHA** | OK | **Texto no escuro → `--musgo-claro` (9,87)** |
| `#6B7D54` / `--gelo-50` | 3,92 | **FALHA** | OK | **Texto no claro → `--musgo-escuro` (6,14)** |
| `--madeira` / `--gelo-50` | 3,94 | **FALHA** | OK | **Texto → `--madeira-escura` (5,37)** |
| `--ambar` / `--gelo-50` | 1,80 | FALHA | FALHA | Estrela é `aria-hidden`; a nota "4,3" em texto carrega a informação. Estrela ganha contorno `--madeira-escura` para atingir 3:1 (WCAG 1.4.11) |
| `--ambar` / `--noite` | 9,70 | OK | OK | — |
| `--cobalto` / `--gelo-50` (e inverso) | 9,10 | OK | OK | — |
| `--creme` / `--noite` | 19,01 | OK | OK | — |
| `--creme` / `--madeira-escura` `#513824` | 10,30 | OK | OK | — |
| preto / pílula `#E5EEF5` | 17,88 | OK | OK | — |
| **H1 "YUKUSUE" em gelo** (mediana `#98A8B5`) / `--gelo-50` | ≈ 2,1 | — | **FALHA** | **Corrigido:** o preenchimento em gradiente continua, mas ganha contorno de 1–2px em `--aco-700` e o gradiente para em `--aco-700` na base; a borda da letra fica ≥ 3:1. |

---

## c) Tipografia (Google Fonts)

O mockup usa uma serifa romana de capitulares (tipo Trajan) no display e uma grotesca "suíça" no texto. Inter, Roboto e Arial estão fora.

| Papel | Candidata 1 | Candidata 2 | Decisão |
|---|---|---|---|
| **Display** (H1 gigante, títulos) | **Cinzel** (500–700): capitulares inscricionais romanas, praticamente o desenho das letras de gelo do mockup; hastes largas o bastante para receber gradiente e contorno. | **Marcellus**: serifa alargada mais macia, com minúsculas. Útil se precisarmos de títulos em caixa baixa. | **Cinzel.** É a mais fiel ao mockup, e todos os títulos do mockup estão em caixa alta. Marcellus fica como plano B se algum título longo pedir caixa baixa. |
| **Texto / UI** (nav, depoimentos, botões) | **Instrument Sans** (400–600, largura variável): neogrotesca de ar suíço, igual ao texto dos depoimentos do mockup; o eixo de largura ajuda a caber no mobile. | **Manrope**: geométrica-grotesca, redonda. Conversa com o logo arredondado, mas é mais "tech". | **Instrument Sans.** Mais próxima do mockup e menos genérica. |
| **Acento manuscrito** (opcional) | **Caveat**: ecoa o "eu só estava com fome" que o próprio cliente usa no Instagram. | — | Só se o conceito de hero B for escolhido (ver perguntas). Fora por padrão. |

Escala fluida (tokens): `--fs-hero: clamp(3.5rem, 16vw, 12rem)`, `--fs-h2: clamp(1.75rem, 5vw, 3rem)`, `--fs-body: clamp(1rem, 0.95rem + 0.25vw, 1.125rem)`, `--fs-meta: clamp(0.8125rem, 0.78rem + 0.15vw, 0.875rem)`.
Espaçamento: `--sp-1…--sp-8` em `clamp()` com base de 0,5rem. Gutter mobile: `clamp(1rem, 4vw, 3rem)`.

---

## d) Tabela de camadas por seção

| Seção | CSS | SVG | FOTO real | PLATE gerado |
|---|---|---|---|---|
| 01 Header | fundo `--gelo-50`, nav em Instrument Sans, botão "Ligar" | — | **Logo** imgi_2 (provisório, após AJ-04; o ideal é o vetor do cliente) | — |
| 02 Hero | H1 "YUKUSUE" em HTML com gradiente `background-clip:text` + contorno; faixa de gelo fosco (gradientes + ruído leve) | brilhos/lascas de gelo (formas poligonais translúcidas) | Recorte do **temaki** (imgi_47 após AJ-02) + recorte do **prato de salmão em rosa** (imgi_57) | **PLATE-01** textura de gelo (opcional, só se o CSS ficar plano demais) |
| 03 Pratos | fundo `--gelo-50`, legendas | **fita de água** (atravessa 03→04, estática) + **ramo de bambu** estilizado | Ceviche no bowl cobalto (imgi_45 após AJ-01) + salmão na pedra de sal (imgi_27) | — |
| 04 Bebidas + avaliações | selo em pílula, citações | continuação da fita; aspas desenhadas | Recorte dos **dois drinks** (imgi_48, só a parte de cima; a travessa de sashimi fica de fora) | — |
| 05 Localização/CTA | fundo `--noite`, botão pílula `--gelo-50`, texto `--creme` | ícones (pino, relógio, telefone) em traço fino | **Salão real** imgi_49 (ripado + estofado navy + mural), recortado à esquerda como no mockup | — |
| Reserva (galeria opcional) | — | — | imgi_14, 21, 31, 43, 51, 52, 54, 46, 30 (após AJ-03) | — |

---

## e) Reinterpretação dos decorativos complexos em CSS/SVG

### E1. Letras de gelo "YUKUSUE" (hero) — CSS puro
- `<h1>` HTML real, Cinzel 600, `--fs-hero`, `letter-spacing: 0.02em`.
- `background: linear-gradient(175deg, #fff 0%, var(--gelo-200) 30%, var(--aco-300) 55%, var(--aco-500) 78%, var(--aco-700) 100%)` + `background-clip: text; color: transparent`.
- Facetas: uma segunda camada (pseudo-elemento com o mesmo texto via `attr(data-text)`, `aria-hidden`) com um gradiente cônico branco em opacidade baixa, para os reflexos "quebrados" do gelo.
- Contorno: `-webkit-text-stroke: clamp(1px, .15vw, 2px) var(--aco-700)` (é o que garante os 3:1).
- Sombras: nada de `box-shadow` padrão. Uma única `text-shadow` fria de 1px, deslocada para baixo, em `rgba(69,94,114,.35)`, só para descolar a letra do fundo.
- Fallback sem `background-clip:text`: `color: var(--aco-700)`.
- Se o resultado ficar "plástico" demais, a textura PLATE-01 entra como `background-image` do texto, e o gradiente vira overlay.

### E2. Bloco/faixa de gelo sob a comida (hero) — CSS + SVG
- Não é um "bloco de gelo esculpido" (isso sugeriria uma forma de servir que não existe). É uma **faixa de gelo fosco abstrata**, horizontal, que serve de "chão" para os recortes.
- `div` com `clip-path: polygon(...)` irregular + gradiente linear `--gelo-200 → #fff → --aco-300` + `backdrop-filter` **não** (é caro). O ruído vem de um SVG `feTurbulence` rasterizado **uma vez** em data-URI pequeno (256px, repetido), sem filtro ao vivo.
- 3–5 lascas SVG poligonais sobrepostas, com stroke branco de 1px e fill branco a 20–40%.

### E3. Fita de água (atravessa 03→04) — SVG estático
- Um `<svg>` absoluto num wrapper que cobre as seções 03 e 04, `viewBox` próprio e `preserveAspectRatio="none"` só no eixo Y (`xMidYMin slice` no mobile).
- Um `path` em S desenhado a partir do mockup, com 3 traçados empilhados: largo `--gelo-200` com opacidade no **atributo do path** (folha) · médio com gradiente `--aco-300 → #fff` · fino branco (brilho especular) com `stroke-dasharray` irregular para parecer reflexo.
- **Regra do CLAUDE.md:** a fita **não se move** na fase de motion, e nenhum ancestral dela recebe `transform`, `filter` ou `opacity < 1`. As seções 03/04 não recebem transform de entrada no container. Só as camadas-folha (fotos, textos) animam.
- No mobile (< 48rem) a fita encolhe para uma faixa estreita na borda esquerda, para não cobrir a comida.

### E4. Ramo de bambu — SVG
- Folhas lanceoladas desenhadas à mão em SVG (8–10 folhas, 1 haste com nós), em chapado **duotônico**: `--musgo` e `--musgo-claro`. Assim o bambu vira extensão da cor real do logo, e não uma "foto de planta".
- Alternativa (ver pergunta 3): padrão de **ripas** (o ripado real do salão) ou **sudare** em linhas SVG verticais.

### E5. Selo de avaliação — CSS
- Pílula com borda de 1px `--tinta`, `border-radius: 999px`, estrela SVG inline em `--ambar` com contorno `--madeira-escura`.

---

## f) Motion por seção (fase de motion — não implementar agora)

Princípios: nada acima da dobra depende de JS para aparecer. O JS de motion carrega **depois** do `load`. Só `transform`/`opacity` em camadas-folha. `prefers-reduced-motion: reduce` desliga tudo, menos transições de hover/foco. Easing base: `cubic-bezier(.2,.7,.2,1)`. Durações: 400–900ms.

| Seção | Entrada | Contínuo / scroll | Interação |
|---|---|---|---|
| 01 Header | nenhuma (sempre visível) | ao rolar > 1 viewport, fundo ganha `--gelo-50` a 92% e borda de 1px `--aco-300` (troca de cor, não opacity no container) | sublinhado da nav cresce do centro (`scaleX` num pseudo-elemento) |
| 02 Hero | visível estático no HTML. Depois do `load`, reflexo cônico das letras desliza uma vez (`translateX` do pseudo-elemento, 1,2s) | recortes do temaki e do prato flutuam ±6px em Y (`translateY`, 6s, alternado, defasados). Parallax leve: letras 0,9×, comida 1,05× (só `transform` nas folhas) | — |
| 03 Pratos | cada foto sobe 24px + opacity 0→1 via IntersectionObserver (classe só adicionada pelo JS; sem JS já nasce visível) | **fita e bambu parados** (regra) | hover na foto: `scale(1.02)` na `<img>` (folha), legenda sobe 4px |
| 04 Bebidas + avaliações | drinks entram de baixo com 120ms de diferença; pílula 4,3 com opacity; citações palavra a palavra **não** (legibilidade), só bloco a bloco | fita parada | — |
| 05 Localização/CTA | foto do salão com revelação por `clip-path: inset()` na própria `<img>` (folha) | — | botão pílula: fundo `--gelo-50` → `--creme`, seta `translateX(4px)`. Foco visível: anel 2px `--cobalto` + offset 3px |

---

## g) PLANO DE IMAGENS

### g.1 Slots do site

| Slot | Tipo | Arquivo de origem (`imagens/`) | Tratamento | Destino (`site/assets/`) |
|---|---|---|---|---|
| Logo (header, rodapé) | FOTO REAL (logo) | `imgi_2_290687920_1041048783216439_4869083936603517475_n.jpg` | AJ-04 (ampliar) provisório → **substituir pelo vetor do cliente** | `logo-yukusue.png` |
| Hero — temaki | FOTO REAL recortada | `imgi_47_619259016_18171558961380370_3689588281233277342_n.jpg` | AJ-02 (tirar texto) → recorte do temaki da frente, PNG/WebP transparente | `hero-temaki.webp` |
| Hero — prato de salmão | FOTO REAL recortada | `imgi_57_607530497_18169190896380370_3311978653427667901_n.jpg` | recorte circular do prato (sem IA) | `hero-salmao-rosa.webp` |
| Hero — faixa de gelo | CSS/SVG (+ PLATE-01 opcional) | — | E1/E2 | `plate-gelo.webp` (se usado) |
| Pratos — ceviche | FOTO REAL | `imgi_45_619675659_18171792079380370_4277722250567896961_n.jpg` | AJ-01 (tirar texto) | `prato-ceviche.webp` |
| Pratos — pedra de sal | FOTO REAL | `imgi_27_642528015_18176161228380370_2595430925063698484_n.jpg` | só crop/compressão | `prato-sashimi-sal.webp` |
| Bebidas — drinks | FOTO REAL recortada | `imgi_48_617808468_18171129916380370_7447850538286843105_n.jpg` | recorte dos 2 copos (sem IA; a base do copo verde fica atrás da esteira, e o recorte termina acima da travessa) | `drinks.webp` |
| Final — salão | FOTO REAL | `imgi_49_616575006_18171128395380370_3490693935938839873_n.jpg` | crop vertical na área ripado + estofado + masu vermelho | `salao.webp` |
| Galeria (opcional) | FOTO REAL | imgi_14, imgi_21, imgi_31, imgi_43, imgi_51, imgi_52, imgi_54, imgi_46 | crop/compressão | `galeria-*.webp` |
| Galeria / ambiente (opcional) | FOTO REAL | `imgi_30_639840018_1268779765151747_6938166059236149305_n.jpg` | AJ-03 (ampliar, é frame de vídeo 640×1136) | `ambiente-molho.webp` |
| Fita de água, bambu, lascas, ícones | SVG | — | E3/E4 | inline |

Observações sobre fontes:
- `imgi_46` é mais antiga, com filme plástico visível sobre a tábua (parece delivery) e luz fria. Só como reserva.
- `imgi_49` mostra rótulo de terceiro (saquê Azuma Kirin Dourado). Pode ser usada: é produto que o restaurante vende e condiz com "diversas marcas de saquê". Sem crop para destacar a marca.
- Nenhuma foto mostra **fachada, equipe ou pessoas**: a seção final usa o salão.

### g.2 PLATES a gerar

Prioridade: tudo em CSS/SVG. Só **um** plate é proposto, e é **opcional**. Ele só entra se, no teste, as letras e a faixa de gelo em CSS puro ficarem planas demais.

**PLATE-01 — textura de gelo abstrata (opcional)**
Uso: `background-image` das letras do H1 (com `background-clip:text`) e da faixa de gelo do hero.
Por que não resolve 100% em CSS: a refração irregular de gelo real (bolhas, fraturas internas) não sai convincente só com gradientes.

Prompt pronto:
```
Macro photograph-style abstract texture of clear frozen ice surface, seen straight on, filling the entire frame edge to edge. Pale glacial palette only: icy white #FFFFFF, frost blue #E8F1F8, mist blue #D5E6F0, steel blue #A8BDCE, deep steel #455E72 in the darkest cracks. Fine internal fractures, tiny trapped air bubbles, soft frosted areas mixed with glassy transparent areas, subtle cold highlights. Evenly lit, low contrast, no vignette, no focal point, no horizon, no depth of field blur. No objects, no food, no plates, no hands, no people, no plants, no text, no letters, no logos, no watermark, no figurative elements of any kind. Seamless tileable texture. Aspect ratio 16:9, 3840x2160.
```
Registrar em `assets.md` como "PLATE gerado — decorativo abstrato".

### g.3 Fotos reais que precisam de AJUSTE

Todas seguem a regra "mantenha tudo idêntico, só corrija X". Em `assets.md`, cada resultado leva a nota **"recriada por IA — confirmar com o cliente antes de publicar"**.

**AJ-01 — remover texto do ceviche**
Anexar: `imagens/imgi_45_619675659_18171792079380370_4277722250567896961_n.jpg`
```
Mantenha esta foto absolutamente idêntica: mesma comida, mesmas cores, mesma luz, mesmo foco, mesmo enquadramento, mesma resolução (1320x1760, proporção 3:4). Corrija apenas uma coisa: remova o texto branco "CEVICHES FRESCOS E TEMPERADINHOS" no canto inferior esquerdo, a linha fina branca diagonal e o ponto branco em que ela termina. Reconstrua a área por baixo continuando exatamente o que já existe ali: a cerâmica azul-cobalto brilhante, a borda branca da tigela e o ceviche (cebola roxa, polvo), com a mesma textura, reflexo e desfoque. Não adicione nenhum ingrediente, objeto, texto ou marca. Não altere nada fora dessa área.
```

**AJ-02 — remover texto do temaki**
Anexar: `imagens/imgi_47_619259016_18171558961380370_3689588281233277342_n.jpg`
```
Mantenha esta foto absolutamente idêntica: os dois temakis, a alga, o recheio de salmão com cebolinha, a tábua de bambu, a luz e as cores, na mesma resolução (1320x1760, proporção 3:4). Corrija apenas uma coisa: remova todo o texto branco manuscrito "eu só estava com fome" e o pequeno sorriso laranja acima dele, no lado direito superior. Reconstrua o fundo por baixo continuando o que já existe: a mesa de madeira escura desfocada, a borda da travessa branca/cinza desfocada no canto superior direito e a parte da alga do temaki que o texto cobre, com a mesma textura, desfoque e iluminação quente. Não adicione nenhum objeto, texto ou marca. Não altere nada fora dessa área.
```

**AJ-03 — ampliar frame de vídeo do salão**
Anexar: `imagens/imgi_30_639840018_1268779765151747_6938166059236149305_n.jpg`
```
Amplie esta foto para o dobro da resolução (de 640x1136 para 1280x2272, mesma proporção 9:16), mantendo tudo idêntico: mesmo enquadramento, mesmas cores, mesma mão, mesma jarra, mesmo molho escorrendo, mesmo prato de salmão com ovas e mesmo salão ao fundo (bancos verde-azulados, madeira). Corrija apenas a nitidez e os artefatos de compressão de vídeo. Não invente detalhes novos, não mude o desfoque do fundo, não adicione pessoas, objetos, texto ou marcas, não altere a mão.
```

**AJ-04 — ampliar logo (provisório, até chegar o vetor do cliente)**
Anexar: `imagens/imgi_2_290687920_1041048783216439_4869083936603517475_n.jpg`
```
Amplie este logotipo de 150x150 para 2000x2000 px, mantendo o desenho absolutamente idêntico: o peixe em traço branco (cabeça, olho, nadadeira caudal com as mesmas linhas), a palavra "Yukusue" na mesma fonte grossa e arredondada, branca, o bloco verde-musgo (#596E45) atrás da palavra, o símbolo ® e o fundo preto chapado (#1A1819). Corrija apenas a resolução: bordas nítidas e limpas, cores chapadas, sem ruído JPEG. A linha de texto miúda abaixo da palavra não é legível no original: mantenha-a exatamente como uma linha fina de texto borrado no mesmo lugar e tamanho, NÃO invente nem tente reconstruir letras. Não redesenhe, não mude proporções, não adicione nada.
```
> Nota: o slogan miúdo do logo é ilegível no original. Qualquer IA vai inventar letras ali, por isso o AJ-04 só vale para o header (em tamanho pequeno o slogan nem aparece). **O logo definitivo precisa vir do cliente.**

### g.4 Recortes (sem IA, feitos na fase de build)
Temaki (imgi_47 pós-AJ-02), prato de salmão em rosa (imgi_57), dois drinks (imgi_48): recorte com máscara/rembg + ajuste manual de borda. Isso não gera pixel novo, então não leva a nota de IA. Registrar em `assets.md` como "recorte de foto real".

---

## h) PERGUNTAS PARA MIM (decisões subjetivas)

1. **Hero:** (A) fiel ao mockup: recortes reais (temaki + prato de salmão) flutuando sobre uma faixa de gelo abstrata em CSS/SVG, sob o "YUKUSUE" de gelo; ou (B) foto real inteira `imgi_27`, que tem **gelo seco com fumaça de verdade**, sangrando por trás do "YUKUSUE"? A é mais fiel ao mockup, B é mais autêntico. *Minha inclinação: A.*
2. **Convivência com o logo real:** o logo é peixe + fonte grossa arredondada + verde-musgo sobre preto; o mockup é serifa clássica de gelo sobre azul-pálido. (A) logo real só no header e "YUKUSUE" em Cinzel de gelo no hero, como no mockup; ou (B) o H1 do hero sai numa fonte grossa arredondada, próxima do logo, com o mesmo tratamento de gelo? *Minha inclinação: A.*
3. **Bambu decorativo:** (A) ramo de bambu em SVG duotônico musgo, fiel ao mockup; ou (B) trocar por linhas de ripado/esteira de bambu, que **existem** no salão real (imgi_48/49)?
4. **Galeria extra:** o mockup não tem galeria, mas sobram 8 fotos reais boas (sobremesa, tartar, empanados, ceviche na taça, sunomono, barca de sashimi). Adiciono uma faixa-galeria entre 04 e 05, ou fico só nos 5 blocos do mockup?

(Decisões que tomei sozinho: Cinzel + Instrument Sans; paleta do mockup com correções AA; seção final com o salão real `imgi_49` no lugar da entrada inventada; depoimentos com trechos literais do Maps, com nome abreviado; CTA principal = telefone `tel:`, porque é o único canal confirmado.)

---

## i) PENDÊNCIAS-CLIENTE (não bloqueiam a construção, bloqueiam a publicação)

| # | Pendência | Como fica no site até lá |
|---|---|---|
| 1 | Horário completo de funcionamento (dias e horários, almoço/jantar) | `<!-- PENDÊNCIA: horário -->` + só "Abre às 12h" marcado |
| 2 | WhatsApp (se houver) | só o telefone fixo `(11) 4121-5552` |
| 3 | Link do "Pedir on-line" (iFood? app próprio?) | botão com `href="#"` comentado |
| 4 | Aceita reserva? Por qual canal? | "Reservar" fora do botão até confirmar |
| 5 | Rodízio: existe hoje? Valor, dias, o que inclui/não inclui | seção não menciona rodízio |
| 6 | Faixa de preço oficial (o Maps mostra R$ 80–160, informado por usuários) | não exibida |
| 7 | Logo em alta/vetor (SVG/AI/PDF) + texto do slogan miúdo | logo ampliado provisório (AJ-04) |
| 8 | Direito de uso das fotos (são do Instagram do restaurante? algumas parecem de clientes/influenciadores) | fotos usadas, marcadas em `assets.md` |
| 9 | Aprovar as fotos editadas por IA (remoção de texto em 2 fotos, ampliação de 1 foto e do logo) | usadas com nota em `assets.md` |
| 10 | Autorização para citar avaliações do Google (nome abreviado) | trechos literais, sem inventar continuação |
| 11 | Foto da fachada e mais fotos do salão | seção final usa `imgi_49` |
| 12 | O site é só da unidade Antártico ou também da "Yukusue Sushi Saúde"? | só Antártico |
| 13 | Nomes oficiais dos pratos das fotos (ex.: "Combinado Boat") e cardápio atual | legendas genéricas ("Ceviche", "Sashimi na pedra de sal") |
| 14 | Instagram/redes, e-mail, domínio | ícones fora até confirmar |

### Mensagem pronta para o cliente

> Olá, tudo bem? Aqui é da equipe que está montando o site do **Yukusue Sushi Antártico**. O layout já está em produção, e para publicar precisamos confirmar algumas informações com vocês:
>
> 1. **Horário de funcionamento** de cada dia da semana (almoço e jantar).
> 2. Vocês têm **WhatsApp** para pedidos/contato? Qual número?
> 3. O **link do pedido on-line** (iFood, app próprio ou outro).
> 4. Vocês **aceitam reservas**? Por qual canal?
> 5. **Rodízio**: ainda existe? Qual o valor, em quais dias, e o que está incluso?
> 6. O **logo em alta qualidade** (arquivo vetorial: SVG, AI, PDF ou PNG grande) e o texto da frase pequena embaixo do nome.
> 7. As fotos que usamos são do Instagram de vocês. Podem confirmar que **podemos usá-las no site**? Em 2 fotos removemos o texto escrito por cima, e 1 foto e o logo foram ampliados digitalmente. Vamos mandar essas versões para vocês aprovarem.
> 8. Podemos **citar trechos de avaliações do Google** no site (só com o primeiro nome do cliente)?
> 9. Se tiverem, **fotos da fachada e do salão**.
> 10. O site é só da **unidade Antártico** ou deve incluir também a unidade Saúde?
> 11. Os **nomes oficiais dos pratos** das fotos e, se possível, o cardápio atual.
> 12. **Instagram**, e-mail e domínio que querem usar.
>
> Nada disso trava o desenvolvimento: seguimos construindo e encaixamos as respostas assim que chegarem. Obrigado!

---

## j) Decisões tomadas na construção (2026-09-30)

As perguntas do §h ficaram sem resposta, então valeram as escolhas padrão:
1. Hero **A**: recortes reais (temaki imgi_47 + salmão em rosa imgi_57) sobre a faixa de gelo, com PLATE-01 como textura.
2. Logo **A**: logo real numa pílula preta no header (cor `--logo-fundo`); "YUKUSUE" em Cinzel de gelo no hero.
3. Bambu **A**: ramo SVG duotônico musgo (fiel ao mockup).
4. Galeria: **adiada**. Ficaram só os 5 blocos do mockup; as fotos de reserva estão em assets.md.

Ajustes técnicos feitos sozinho:
- **Breakpoints:** header e seção 04 empilham abaixo de 64rem; hero, pratos e localização, abaixo de 48rem. Em 768 a nav de 5 itens e as citações não cabiam no layout de desktop.
- **Seção 05:** a foto ocupa 9–60% (no mockup, 9–81%). O único recorte real disponível sem garrafa de terceiro tem 815 px, e esticar a 72% ampliava demais.
- **Temaki:** a foto real é frontal, então o recorte foi girado −72° para ficar "deitado" como no mockup.

## k) Revisão de fidelidade ao mockup (2026-09-30, pedido do cliente interno)
- Header: wordmark tipográfico "YUKUSUE SUSHI" (Cinzel) no centro, como no mockup. O logo real (peixe) foi para a seção escura 05, onde o fundo preto do arquivo se funde.
- Hero: a faixa plana virou um **bloco de gelo em SVG** (textura PLATE-01 com contraste realçado, faces de topo e frente, arestas e brilho especular). A comida ficou maior, com sombra de contato em gradiente.
- Pratos: o ceviche entra numa **tigela vista de cima** (aro cobalto em CSS, cor da louça real) e a foto retangular da pedra de sal virou o **recorte real do bloco de sal** (imgi_27).
- Fita de água: SVG com refração (feDisplacementMap) e brilho especular; os tracejados saíram. Bambu com degradê por folha e colmo cilíndrico. Cores do bambu amostradas do mockup (#719325).
- Limites que continuam: a comida é a real (regra de ouro). A seção 05 segue sem foto de entrada/fachada. Fita e bambu continuam ilustrados; para ficarem fotográficos como no mockup, é preciso gerar os plates PLATE-02 e PLATE-03.
- Atualização: PLATE-02 (fita de água) e PLATE-03 (bambu) entregues e aplicados no lugar dos SVGs (que ficam em `site/svg/` como alternativa). O recorte é por diferença de cor em relação ao fundo liso, o que preserva a transparência. A fita não se move e só recebe máscara na própria imagem.

## l) Integração A + B (2026-09-30)
**Autorização:** o usuário autorizou o caminho B (AUDITORIA.md): fotos reais refeitas por IA com fundo e luz de estúdio, com o prato idêntico. É uma exceção pontual à regra de ouro. Cada arquivo vai para `imagens/estudio/` e fica marcado em assets.md como "recriada por IA — confirmar com o cliente antes de publicar".

**A aplicado (sem IA):**
- Correção de cor e exposição de todas as fotos no pipeline (alvo medido no mockup).
- Light wrap e borda suavizada nos recortes.
- Sistema de luz único (`--sombra-contato`, `--sombra-projetada`): luz de cima-esquerda.
- Perspectiva: salmão e tigela inclinados para o plano de ~30°. O temaki perdeu o giro "impossível".
- A aresta do gelo passa na frente da base da comida.
- As legendas soltas viraram `sr-only`, e o texto continua no HTML.
- Seção 05: o salão virou atmosfera desfocada e o fundo cinza do logo foi removido.

**B — slots que trocam sozinhos** quando o arquivo existir (rodar `python tools/build_assets.py`):
| Arquivo esperado | Foto real a anexar |
|---|---|
| `imagens/estudio/temaki.png` | imgi_47 |
| `imagens/estudio/salmao.png` | imgi_57 |
| `imagens/estudio/ceviche.png` | imgi_45 |
| `imagens/estudio/pedra-sal.png` | imgi_27 |
