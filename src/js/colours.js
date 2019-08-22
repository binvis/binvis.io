
var entropy = require("./entropy");
var chroma = require("chroma-js");

/* A simple traversal of the Hilbert colour cube */
_detail = [
    "#000000", "#002020", "#203f1f", "#3f1f20", "#400000", "#602000", "#7f1f20", "#5f203f",
    "#400040", "#602040", "#7f1f60", "#5f207f", "#3f007f", "#1f005f", "#202040", "#1f3f60",
    "#3f407f", "#1f405f", "#206040", "#1f7f60", "#407f7f", "#605f7f", "#7f605f", "#5f5f40",
    "#407f3f", "#605f3f", "#7f601f", "#5f5f00", "#3f7f00", "#3f5f20", "#1f401f", "#006020",
    "#008000", "#20a000", "#3f9f20", "#1fa03f", "#008040", "#208060", "#1fa07f", "#20bf5f",
    "#00c040", "#20c060", "#1fe07f", "#20ff5f", "#00ff3f", "#00df1f", "#20c020", "#3fe01f",
    "#40ff3f", "#40df1f", "#60c020", "#7fe01f", "#7fff40", "#5fff60", "#60df7f", "#5fc05f",
    "#7fbf40", "#5fbf60", "#609f7f", "#5f805f", "#7f803f", "#5fa03f", "#409f1f", "#60a000",
    "#808000", "#a0a000", "#bf9f20", "#9fa03f", "#808040", "#a08060", "#9fa07f", "#a0bf5f",
    "#80c040", "#a0c060", "#9fe07f", "#a0ff5f", "#80ff3f", "#80df1f", "#a0c020", "#bfe01f",
    "#c0ff3f", "#c0df1f", "#e0c020", "#ffe01f", "#ffff40", "#dfff60", "#e0df7f", "#dfc05f",
    "#ffbf40", "#dfbf60", "#e09f7f", "#df805f", "#ff803f", "#dfa03f", "#c09f1f", "#e0a000",
    "#ff7f00", "#df7f20", "#e05f3f", "#df401f", "#ff3f00", "#ff1f20", "#df001f", "#c02020",
    "#bf3f00", "#bf1f20", "#9f001f", "#802020", "#804000", "#a06000", "#bf5f20", "#9f603f",
    "#804040", "#a06040", "#bf5f60", "#9f607f", "#803f7f", "#801f5f", "#a00060", "#bf205f",
    "#c03f7f", "#c01f5f", "#e00060", "#ff205f", "#ff407f", "#df405f", "#e06040", "#df7f60",
    "#ff7f80", "#df7fa0", "#e05fbf", "#df409f", "#ff3f80", "#ff1fa0", "#df009f", "#c020a0",
    "#bf3f80", "#bf1fa0", "#9f009f", "#8020a0", "#804080", "#a06080", "#bf5fa0", "#9f60bf",
    "#8040c0", "#a060c0", "#bf5fe0", "#9f60ff", "#803fff", "#801fdf", "#a000e0", "#bf20df",
    "#c03fff", "#c01fdf", "#e000e0", "#ff20df", "#ff40ff", "#df40df", "#e060c0", "#df7fe0",
    "#ff80ff", "#dfa0ff", "#c09fdf", "#e0a0c0", "#ff80bf", "#df809f", "#e0a080", "#dfbfa0",
    "#ffc0bf", "#dfc09f", "#e0e080", "#dfffa0", "#ffffc0", "#ffdfe0", "#dfc0df", "#c0e0e0",
    "#bfffc0", "#bfdfe0", "#9fc0df", "#80e0e0", "#80ffbf", "#a0ff9f", "#9fdf80", "#a0c0a0",
    "#80bfbf", "#a0bf9f", "#9f9f80", "#a080a0", "#8080c0", "#a0a0c0", "#bf9fe0", "#9fa0ff",
    "#7f80ff", "#5fa0ff", "#409fdf", "#60a0c0", "#7f80bf", "#5f809f", "#60a080", "#5fbfa0",
    "#7fc0bf", "#5fc09f", "#60e080", "#5fffa0", "#7fffc0", "#7fdfe0", "#5fc0df", "#40e0e0",
    "#3fffc0", "#3fdfe0", "#1fc0df", "#00e0e0", "#00ffbf", "#20ff9f", "#1fdf80", "#20c0a0",
    "#00bfbf", "#20bf9f", "#1f9f80", "#2080a0", "#0080c0", "#20a0c0", "#3f9fe0", "#1fa0ff",
    "#007fff", "#005fdf", "#2040e0", "#3f60df", "#407fff", "#605fff", "#7f60df", "#5f5fc0",
    "#407fbf", "#605fbf", "#7f609f", "#5f5f80", "#3f7f80", "#1f7fa0", "#205fbf", "#1f409f",
    "#3f3f80", "#1f3fa0", "#201fbf", "#1f009f", "#400080", "#602080", "#7f1fa0", "#5f20bf",
    "#4000c0", "#6020c0", "#7f1fe0", "#5f20ff", "#3f00ff", "#3f20df", "#1f3fe0", "#ffffff"
];

function Detail(){}
Detail.prototype.name = "detail";
Detail.prototype.description =
    "Byte classification scheme. Simple, but informative.";
Detail.prototype.key = [
    ["0x00", _detail[0x00] ],
    ["0x40", _detail[0x40] ],
    ["0x80", _detail[0x80] ],
    ["0xc0", _detail[0xc0] ],
    ["0xff", _detail[0xff] ]
];
Detail.prototype.color_value = function(c){
    return _detail[c];
};
Detail.prototype.color = function(offset, data) {
    var c = data[offset];
    return this.color_value(c);
};


function ByteClass(){}
ByteClass.prototype.name = "byteclass";
ByteClass.prototype.description =
    "Byte classification scheme. Simple, but informative.";
ByteClass.prototype.key = [
    ["0x00", "#000000"],
    ["low", "#4daf4a"],
    ["ascii", "#1072b8"],
    ["high", "#e41a1c"],
    ["0xff", "#ffffff"]
];
ByteClass.prototype.color_value = function(c){
    ascii = "#1072b8";
    nul = "#000000";
    ff = "#ffffff";
    ctl = "#4daf4a";
    high = "#e41a1c";

    if (c === 0)
        return nul;
    else if (c == 255)
        return ff;
    else if (c >= 32 && c <= 126)
        return ascii;
    else if (c == 9 || c == 10 || c == 13)
        return ascii;
    else if (c < 32)
        return ctl;
    return high;
};
ByteClass.prototype.color = function(offset, data) {
    var c = data[offset];
    return this.color_value(c);
};


// Uses chroma.js. Colors prototyped with this:
// http://gka.github.io/palettes
// Article:
// https://vis4.net/blog/posts/mastering-multi-hued-color-scales/
function ByteMagnitude(){
    var c = chroma.bezier(
        [ "#000000", "#90005e", "#21daff"]
    );
    var cs = chroma.scale(c).mode("lab").correctLightness(true);
    this._colors = [];
    for (var i = 0; i < 256; i++){
        this._colors.push(
            cs(i/256.0).hex()
        );
    }
    this.key = [
        ["0x00", this._colors[0x00]],
        ["0x40", this._colors[0x40]],
        ["0x80", this._colors[0x80]],
        ["0xc0", this._colors[0xc0]],
        ["0xff", this._colors[0xff]]
    ];
}
ByteMagnitude.prototype.name = "magnitude";
ByteMagnitude.prototype.description = "Byte magnitude.";
ByteMagnitude.prototype.color_value = function(c){
    return this._colors[c];
};
ByteMagnitude.prototype.color = function (offset, data) {
    var c = data[offset];
    return this.color_value(c);
};


function Entropy(){
    this.key = [
        ["ordered", this.entropy_color(0)],
        ["low", this.entropy_color(0.25)],
        ["medium", this.entropy_color(0.5)],
        ["high", this.entropy_color(0.75)],
        ["random", this.entropy_color(1)]
    ];
    this._cache = null;
}
Entropy.prototype.name = "entropy";
Entropy.prototype.description =
    "Local entropy calculated over a sliding window.";
Entropy.prototype.entropy_color = function(e){
    function curve(v){
        f = Math.pow(4*v - 4*Math.pow(v, 2), 4);
        f = Math.max(f, 0);
        return f;
    }
    var r = 0;
    if (e > 0.5){
        r = curve(e-0.5);
    }
    var b = Math.pow(e, 2);
    var ret = "rgb(" + Math.floor(255*r) + ", 0, "  + Math.floor(255*b) + ")";
    return ret;
};
Entropy.prototype.color_value = function(c){
    return this.entropy_color(c/256.0);
};
Entropy.prototype.prepare = function(data, progress, done){
    var self = this;
    this.prepared = false;
    this.preparing = true;
    function donewrap(emap){
        self._cache = emap;
        self.prepared = true;
        self.preparing = false;
        done();
    }
    entropy(data, 128, progress, donewrap);
};
Entropy.prototype.color = function(offset, data) {
    var e = this._cache[offset] * 1.9;
    return this.entropy_color(e);
};


function ColorSchemes(){
    return [
        new ByteClass(),
        new ByteMagnitude(),
        new Entropy(),
        new Detail()
    ];
}

module.exports = {
    ColorSchemes: ColorSchemes,
    ByteClass: ByteClass,
    ByteMagnitude: ByteMagnitude,
    Entropy: Entropy,
    Detail: Detail
};
