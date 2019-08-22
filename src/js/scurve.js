
// Rotate a two-bit number by one bit
function rot(x) {
    switch(x){
    case 1:
        return 2;
    case 2:
        return 1;
    default:
        return x;
    }
}

function graycode(x) {
    switch(x){
    case 3:
        return 2;
    case 2:
        return 3;
    default:
        return x;
    }
}

/*
    Convert an index on the 2d Hilbert curve to a set of point coordinates.
*/
function hilbert_point(curve, h) {
    //    The bit widths in this function are:
    //        x, y  - curve
    //        h     - curve*2
    //        l     - 2
    //        e     - 2
    var hwidth = curve * 2;
    var e = 0;
    var d = 0;
    var x = 0;
    var y = 0;
    for (var i = 0; i < curve; i++) {
        // Extract 2 bits from h
        var w = (h >> (hwidth - (i*2) - 2)) & 3;

        var l = graycode(w);
        if (d === 0)
            l = rot(l);
        l = l ^ e;
        var bit = 1 << (curve-i-1);
        if (l&2)
            x |= bit;
        if (l&1)
            y |= bit;

        if (w == 3)
            e = 3-e;
        if (w === 0 || w == 3)
            d ^= 1;
    }
    return [x, y];
}

/*
    Convert a point on the Hilbert 2d curve to a set of coordinates.
*/
function hilbert_index(curve, x, y) {
    var h = 0;
    var e = 0;
    var d = 0;
    for (var i = 0; i < curve; i++) {
        // Extract 1 bit from x and y
        var off = curve - i - 1;
        var a = (y >> off) & 1;
        var b = (x >> off) & 1;
        var l = a | b << 1;
        l = l ^ e;
        if (d === 0)
            l = rot(l);
        var w = graycode(l);
        if (w == 3)
            e = 3-e;
        h = (h << 2) | w;
        if (w === 0 || w == 3)
            d ^= 1;
    }
    return h;
}


module.exports = {
    hilbert_point: hilbert_point,
    hilbert_index: hilbert_index,

    /* Private exports for testing */
    _graycode: graycode
};
