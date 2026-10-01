# PENDENCIAS-CLIENTE.md — o que falta o cliente fornecer

Nada disto bloqueia o desenvolvimento, mas bloqueia a **publicação**. O build avisa enquanto faltar algo:
`NÃO PRONTO PARA PUBLICAR — falta: …`.

**Como aplicar uma resposta:** preencha o campo indicado em `cliente.config.json` (ou `seo.config.json`, no caso do domínio), rode `node tools/build.mjs` e depois a regressão (`node tools/motion-test.mjs && node tools/qa.mjs base`).

## Dados
| # | O que falta | Onde preencher | Efeito quando resolvido |
|---|---|---|---|
| 1 | **Domínio** | `seo.config.json` → `domain` | Ativa canonical, og:url, og:image e twitter:image (prévia em WhatsApp e redes), url/@id/image no JSON-LD, `Sitemap:` no robots.txt e `<loc>` no sitemap.xml |
| 2 | **Horário completo** (dias e turnos) | `cliente.config.json` → `horario` (`texto`, `semana`, `confirmado: true`) | Troca o "Abre às 12h" na seção "Onde estamos"; publica `openingHoursSpecification` (Google mostra aberto/fechado) |
| 3 | **Link do pedido on-line** | `pedidoOnline.url` | O botão principal vira "Pedir on-line"; entra `OrderAction` no JSON-LD. O telefone continua no topo |
| 4 | **WhatsApp** | `whatsapp.numero` (só dígitos, com 55) | Aparece o link "WhatsApp" abaixo dos serviços; entra `contactPoint` no JSON-LD |
| 5 | **Aceita reservas? Por qual canal?** | `reservas.aceita`, `reservas.canal` | `acceptsReservations` no JSON-LD (o texto visível segue sem "Reservar" até isso existir) |
| 6 | **Faixa de preço oficial** | `faixaDePreco` (`valor`, `confirmado: true`) | `priceRange` no JSON-LD (hoje "R$ 80–160" vem de usuários e não é publicado) |
| 7 | **Coordenadas do salão** | `geo.lat`, `geo.lng` | `geo` no JSON-LD (melhora o pino em buscas locais) |
| 8 | **Instagram / Facebook / e-mail** | `redes`, `email` | `sameAs` e `email` no JSON-LD (perfil de marca no Google) |

## Arquivos e autorizações
| # | O que falta | Onde marcar | Efeito |
|---|---|---|---|
| 9 | **Aprovação das imagens geradas por IA** (todas as fotos do site são geradas: temaki, salmão, ceviche, pedra de sal, drinks, corredor) | `autorizacoes.imagensGeradasPorIA: true` | Libera publicação. Se o cliente preferir fotos próprias: trocar os arquivos em `design/plates/` (mesmo enquadramento e fundo) e rodar `python tools/build_assets.py` |
| 10 | **Autorização para citar 2 avaliações do Google** (trechos literais, nome abreviado) | `autorizacoes.citarAvaliacoesDoGoogle: true` | Libera publicação. Se não autorizar: remover os 2 `<figure>` em `src/index.html` (a nota 4,3 pode ficar como texto) |
| 11 | **Logo em vetor** (SVG/AI/PDF) | salvar em `imagens/logo.svg` e marcar `logoVetorialRecebido: true` | Logo nítido na seção escura e favicons/ícones nítidos. Hoje são ampliações do arquivo de 150 px. Requer ajustar `tools/build_icons.py` para o novo arquivo |
| 12 | **Nomes oficiais dos pratos e drinks** | `nomesOficiaisDosPratos: true` + editar os `alt` em `src/index.html` | Textos alternativos e legendas com os nomes do cardápio (hoje são descritivos genéricos) |
| 13 | **Rodízio** (existe? valor? o que inclui?) | — | Hoje o site não menciona. Se confirmado, vira conteúdo novo (seção ou linha), que exige aprovação de layout |
| 14 | **Site só da unidade Antártico ou também da Saúde?** | — | Hoje só Antártico. Outra unidade = nova seção e outro bloco `Restaurant` no JSON-LD |
| 15 | **Foto real da fachada/salão** (opcional) | `design/plates/img-04-ambiente.png` | A seção escura passaria a mostrar o lugar real em vez do ambiente gerado |

## Mensagem pronta para o cliente
> Olá! O site do **Yukusue Sushi Antártico** está pronto em versão de aprovação. Para publicar, precisamos de:
> 1. Horário de funcionamento de cada dia (almoço e jantar).
> 2. Link do pedido on-line e número de WhatsApp, se houver.
> 3. Vocês aceitam reservas? Por qual canal?
> 4. Faixa de preço por pessoa que vocês querem divulgar.
> 5. O logo em arquivo vetorial (SVG, AI ou PDF).
> 6. Nomes oficiais dos pratos e drinks que aparecem no site (temaki, rosa de salmão, ceviche de polvo, salmão na pedra de sal, drink de kiwi e de frutas vermelhas).
> 7. Aprovação das imagens: são ilustrações fotográficas criadas por IA a partir dos pratos que vocês servem. Se preferirem, podemos trocar por fotos próprias.
> 8. Autorização para citar dois trechos de avaliações do Google (com o primeiro nome do autor).
> 9. Instagram, e-mail e o domínio que querem usar.
> 10. O rodízio ainda existe? Se sim, valor e o que inclui.
>
> Assim que chegarem, o ajuste leva poucos minutos. Obrigado!
