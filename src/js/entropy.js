/*
    Calculate a Shannon entropy map for a chunk of data. We do this using a
    sliding window, and then computing point entropy at every location.

    data: a Uint8Array
    winlen: size of the sliding window (max 256)
    progress: a callback of the form function(progress), where progress is a
    value betwee 0 and 1.

    Returns an Float32Array of the same length as the input array. Each entry
    is a local entropy value between 0 and 1.
*/

var L256 = Math.log(256);
function _win_entropy(hist){
    var entropy = 0;
    var syms = 0;
    for (i = 0; i < hist.length; i++){
        if (hist[i] > 0){
            syms += 1;
        }
    }
    //var base = Math.log(syms);
    for (var i = 0; i < hist.length; i++){
        if (hist[i] > 0){
            var p = hist[i] / hist.length;
            entropy -= p * (Math.log(p)/L256);
        }
    }
    return entropy;
}


function partial(data, winlen, emap, hist, start, progress, done){
    var progint = Math.floor(data.length/50);
    var win = Math.floor(winlen/2);
    var end = Math.min(start+progint, data.length-win);
    for (var i = start; i < end; i++){
        var wstart = i-win;
        hist[data[wstart]] -= 1;
        hist[data[wstart+winlen-1]] += 1;
        emap[i] = _win_entropy(hist);
    }
    progress(Math.ceil(i/data.length * 100));
    if (i == data.length-win){
        /* Now we patch up the corners */
        for (var x = 0; x < win; x++){
            emap[x] = emap[win];
        }
        /* Now we patch up the corners */
        for (x = data.length-win; x < data.length; x++){
            emap[x] = emap[data.length-win];
        }
        done(emap);
        return;
    }
    setTimeout(
        function(){
            partial(data, winlen, emap, hist, i, progress, done);
        },
        0
    );
}

function entropy(data, winlen, progress, done){
    progress(0);
    var emap = new Float32Array(
       new ArrayBuffer(data.length * Float32Array.BYTES_PER_ELEMENT)
    );
    var hist = new Uint8Array(new ArrayBuffer(256));
    winlen = Math.min(data.length, winlen);
    /* Start by initializing the entropy map */
    for (var i = 0; i < winlen; i++){
        hist[data[i]] += 1;
    }
    partial(data, winlen, emap, hist, Math.floor(winlen/2), progress, done);
}

module.exports = entropy;
