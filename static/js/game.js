function init() {
    $("#navbar-container").load("/static/html/navbar.html");
    createUnityInstance(document.querySelector("#unity-canvas"), {
        dataUrl: "/game/game-build/GraphiteGame.data.unityweb",
        frameworkUrl: "/game/game-build/GraphiteGame.framework.js.unityweb",
        codeUrl: "/game/game-build/GraphiteGame.wasm.unityweb",
        streamingAssetsUrl: "StreamingAssets",
        companyName: "Daniel Lovett",
        productName: "Graphite",
        productVersion: "1.0"
    });
}

window.addEventListener("DOMContentLoaded", function (evt) {
    init();
})