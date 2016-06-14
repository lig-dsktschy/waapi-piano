(function() {
    'use strict';

    var isSP, ctx, xml, data, frequencyRatioTempered, keyboards;

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

    // 平均律における、ある音の次の音に対する周波数比(近似値)
    frequencyRatioTempered = 1.059463;

    // 鍵盤要素の集合を配列化する
    keyboards = Array.prototype.slice.call(
        document.getElementsByClassName('keyboard')
    );
    // 高い方から順に、鍵盤要素のクリック/タッチイベントを登録する
    keyboards.reverse().map(function(keyboard, index) {
        var i, frequencyRatio;
        // 基準音から何音はなれているかで、周波数比を求める
        frequencyRatio = 1;
        for (i = 0; i < index; i++) {
            frequencyRatio /= frequencyRatioTempered;
        }
        keyboard.addEventListener(isSP ? 'touchstart' : 'click', function() {
            var bufferSource;
            bufferSource = ctx.createBufferSource();
            bufferSource.buffer = data;
            // 音源再生速度の比率変更で、音源の高さを調整
            bufferSource.playbackRate.value = frequencyRatio;
            bufferSource.connect(ctx.destination);
            bufferSource.start(0);
        });
    });
})();