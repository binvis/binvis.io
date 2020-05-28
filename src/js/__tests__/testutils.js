function testpattern_arraybuf(length) {
    var buf = new ArrayBuffer(length);
    var view = new Uint8Array(buf);
    for (var i = 0; i < view.length; i++) {
        view[i] = i;
    }
    return buf;
}

function random_arraybuf(length) {
    var buf = new ArrayBuffer(length);
    var view = new Uint8Array(buf);
    for (var i = 0; i < view.length; i++) {
        view[i] = Math.floor(Math.random() * 256);
    }
    return buf;
}

module.exports = {
    testpattern_arraybuf: testpattern_arraybuf,
    random_arraybuf: random_arraybuf
};
