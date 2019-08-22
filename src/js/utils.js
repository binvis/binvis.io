var SparkMD5 = require("spark-md5");
var crypto = require("crypto-browserify");

function savename(name, data, view){
    if (name.lastIndexOf("/") > -1){
        name = name.substr(name.lastIndexOf("/")+1, name.length);
    }
    if (name.lastIndexOf(".") > 0){
        name = name.substr(0, name.lastIndexOf("."));
    }
    if (!data.eq(view)){
        return name + "-" + view.start + "-" + view.end;
    }
    return name;
}

/* Making this work cross-browser is delicate. Change at your peril. */
function mouse_coords(e) {
    var posx = 0;
    var posy = 0;
    if (!e)
        e = window.event;
    if (e.pageX || e.pageY)     {
        posx = e.pageX;
        posy = e.pageY;
    }
    else if (e.clientX || e.clientY)    {
        posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    var rect = e.target.getBoundingClientRect();
    return [posx - rect.left, posy-rect.top];
}

function num(n, base, width) {
    var v = n.toString(base);
    while (v.length < width)
        v = "0" + v;
    return v;
}

function canvas_offset(viewlen, offset, w, h){
    return Math.floor((offset / viewlen) * (w * h));
}

function view_offset(point, viewlen, curve, w, h) {
    var visual_offset = curve.point_to_offset(point, w, h);
    return Math.floor((viewlen / (w * h)) * visual_offset);
}

function formatsize (bytes) {
    if (bytes === 0)
        return "0";
    var prefix = ["b", "kb", "mb", "gb", "tb"];
    for (var i = 0; i < prefix.length; i++){
        if (Math.pow(1024, i + 1) > bytes){
            break;
        }
    }
    var precision;
    if (bytes%Math.pow(1024, i) === 0)
        precision = 0;
    else
        precision = 1;
    return (bytes/Math.pow(1024, i)).toFixed(precision) + prefix[i];
}

function calculate_hashes(data){
    return {
        // FIXME: crypto MD5 gives an error at the moment. Remove SparkMD5 once that's
        // fixed.
        "md5": SparkMD5.ArrayBuffer.hash(data),
        "sha1": crypto.createHash("sha1").update(data).digest("hex"),
        "sha256": crypto.createHash("sha256").update(data).digest("hex")
    };
}

module.exports = {
    num: num,
    calculate_hashes: calculate_hashes,
    mouse_coords: mouse_coords,
    view_offset: view_offset,
    canvas_offset: canvas_offset,
    savename: savename,
    formatsize: formatsize
};
