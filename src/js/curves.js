
var scurve = require("./scurve");
var ds = require("./datastructures");


Cluster = {
    name: "cluster",
    /* Canvas offset to canvas point */
    curves: {
        2: 1,
        4: 2,
        8: 3,
        16: 4,
        32: 5,
        64: 6,
        128: 7,
        256: 8
    },
    offset_to_point: function (offset, canvas_width, canvas_height) {
        var block = Math.floor(offset / (canvas_width * canvas_width));
        var sub_offset = offset % (canvas_width * canvas_width);
        var points = scurve.hilbert_point(
            this.curves[canvas_width], sub_offset
        );
        /*  Now adjust Y for block offset */
        points[1] = points[1] + (block * canvas_width);
        return new ds.Point(points[0], points[1]);
    },
    /* Canvas point to canvas offset */
    point_to_offset: function (point, canvas_width, canvas_height) {
        var block = Math.floor(point.y / canvas_width);
        var offset = scurve.hilbert_index(
            this.curves[canvas_width], point.x, point.y - (block * canvas_width)
        );
        return offset + block * (canvas_width * canvas_width);
    }
};


Scan = {
    name: "scan",
    /* Canvas offset to canvas point */
    offset_to_point: function (offset, canvas_width, canvas_height) {
        var y = Math.floor(offset / canvas_width);
        var x = offset % canvas_width;
        if (y%2 === 1){
            x = canvas_width - x - 1;
        }
        return new ds.Point(x, y);
    },
    /* Canvas point to canvas offset */
    point_to_offset: function (point, canvas_width, canvas_height) {
        var x = point.x;
        if (point.y%2 === 1){
            x = canvas_width - x - 1;
        }
        return (point.y * canvas_width) + x;
    }
};


Curves = {};
Curves[Cluster.name] = Cluster;
Curves[Scan.name] = Scan;


CurveList = [
    Cluster,
    Scan
];

module.exports = {
    Curves: Curves,
    CurveList:  CurveList,

    Cluster: Cluster,
    Scan: Scan
};
