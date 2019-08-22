
var _ = require("lodash");

/* Circularly rotate array by count */
Array.prototype.rotate = (function() {
    // save references to array functions to make lookup faster
    var push = Array.prototype.push,
        splice = Array.prototype.splice;

    return function(count) {
        var len = this.length >>> 0; // convert to uint
        count = count >> 0; // convert to int

        // convert count to value in range [0, len[
        count = ((count % len) + len) % len;

        // use splice.call() instead of this.splice() to make function generic
        push.apply(this, splice.call(this, 0, count));
        return this;
    };
})();


/*
    Is this array equal to other in some circular rotation?

    This is a slow function meant for testing only.
*/
Array.prototype.roteq = function(other) {
    if (this.length != other.length)
        return false;
    var o = other.slice(0);
    for (var i = 0; i < other.length; i++){
        if (_.isEqual(this, o))
            return true;
        o.rotate(1);
    }
    return false;
};


Array.prototype.rprevi = function(i){
    if (i === 0)
        return this.length - 1;
    else
        return i-1;
};

Array.prototype.rnexti = function(i){
    return (i+1)%this.length;
};

Array.prototype.rprev = function(i){
    return this[this.rprevi(i)];
};

Array.prototype.rnext = function(i){
    return this[this.rnexti(i)];
};


/* Takes an array of [x, y] tuples, returns an array of Point objects. */
function Points(arr){
    return _.map(
        arr,
        function(x){return new Point(x[0], x[1]);}
    );
}

/* A 2d Cartesian point */
function Point(x, y) {
    this.x = x;
    this.y = y;
}
Point.prototype.sub = function(other){
    return new Point(
        this.x - other.x,
        this.y - other.y
    );
};
Point.prototype.add = function(other){
    return new Point(
        this.x + other.x,
        this.y + other.y
    );
};
Point.prototype.scale = function(s){
    return new Point(
        Math.floor(this.x * s),
        Math.floor(this.y * s)
    );
};
/* Cardinal neighbours, traversed clockwise, starting at 12 o'clock */
Point.prototype.neighbours = function(){
    return [
        new Point(this.x, this.y - 1),
        new Point(this.x + 1, this.y),
        new Point(this.x, this.y + 1),
        new Point(this.x - 1, this.y)
    ];
};
Point.prototype.eq = function(other){
    if (this.x === other.x && this.y === other.y)
        return true;
    return false;
};
Point.prototype.toString = function () {
    return "[" + this.x + ", " + this.y + "]";
};
Point.prototype.distance = function (other) {
    var dx = this.x - other.x;
    var dy = this.y - other.y;
    return Math.sqrt((dx * dx) + (dy * dy));
};


function Rect(x, y, w, h) {
    this.point = new Point(x, y);
    this.w = w || 1;
    this.h = h || 1;
}
Rect.prototype.toString = function () {
    return "Rect(" +
        this.point.x + ", " +
        this.point.y + ", " +
        this.w + ", " +
        this.h + ")";
};
// Scale by a factor f, in a way that gives consistent results.
Rect.prototype.scale = function (f) {
    // Warning: this is subtle. We can't scale dimensions and co-ordinates
    // separately without getting inconsistent results when amalgamating
    // rectangles. Instead, we convert to the co-ordinate system, scale, then
    // convert back.
    var sx = Math.floor(this.point.x * f);
    var sy = Math.floor(this.point.y * f);
    var sw = Math.ceil((this.point.x+this.w) * f) - sx;
    var sh = Math.ceil((this.point.y+this.h) * f) - sy;
    return new Rect(sx, sy, sw, sh);
};
Rect.prototype.contains = function(p){
    if (p.x >= this.point.x && p.x < this.point.x + this.w)
        if (p.y >= this.point.y && p.y < this.point.y + this.h)
            return true;
    return false;
};


/* A rectilinear polygon defined by an array of corner points. Points are a
clockwise traversal, with the last point connecting to the first. */
function Polygon(points){
    this.points = points;
}

Polygon.prototype.toString = function(){
    var s = "[\n";
    for (var i = 0; i < this.points.length; i++){
        s = s + "\t" + this.points[i].toString() + "\n";
    }
    s = s + "]";
    return s;
};


/*
_next chooses the next pixel to move to. This is the core function that allows
us to construct a rectilinear polygon by following its boundary in a clockwise
direction.

points is an array of points, arranged as follows:
               
     +---+---+---+ 
     |   |   |   | 
     |   | 0 |   | 
     |   |   |   | 
     +-----------+ 
     |   |   |   | 
     | 3 | x | 1 | 
     |   |   |   | 
     +-----------+ 
     |   |   |   | 
     |   | 2 |   | 
     |   |   |   | 
     +---+---+---+ 


In the diagram above, x is the current point, and the array is rotated so that
3 is the pixel we came from. By definition, x and 3 are always within but on
the edge of the curve.

oncurve: a function that takes a point, and returns true if the point
within the polygon, and false otherwise.

*/
Polygon._next = function(points, oncurve){
    for (var i = 0; i < points.length; i++){
        if (oncurve(points[i])){
            return points[i];
        }
    }
    throw new Error("This should never happen");
};

/*
_start finds the initial vector for the beginning of the polygon perimeter
mapping. It works by walking upwards until it hits the edge of the curve.
From there, we know that the only valid directions are right or back down.

point: Any point anywhere in the polygon.
oncurve: a function that takes a point, and returns true if the point
within the polygon, and false otherwise.

Returns a [from, current] tuple where "from" is the notionally previous point,
and current is the current position.
*/
Polygon._start = function(point, oncurve){
    for (;;){
        var next = new Point(point.x, point.y-1);
        if (oncurve(next)){
            point = next;
        } else {
            var right = new Point(point.x + 1, point.y);
            if (oncurve(right)){
                return [point, right];
            }
            var down = new Point(point.x, point.y + 1);
            if (oncurve(down)){
                return [point, down];
            }
            var left = new Point(point.x-1, point.y);
            if (oncurve(left)){
                return [point, left];
            }
            return null;
        }
    }
};

/*
Construct a point array from a polygon.

point: A point anywhere within the polygon.
oncurve: a function that takes a point, and returns true if the point
within the polygon, and false otherwise.

returns an array of points, which are a clockwise traversal of the polygon
perimiter, where each point is the upper-left co-ordinate of a point
*/
Polygon.construct = function(point, oncurve){
    var start = Polygon._start(point, oncurve);
    if (!start){
        return [point];
    }
    var current = start;

    var points = [];
    var cnt = 0;
    for (;;) {
        cnt += 1;
        var n = current[1].neighbours();
        var i = 0;
        while (i < n.length){
            if (n[i].eq(current[0])){
                break;
            }
            i++;
        }
        n.rotate(i+1);
        var next = [
            current[1],
            Polygon._next(n, oncurve)
        ];
        points.push(next[1]);
        // We terminate when we're at our start point, and going in the same
        // direction.
        if (next[0].eq(start[0]) && next[1].eq(start[1])){
            break;
        }
        current = next;
    }
    return points;
};

/* Trim an array of points, leaving only corners. Points must be a complete
/* clockwise traversal of a rectilinear polygon. Note that points CAN occur
/* multiple times and even multiple times in a row when we have a one-
/* dimensional section. */
Polygon.trim = function(points){
    var ret = [];
    var nil = new Point(0, 0);
    if (points.length < 2){
        ret = points.slice(0);
    } else {
        for (var i = 0; i < points.length; i++){
            var prev = points.rprev(i);
            var next = points.rnext(i);
            var current = points[i];

            var a = current.sub(prev);
            var b = next.sub(current);

            if (a.eq(nil) || b.eq(nil) || !a.eq(b))
                ret.push(current);
        }
    }
    return ret;
};


/* Turn a perpendicular vector into a magnitude-less direction string

returns: l | r | u | d
*/

function dir(v){
    if (v.x > 0)
        return "r";
    else if (v.x < 0)
        return "l";
    else if (v.y > 0)
        return "d";
    else if (v.y < 0)
        return "u";
}


Polygon.outline = function(points){
    if (points.length < 2){
        var f = points[0];
        return [
            f,
            new Point(f.x + 1, f.y),
            new Point(f.x + 1, f.y + 1),
            new Point(f.x, f.y + 1)
        ];
    }
    var ret = [];
    for (var i = 0; i < points.length; i++){
        var prev = points.rprev(i);
        var next = points.rnext(i);
        var p = points[i];

        var corner = dir(p.sub(prev)) + dir(next.sub(p));
        switch (corner){
        /* Outer corners */
        case "rd":
            ret.push(new Point(p.x + 1, p.y));
            break;
        case "dl":
            ret.push(new Point(p.x + 1, p.y + 1));
            break;
        case "lu":
            ret.push(new Point(p.x, p.y + 1));
            break;
        case "ur":
            ret.push(p);
            break;

        /* Inner corners */
        case "dr":
            ret.push(new Point(p.x + 1, p.y));
            break;
        case "ld":
            ret.push(new Point(p.x + 1, p.y + 1));
            break;
        case "ul":
            ret.push(new Point(p.x, p.y + 1));
            break;
        case "ru":
            ret.push(p);
            break;

        /* Single-pixel fingers */
        case "ud":
            ret.push(p);
            ret.push(new Point(p.x + 1, p.y));
            break;
        case "rl":
            ret.push(new Point(p.x + 1, p.y));
            ret.push(new Point(p.x + 1, p.y + 1));
            break;
        case "du":
            ret.push(new Point(p.x + 1, p.y + 1));
            ret.push(new Point(p.x, p.y + 1));
            break;
        case "lr":
            ret.push(new Point(p.x, p.y + 1));
            ret.push(p);
            break;

        default:
            throw "This should never happen.";
        }
    }
    return ret;
};


Polygon.prototype.scale = function(s){
    var points = _.map(this.points, function(p){return p.scale(s);});
    return new Polygon(points);
};

Polygon.prototype.enclosing_rect = function(){
    var p = this.points[0];
    var minx = p.x;
    var maxx = p.x;
    var miny = p.y;
    var maxy = p.y;
    for (var i = 0; i < this.points.length; i++){
        p = this.points[i];
        minx = Math.min(minx, p.x);
        maxx = Math.max(maxx, p.x);
        miny = Math.min(miny, p.y);
        maxy = Math.max(maxy, p.y);
    }
    return new Rect(minx, miny, maxx - minx, maxy - miny);
};

/* An extent, ensuring that start < end */
function Extent(start, end) {
    this.start = Math.min(start, end);
    this.end = Math.max(start, end);
}
Extent.prototype.toString = function () {
    return "[" + this.start + ", " + this.end + "]";
};
Extent.prototype.len = function () {
    return this.end - this.start;
};
Extent.prototype.within = function(offset){
    return offset >= this.start && offset < this.end;
};
Extent.prototype.eq = function(other){
    return (this.start == other.start && this.end == other.end);
};
/* Position extent b so it fits within this one */
/* Tries to maintain the length */
Extent.prototype.fit = function(b){
    if (b.len() >= this.len()){
        return this;
    } else if (b.start >= this.start && b.end <= this.end){
        return b;
    } else if (b.start < this.start) {
        return new Extent(this.start, this.start+b.len());
    } else {
        return new Extent(this.end-b.len(), this.end);
    }
};


function extent_outline(curve, view, extent, w, h) {
    var scale = (w*h/view.len());
    var view_start = Math.ceil((extent.start-view.start)*scale);
    var view_end = Math.ceil((extent.end-view.start) * scale) - 1;
    var oncurve =  function(x){
        if (x.x < 0 || x.y < 0)
            return false;
        if (x.x > w || x.y > h)
            return false;
        var v = curve.point_to_offset(x, w, h);
        if (v >= view_start && v <= view_end)
            return true;
        return false;
    };
    var poly = Polygon.construct(
        curve.offset_to_point(view_start, w, h),
        oncurve
    );
    poly = Polygon.trim(poly);
    poly = Polygon.outline(poly, oncurve);
    return new Polygon(poly);
}

module.exports = {
    Extent: Extent,
    Point: Point,
    Rect: Rect,
    Polygon: Polygon,
    Points: Points,
    extent_outline: extent_outline
};
