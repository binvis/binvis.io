
var curves = require("./curves");
var colours = require("./colours");


module.exports = {
    DefaultCurve: curves.Cluster.name,
    DefaultColors: colours.ByteClass.prototype.name,

    ViewWidth: 256,
    ViewHeight: 1024,

    FocusBlocks: 20,
    FocusBlockLen: 16,

    HexHoverFill: "#f0f3a9",

    creeper_fill_color: "rgba(100, 100, 100, 0.2)",
    creeper_border_color: "#f2ed85",
    creeper_border_width: 2,

    zoom_in: 2,
    zoom_out: 0.5
};
