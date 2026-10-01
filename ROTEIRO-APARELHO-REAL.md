# ROTEIRO-APARELHO-REAL.md — checklist para iPhone e Android

Testar o site **publicado em HTTPS** (ou numa URL de pré-visualização), não o arquivo aberto do disco.
Aparelhos mínimos: **1 iPhone com Safari** (iOS 16+; idealmente também um iOS 15) e **1 Android intermediário com Chrome** (4 GB de RAM ou menos). Se possível, um celular topo de linha de cada.

Marque ✅ / ❌ e anote o modelo, a versão do sistema e um print ou vídeo de cada ❌.

## 1. Carregamento
- [ ] Primeira tela aparece em até ~1 s em 4G (título YUKUSUE + gelo + começo dos pratos), sem tela branca
- [ ] Nenhum texto "pisca" trocando de fonte de forma brusca (a troca rápida para Cinzel/Instrument Sans é esperada)
- [ ] Nada aparece e some ao terminar de carregar (a cena dos pratos não pode piscar)

## 2. Layout em pé e deitado
- [ ] Sem rolagem lateral em nenhum ponto (arraste a página para os lados)
- [ ] Menu com 4 links + telefone legíveis; toque fácil em cada um (área ≥ 44 px)
- [ ] A fita de água fica na borda esquerda e não cobre texto das avaliações
- [ ] **Deitado (paisagem):** a fita esticada parece natural; o botão de pausa (ícone) não cobre conteúdo importante
- [ ] Endereço, horário e botão "Ligar" legíveis na seção escura

## 3. Motion (o "cinema")
- [ ] **iPhone:** a rolagem é estável e as cenas acompanham o dedo sem tremer ou dar saltos
- [ ] O mergulho do hero (título se dissolvendo, cena crescendo) acontece durante a rolagem e se desfaz ao voltar
- [ ] Bambu e pratos sobem ao entrar; drinks sobem; citações aparecem palavra por palavra; a nota conta até 4,3
- [ ] Corredor da seção escura "abre" ao chegar no fim
- [ ] Rolar MUITO rápido até o fim e voltar ao topo: nada fica invisível ou pela metade
- [ ] Tocar em "Pratos", "Bebidas", "Avaliações" e "Onde estamos" no menu: rola até a seção certa e tudo aparece
- [ ] **Android intermediário:** fluido (sem engasgos visíveis). Anote se a rolagem fica "pesada"
- [ ] Bateria e aquecimento: 2 min rolando para cima e para baixo sem aquecer de forma anormal

## 4. Botão de pausa e acessibilidade
- [ ] Botão de pausa (canto inferior direito): tocar pausa tudo; tocar de novo retoma
- [ ] Recarregar a página após pausar: continua pausado (preferência salva)
- [ ] **Reduzir movimento ligado** (iOS: Ajustes › Acessibilidade › Movimento; Android: Remover animações): sem cinema, só fades curtos; o botão de pausa não aparece
- [ ] **Texto grande** (iOS: Tamanho do Texto no máximo; Android: Tamanho da fonte no máximo): nada cortado ou sobreposto
- [ ] **VoiceOver / TalkBack:** lê o título, os 3 títulos de seção, as descrições das imagens de comida e o botão "Pausar animações / Retomar animações" com o estado

## 5. Ações reais
- [ ] "(11) 4121-5552" no topo e o botão "Ligar" abrem o discador com o número certo
- [ ] O endereço abre o Google Maps no local correto
- [ ] (quando existirem) "Pedir on-line" e "WhatsApp" abrem o destino certo

## 6. Compartilhamento (depois do domínio)
- [ ] Colar o link no WhatsApp: aparece a prévia com a imagem do gelo, o título e a descrição
- [ ] Adicionar à tela de início (iOS e Android): o ícone é o logo do Yukusue

## 7. Medição
- [ ] PageSpeed Insights (pagespeed.web.dev) na URL publicada, celular: anotar Performance, LCP e CLS (referência local: 91–93, CLS 0)
