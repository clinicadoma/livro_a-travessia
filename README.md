# Clínica Doma — versão modular com carregamento sob demanda

## Última correção: modal renderizando atrás do slide

O arquivo original tinha um `<div id="doma-app-wrapper">` (com
`position: absolute; z-index: 100`) que envolvia TODAS as páginas e
popups, garantindo que os modais (z-index muito mais alto) ficassem
sempre por cima. Ao dividir o arquivo em capítulos, esse wrapper deixou
de ser recriado em tempo de execução — cada capítulo virava um `<div>`
solto, sem um contexto de empilhamento em comum. Resultado: o
navegador não tinha mais como comparar corretamente o z-index do modal
contra o da página, e o slide ativo acabava renderizando por cima.

**Corrigido:** o loader agora recria esse `#doma-app-wrapper` de verdade
antes de carregar qualquer capítulo, e todo capítulo entra dentro dele —
exatamente como no arquivo original. Testado: confirmei que o modal de
"Escolher Intervenção" e a página ativa agora compartilham o mesmo
contexto de empilhamento.

## Sobre a altura do iframe

O Wix não tem uma opção nativa de "altura automática" para esse tipo de
embed — é necessário um pequeno código Velo do lado do Wix que escute a
mensagem que o conteúdo já envia. Isso está fora deste pacote (é código
que vai no Editor do Wix, não no GitHub); veja o arquivo
`velo_altura_automatica.js` enviado separadamente.

## Correções anteriores (recapitulando)

- 3 popups (VIP, loja, "livro" revelável) que moravam num capítulo
  específico mas eram chamados de fora foram promovidos para o capítulo
  inicial (sempre carregado).
- Contagem de páginas corrigida usando um parser HTML de verdade (jsdom),
  em vez de regex, para lidar com comentários malformados e tags como
  `<section>`.

## Arquitetura (recapitulando)

- **124 páginas**, divididas em **36 capítulos**, carregados sob demanda.
- `css/style.css` — todo o CSS, carregado uma única vez.
- `js/core.js` — motor de navegação, carteira, modais, VIP, e as seções
  cujas funções são chamadas de fora do próprio capítulo.
- `html/chunks/*.html` — conteúdo de cada capítulo, buscado sob demanda.
- `manifest.json` — índice de páginas/capítulos.

## Como colocar no ar

1. Suba `css/`, `js/`, `html/` e `manifest.json` para a raiz do
   repositório no GitHub, substituindo os arquivos atuais.
2. `wix-loader.html` está apontando para a branch `main` por enquanto.
   Depois de confirmar que está tudo funcionando, me avise para eu travar
   num commit específico (evita o problema de cache do jsDelivr).
3. Cole o conteúdo de `wix-loader.html` no lugar do embed atual no Wix.
4. Publique e teste em uma aba anônima.

## Pontos para testar

- **Seu Plano Tático** — marcar checkbox, clicar em "Abrir e Escolher
  Intervenção". Se for a primeira vez na sessão, aparece um aviso
  "Acesso Liberado ✅" primeiro (para usuário VIP) — feche esse aviso
  para então ver o modal de escolha.
- **Retrato Falado / Resgate da Criança** e **Pág. 10 (vitrola)** — como
  antes, dependem de um religamento automático; erro no console antes da
  hora certa é inofensivo.

## Arquivos deste pacote

- `build_chunks.js` — regenera tudo a partir do HTML original
  (`node build_chunks.js original.html pasta_saida/`, requer `jsdom`).
- `wix-loader.html` — cole no lugar do embed atual no Wix.
