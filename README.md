# Clínica Doma — versão modular com carregamento sob demanda

## O que mudou

A versão anterior só tinha *dividido* o arquivo em 3 pedaços, mas ainda
carregava tudo de uma vez — não economizava memória nenhuma. Esta versão
carrega de verdade **só o capítulo que o usuário está vendo**, e busca os
próximos conforme ele avança ou pula pelo Sumário/Mapa da Travessia.

- **124 páginas**, divididas em **36 capítulos** (os pontos de corte são os
  próprios destinos de navegação já usados no seu Sumário e Mapa da
  Travessia — ex: `pag-10`, `pag-tribunal-intro`, `resgate-crianca` etc.)
- `css/style.css` — todo o CSS, carregado uma única vez (é texto leve,
  não compensa fatiar).
- `js/core.js` — o motor de navegação, carteira de moedas, modais, VIP, e
  as **4 seções cujas funções são chamadas de fora do seu próprio capítulo**
  (detectado automaticamente cruzando o próprio código — não foi um chute).
  Sempre carregado.
- `html/chunks/*.html` — o conteúdo de cada capítulo, buscado **só quando o
  usuário chega perto dele**.
- `manifest.json` — o índice: em qual arquivo está cada página.

Resultado: a carga inicial cai de ~1MB para ~340KB (CSS + core.js + primeiro
capítulo), e cada novo capítulo visitado soma só mais alguns KB (o maior tem
134KB, a maioria fica entre 5–45KB) — em vez de carregar o livro inteiro de
uma vez.

## Por que 4 capítulos foram parar no core.js

Alguns capítulos têm funções chamadas por **outros** capítulos (ex: o teste
rápido em `pag-21` chama uma função que só existe dentro do capítulo
`pag-10`). Se essa função só existisse dentro do capítulo `pag-10` e o
usuário nunca tivesse passado por ali, o clique quebraria. Por isso essas 4
seções (`pag-10`, `pag-proximo-nivel`, `resgate-crianca`, `pag-72`) sempre
carregam de início — o HTML delas continua sendo buscado sob demanda, só o
JavaScript é que fica disponível desde o começo.

## Como colocar no ar

1. Suba as pastas `css/`, `js/`, `html/` e o arquivo `manifest.json` para a
   raiz de um repositório **público** no GitHub.
2. Abra `wix-loader.html` e troque:
   ```js
   var GH_USER = "SEU-USUARIO-GITHUB";
   var GH_REPO = "SEU-REPOSITORIO";
   var GH_REF  = "main";
   ```
   Em produção, prefira uma tag de release (`v1.0.0`) em vez de `main`, para
   não depender do cache de até 7 dias que o jsDelivr mantém para a branch.
3. No Wix, substitua o embed atual pelo conteúdo de `wix-loader.html`.
4. Publique e teste em uma aba anônima.

## Pontos para testar manualmente com atenção

O sistema foi testado automaticamente (navegação sequencial pelas 124
páginas e saltos diretos para os principais pontos do menu, tudo com 0
erros), mas duas telas tiveram um ajuste manual específico e merecem um
teste visual de verdade no navegador:

- **Retrato Falado / Resgate da Criança** — a ferramenta de desenho em
  canvas. O código original inicializava isso assumindo que a tela já
  existia; agora ele "tenta de novo" automaticamente assim que o capítulo
  carrega (pode aparecer um erro inofensivo no console do navegador nas
  vezes em que tenta antes da hora — não afeta nada visível).
- **Pág. 10 (vitrola/quiz)** — o botão "Tocar" da música. Mesma lógica de
  re-tentativa.

Se algum outro botão específico não responder em produção, me avise qual
página e o que deveria acontecer — dá pra rastrear rapidamente com esse
mesmo método (cruzar quem chama o quê entre capítulos).

## Arquivos deste pacote

- `build_chunks.js` — o script que gerou tudo isso a partir do seu HTML
  original. Use `node build_chunks.js original.html pasta_saida/` se
  precisar reprocessar depois de editar o livro original.
- `wix-loader.html` — cole isso no lugar do embed atual no Wix.
