# assets.md — inventário de imagens

Gerado por `tools/build_assets.py` (reprodutível). Destino: `site/assets/`.
Larguras 800 e 1600; quando a fonte é menor que 1600, a variante grande sai na
largura nativa (nunca ampliamos por reamostragem).

| Slot (DESIGN.md) | Arquivo(s) em site/assets | Origem | Tipo | Tratamento | Nota |
|---|---|---|---|---|---|
| Logo (header/rodapé) | `logo-yukusue-146.png` (146×40) | `imagens/imgi_2_…_n.jpg` (150×150) | FOTO REAL (logo) | recorte da faixa do peixe, sem IA | **Provisório.** AJ-04 não foi entregue; exibido em tamanho nativo. Pendência: vetor do cliente. |
| Hero: temaki | `hero-temaki-699.webp` | `imagens/imgi_47_…_n.jpg` | FOTO REAL recortada | texto "eu só estava com fome" + sorriso removidos por **inpainting algorítmico (OpenCV Telea)** só nos pixels do texto; recorte do temaki da frente (rembg isnet) | **Retocada: texto sobreposto removido por algoritmo, confirmar com o cliente antes de publicar.** A área retocada fica quase toda fora do recorte. |
| Hero: salmão em rosa | `hero-salmao-800.webp`, `hero-salmao-1057.webp` | `imagens/imgi_57_…_n.jpg` | FOTO REAL recortada | recorte das fatias, sem o prato (rembg) | recorte de foto real, sem pixel novo |
| Pratos: ceviche | `prato-ceviche-800.webp`, `prato-ceviche-1320.webp` | `imagens/imgi_45_…_n.jpg` | FOTO REAL | **fallback do AJ-01:** crop y 0–1120, acima do texto "CEVICHES FRESCOS E TEMPERADINHOS" | sem pixel novo; quando o AJ-01 chegar, trocar pela foto inteira |
| Pratos: sashimi na pedra de sal | `prato-sashimi-sal-800.webp`, `prato-sashimi-sal-1440.webp` | `imagens/imgi_27_…_n.jpg` | FOTO REAL | só redimensionamento | — |
| Bebidas: drink verde | `drink-verde-616.webp` | `imagens/imgi_48_…_n.jpg` | FOTO REAL recortada | recorte (rembg + máscara manual na borda com a esteira) | recorte de foto real, sem pixel novo |
| Bebidas: drink vermelho | `drink-vermelho-481.webp` | `imagens/imgi_48_…_n.jpg` | FOTO REAL recortada | recorte (rembg isnet + u2net no guarda-chuva) | guarda-chuva cortado na borda direita **já no original** |
| Final: salão | `salao-800.webp`, `salao-1320.webp` | `imagens/imgi_49_…_n.jpg` | FOTO REAL | crop y 0–1180 | mostra rótulo de saquê de terceiro (Azuma Kirin), produto vendido no local |
| Gelo (letras do H1 + faixa do hero) | `plate-gelo-800.webp`, `plate-gelo-1376.webp` | `design/plates/Gemini_Generated_Image_s9ein8s9ein8s9ei.jpg` | PLATE GERADO | só redimensionamento | decorativo abstrato (PLATE-01); não representa nada do cliente |

## Slots sem arquivo / fallbacks adotados
| Slot | Situação | Fallback |
|---|---|---|
| AJ-01 ceviche sem texto | não entregue | crop acima do texto (acima) |
| AJ-02 temaki sem texto | não entregue | inpainting algorítmico local (acima) |
| AJ-03 imgi_30 ampliada | não entregue | não usada: a galeria foi adiada, não faz parte dos 5 blocos do mockup |
| AJ-04 logo em alta | não entregue | logo real em tamanho nativo (146 px) dentro de uma pílula preta; pendência: vetor |
| Fachada | não existe | seção final usa o salão real (`imgi_49`) |

## Não usadas (reserva)
imgi_14, imgi_21, imgi_30, imgi_31, imgi_43, imgi_46, imgi_51, imgi_52, imgi_54.
