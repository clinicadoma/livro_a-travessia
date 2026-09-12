# Clínica Doma — versão modular com carregamento sob demanda

## O que mudou nesta versão

Depois do primeiro deploy, foi reportado que a tela **"Seu Plano Tático"**
travava ao marcar um checkbox e escolher "Intervenção" — o console mostrava
`Cannot read properties of null (reading 'style')`.

**Causa raiz:** alguns **popups/modais únicos** do site (a tela de convite
VIP, a loja de recompensas, e o "livro" revelável) estão fisicamente
escritos no meio de um capítulo específico do arquivo original, mas são
chamados a partir de **outros** capítulos — inclusive do próprio motor de
navegação (`core.js`), que roda desde o início. Se o usuário nunca tivesse
visitado o capítulo onde aquele popup morava, o botão tentava abri-lo e
encontrava `null`.

**Corrigido automaticamente:** o script agora cruza "onde cada popup mora"
com "quem chama esse popup" (a mesma técnica já usada para decidir quais
funções JS viram `core.js`), e promove os popups identificados para o
capítulo inicial, que é sempre carregado. Foram 3 casos:

- `slide-paywall-vip` (tela de convite VIP — a que travou o Plano Tático)
- `modal-loja-doma` (loja de recompensas)
- `CAMADA_ABSOLUTA_LIVRO` (o "livro" revelável / Manual do Domador)

Testado automaticamente: depois da correção, os três elementos existem no
DOM imediatamente após o carregamento inicial, mesmo sem ter navegado por
nenhum outro capítulo.

## Arquitetura (recapitulando)

- **124 páginas**, divididas em **36 capítulos**, carregados sob demanda
  (os pontos de corte são os próprios destinos de navegação do seu Sumário
  e Mapa da Travessia).
- `css/style.css` — todo o CSS, carregado uma única vez.
- `js/core.js` — motor de navegação, carteira, modais, VIP, e as 4 seções
  cujas funções são chamadas de fora do próprio capítulo (detectado
  automaticamente cruzando o próprio código).
- `html/chunks/*.html` — o conteúdo de cada capítulo, buscado sob demanda.
- `manifest.json` — o índice de páginas/capítulos.

Carga inicial ≈ 340KB (era ~1MB no arquivo original), cada capítulo novo
visitado soma só mais alguns KB.

## Como colocar no ar

1. Suba `css/`, `js/`, `html/` e `manifest.json` para a raiz do
   repositório no GitHub, substituindo os arquivos atuais.
2. `wix-loader.html` já está configurado com `clinicadoma/livro_a-travessia`
   na branch `main`. Se mudar de repositório no futuro, edite as variáveis
   `GH_USER` / `GH_REPO` / `GH_REF` no topo do arquivo.
3. Cole o conteúdo de `wix-loader.html` no lugar do embed atual no Wix.
4. Publique e teste em uma aba anônima.

## Pontos para testar manualmente

- **Seu Plano Tático** (o bug reportado) — marcar um checkbox, clicar em
  "Abrir e Escolher Intervenção", confirmar que o modal abre normalmente
  tanto para usuário VIP quanto não-VIP.
- **Retrato Falado / Resgate da Criança** — a ferramenta de desenho em
  canvas. O código original assumia que a tela já existia ao inicializar;
  agora ele tenta de novo automaticamente quando o capítulo carrega (pode
  aparecer um erro inofensivo no console antes da hora certa, sem afetar
  o que o usuário vê).
- **Pág. 10 (vitrola/quiz)** — o botão "Tocar" da música. Mesma lógica de
  retentativa.

Se aparecer qualquer outro botão ou tela sem reação, me manda o console do
DevTools igual da última vez (a mensagem de erro + a pilha de chamadas) —
o mesmo método (cruzar onde cada elemento mora vs. quem o chama) costuma
resolver rápido.

## Arquivos deste pacote

- `build_chunks.js` — script que gera tudo isso a partir do seu HTML
  original. Use `node build_chunks.js original.html pasta_saida/` se
  precisar reprocessar depois de editar o livro original (requer Node.js
  e o pacote `jsdom`: `npm install jsdom`).
- `wix-loader.html` — cole no lugar do embed atual no Wix.
