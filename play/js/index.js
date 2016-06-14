(function() {
    'use strict';

    var isSP, ctx, bufferSource, xml, data;

    // コンテキストを生成
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    ctx = new AudioContext();

    // 音源ファイルをバイナリデータとして取得
    xml = new XMLHttpRequest();
    xml.responseType = 'arraybuffer';
    xml.open('GET', 'media/piano.wav', true);
    xml.onload = function() {
        // 音源ファイルをバイナリデータからデコード
        ctx.decodeAudioData(
            xml.response,
            function(_data) {
                data = _data;
            },
            function(e) {
                alert(e.err);
            }
        );
    };
    xml.send();

    isSP = typeof window.ontouchstart !== 'undefined';

    // クリックで、音源を最終出力に接続し、再生する
    document.body.addEventListener(isSP ? 'touchstart' : 'click', function() {
        // 1回使い捨ての短い音源を扱うAudioNodeを生成
        bufferSource = ctx.createBufferSource();
        // 音源を保持
        bufferSource.buffer = data;
        // 音源から、最終出力へ接続
        bufferSource.connect(ctx.destination);
        // 音源の再生により、接続された処理を開始
        bufferSource.start(0);
    });
})();