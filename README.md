# Clínica Doma — versão modular com carregamento sob demanda

## Ajuste desta versão: altura mais responsiva na troca de capítulo

O seu sistema de auto-altura (o código de página que você já tinha no
Wix, escutando `embedded-auto-height`) continua sendo a forma certa de
fazer isso — o Velo não suporta `$w().height` para esse tipo de embed.

O que mudei: antes, o recálculo de altura só rodava a cada 300ms (um
intervalo fixo). Isso significa que, bem no momento em que um capítulo
novo termina de carregar, podia levar até 300ms para o tamanho reportado
refletir a mudança — o que pode ter contribuído para a instabilidade que
você notou. Agora, a altura é recalculada **imediatamente** depois que um
capítulo carrega ou a página muda (e mais uma vez 250ms depois, para
pegar imagens que ainda estavam carregando).

Se a instabilidade persistir depois disso, me conta exatamente como ela
aparece (atraso, "pulo" de tamanho, ou falha em ajustar) que eu continuo
investigando — pode ser algo do lado do Wix (os seletores `.vWU4ML` são
nomes de classe internos e gerados automaticamente pelo Wix, então
podem mudar sem aviso em atualizações da plataforma).

## Novo: script único para regenerar tudo sem perder os ajustes manuais

Esse pacote tem 2 ajustes que não fazem parte do `build_chunks.js`
(a vitrola do capítulo 10 e a troca do motor de navegação). Antes, eu
tinha que reaplicá-los manualmente toda vez que reprocessava o arquivo
original — e numa dessas esqueci, o que causou o retrocesso do fix do
z-index. Agora existe `montar_tudo.sh`, que faz tudo de uma vez:

```
./montar_tudo.sh original.html saida/
```

## Correções anteriores (recapitulando)

- **Modal atrás do slide (z-index):** o `#doma-app-wrapper` (que agrupa
  páginas e popups num mesmo contexto de empilhamento) agora é recriado
  em tempo de execução.
- **`abrirModalSenhaVIP is not defined`:** a análise agora repete depois
  de cada promoção de popup, pegando automaticamente novas dependências
  que isso revela.
- 3 popups (loja, "livro" revelável, VIP) promovidos ao capítulo inicial.
- Contagem de páginas usando parser HTML de verdade (jsdom).

## ⚠️ Lembrete importante

O `wix-loader.html` **não é buscado do GitHub** pelo site — precisa ser
colado manualmente no componente HTML do Wix toda vez que muda.

## Arquitetura

- **124 páginas**, **36 capítulos**, carregados sob demanda.
- `css/style.css` — todo o CSS, carregado uma vez.
- `js/core.js` — motor de navegação, carteira, modais, VIP, e as seções
  cujas funções/popups são usados de fora do próprio capítulo.
- `html/chunks/*.html` — conteúdo de cada capítulo, sob demanda.
- `manifest.json` — índice de páginas/capítulos.

## Como colocar no ar

1. Suba `css/`, `js/`, `html/` e `manifest.json` para a raiz do
   repositório no GitHub, substituindo os atuais.
2. **Cole o conteúdo de `wix-loader.html` no componente HTML do Wix.**
3. Publique e teste em uma aba anônima.

## Pontos para testar

- **Altura do iframe** — deve ajustar mais rápido na troca de capítulo.
- **Modal "Escolher Intervenção"** e **"tenho uma senha"** — devem abrir
  por cima do slide.
- **Seu Plano Tático**, **Retrato Falado**, **vitrola do capítulo 10** —
  como antes.

## Arquivos deste pacote

- `build_chunks.js` — gera tudo a partir do HTML original.
- `montar_tudo.sh` — roda `build_chunks.js` e já aplica os 2 ajustes
  manuais de uma vez (`./montar_tudo.sh original.html saida/`).
- `wix-loader.html` — cole no componente HTML do Wix.
