# Auditoria de integração visual — site × mockup (2026-09-30)

Evidências: `screenshots/auditoria/` (referência em cima, site embaixo, mesma escala 1440; `grade.jpg` = prova de correção de cor).

## Diagnóstico: por que as imagens parecem "coladas"

O mockup é um conjunto de **cenas fotografadas de uma vez**: mesma luz, mesma câmera, mesmo chão, mesmas sombras. O site monta a cena com **recortes de fotos diferentes**, tiradas no restaurante com celular e luz ambiente. Os seis sinais que denunciam a colagem, medidos:

| # | Sinal | Mockup | Site | Efeito |
|---|---|---|---|---|
| 1 | **Temperatura de cor** (R−B médio) | 18–65 | 48–127 (sal 127, salmão 101, drink vermelho 102) | Luz amarela de lâmpada colada sobre página azul-gelo |
| 2 | **Exposição** (luminância média) | 150–173 | 74–143 | Recortes escuros e "pesados" sobre fundo claro |
| 3 | **Ângulo de câmera** | Todos ~35° (vista de 3/4) | Temaki frontal girado −64°; salmão a 90° (de cima); ceviche macro de cima; sal ~45°; drinks a 0° | Cada objeto vive num "chão" diferente |
| 4 | **Direção da luz e sombra** | Luz de cima-esquerda, sombra suave embaixo-direita em tudo | Cada foto tem uma luz; sombras são elipses genéricas ou não existem | Objetos flutuam |
| 5 | **Nitidez** (variância do Laplaciano) | Uniforme | Temaki 309, drinks 190–225, sal 122, **ceviche 34**, **salão 15** | Peças nítidas ao lado de peças borradas = colagem |
| 6 | **Borda do recorte** | Contorno natural, com a luz do fundo "abraçando" a borda | Corte de tesoura (rembg); névoa residual na pedra de sal | Silhueta de figurinha |

## Por seção

| Seção | Problema principal | Secundários |
|---|---|---|
| 02 Hero | Temaki fotografado de frente e girado −64°: o recheio encara a câmera e o cone aponta para cima-esquerda, fisicamente impossível sobre o gelo. Salmão visto de cima, "em pé" sobre o bloco. | Comida não afunda no gelo (sem reflexo nem sobreposição da borda do gelo na base); tons quentes |
| 03 Pratos | Tigela = círculo perfeito (vista a 90°) enquanto a pedra de sal está a ~45°: dois planos de chão. O miolo do ceviche é um macro desfocado. | A pedra de sal está em baixa resolução (456 px) e com névoa; legendas soltas criam vãos; nada toca o chão |
| 04 Bebidas | Copos quentes e escuros, sem sombra, cortados na base sem apoio | Guarda-chuva verde cortado no original; forma de taça (hurricane) diferente do mockup, mas real |
| 05 Localização | Foto borrada (nitidez 15), close de ripado: não comunica "entrada" nem "salão" | **Bug:** o logo aparece como retângulo cinza (#1A1819) sobre o preto da seção (#0B0806) |
| Costuras | Fita e bambu agora conectam 03→04 como no mockup | Hero→Pratos e Bebidas→Local funcionam; o problema de "não conectar" vem das peças, não das bordas |

## Caminhos de melhoria

### A. Integração por tratamento (sem IA; dentro das regras atuais)
1. Correção de cor unificada de todas as fotos reais no pipeline (balanço de branco frio, exposição, curva): alvo R−B ≈ 55, luminância ≈ 150. Prova em `grade.jpg`.
2. Um único sistema de luz: sombra de contato + sombra projetada suave para baixo-direita em todo recorte; reflexo leve no gelo; a borda frontal do gelo passa **na frente** da base do temaki e do salmão.
3. Perspectiva: inclinar em CSS (rotateX ~50°) o salmão e a tigela para cair no plano de 35°; tigela vira elipse com profundidade.
4. Bordas: suavização de 1–2 px + light wrap; limpeza da névoa da pedra de sal.
5. Temaki: trocar pelo temaki de trás da imgi_47 (ângulo mais "deitado") ou pelo frontal sem giro.
6. Seção 05: tirar a foto borrada (bloco escuro tipográfico, só com endereço, horário e CTA) até chegar foto real; corrigir o fundo do logo.

Resultado esperado: melhora clara, mas **não chega ao mockup**. Ângulo e nitidez das fotos de celular continuam diferentes.

### B. "Estúdio" por IA a partir das fotos reais (precisa de autorização)
Manter o prato **idêntico**, trocar só o fundo e a luz para estúdio claro difuso, e, quando for o caso, ampliar a resolução. É o que dá a coesão do mockup. Fica numa zona cinzenta da regra de ouro (não é substituto novo, mas reilumina o real) e seria marcado em `assets.md` como "recriada por IA — confirmar com o cliente antes de publicar".

Prompt-modelo (anexar a foto real):
> Mantenha este prato absolutamente idêntico: mesmos ingredientes, mesmas quantidades, mesma montagem, mesmas cores naturais dos alimentos. Corrija apenas o fundo e a luz: remova mesa, louças e objetos ao redor, coloque o prato isolado sobre fundo liso azul-gelo #E8F1F8, luz de estúdio difusa vindo de cima à esquerda, sombra suave caindo para baixo à direita, câmera a ~35° de altura. Não invente, não adicione nem remova ingredientes, não mude o formato da louça. Alta resolução, 3000 px no lado maior.

### C. Fotos novas do cliente (resolve de verdade)
Briefing curto: fundo claro liso, luz de janela difusa pela esquerda, câmera a 35–45°, mesma distância para todos os pratos, 3000 px ou mais. Itens: temaki, sashimi, ceviche na tigela cobalto, pedra de sal, dois drinks, fachada e salão (fim de tarde, luzes acesas).

**Recomendação:** A agora (horas, sem risco) + B para os 4 itens do hero e dos pratos, se autorizado. C em paralelo, para a versão de publicação.
