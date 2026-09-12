// Cole isso no código da PÁGINA "Livro A Travessia 3" (não precisa ir no
// masterPage.js, a menos que esse mesmo embed apareça em várias páginas).
//
// O conteúdo do embed já envia mensagens do tipo "embedded-auto-height"
// toda vez que o tamanho do slide/modal ativo muda (a cada 300ms, só
// quando há diferença real). Isso aqui escuta essas mensagens e ajusta
// a altura do componente #html38 de acordo.

$w.onReady(function () {
    $w("#html38").onMessage((event) => {
        const dados = event.data;
        if (dados && dados.type === "embedded-auto-height" && typeof dados.height === "number") {
            $w("#html38").height = dados.height;
        }
    });
});
