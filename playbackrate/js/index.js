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

    // レンジ入力のつまみを離すときに、音源を最終出力に接続し、再生する
    document.getElementById('playbackRate')
        .addEventListener(isSP ? 'touchend' : 'mouseup', function(e) {
            // 1回使い捨ての短い音源を扱うAudioNodeを生成
            bufferSource = ctx.createBufferSource();
            // 音源を保持
            bufferSource.buffer = data;
            // 音源再生速度の上下で、音源の高さを調整
            bufferSource.playbackRate.value = e.target.value;
            // 音源から、最終出力へ接続
            bufferSource.connect(ctx.destination);
            // 音源の再生により、接続された処理を開始
            bufferSource.start(0);
        });
})();