
jest.dontMock("../datastructures");
jest.dontMock("../curves");
jest.dontMock("../scurve");
jest.dontMock("lodash");
var _ = require("lodash");
var dt = require("../datastructures");
var curves = require("../curves");


describe("Rect", function() {
    it("contains points", function() {
        var r = new dt.Rect(5, 5, 3, 3);

        expect(r.contains(new dt.Point(5, 5))).toBeTruthy();
        expect(r.contains(new dt.Point(7, 5))).toBeTruthy();
        expect(!r.contains(new dt.Point(8, 5))).toBeTruthy();
    });
});

describe("Extent", function () {
    it("overlaps", function(){
    });
});


describe("Point", function() {
    it("eq", function() {
        expect(
            new dt.Point(0, 0).eq(
                new dt.Point(0, 0)
            )
        ).toBeTruthy();
        expect(
            new dt.Point(0, 0).eq(
                new dt.Point(0, 1)
            )
        ).toBeFalsy();
    });
});

describe("Point", function() {
    it("_next", function() {
        var points = [
            new dt.Point(1, 0),
            new dt.Point(2, 1),
            new dt.Point(1, 2),
            new dt.Point(0, 1)
        ];
        /*  +-+-+-+
            | |X| |
            +-----+
            |X|X| |
            +-----+
            | | | |
            +-+-+-+ */
        var target = new dt.Point(1, 0);
        expect(
            dt.Polygon._next(
                points,
                function(x){return x.eq(target);}
            )
        ).toEqual(
            target
        );
    });
    it("_start", function () {
        var area = new dt.Rect(5, 5, 3, 3);

        expect(
            dt.Polygon._start(
                new dt.Point(6, 6),
                function(p){
                    return area.contains(p);
                }
            )
        ).toEqual(
            [new dt.Point(6, 5), new dt.Point(7, 5)]
        );
        expect(
            dt.Polygon._start(
                new dt.Point(7, 6),
                function(p){
                    return area.contains(p);
                }
            )
        ).toEqual(
            [new dt.Point(7, 5), new dt.Point(7, 6)]
        );
        expect(
            dt.Polygon._start(
                new dt.Point(5, 5),
                function(p){
                    return area.contains(p);
                }
            )
        ).toEqual(
            [new dt.Point(5, 5), new dt.Point(6, 5)]
        );
    });




    var test_shapes = [
        {
            /*
             0   1   2   3
            0+---+---+---+
             |   |   |   |
             |   |   |   |
             |   |   |   |
            1+-----------+
             |   |   |   |
             |   |   |   |
             |   |   |   |
            2+---+---+---+
            */
            func: function (p){
                var a1 = new dt.Rect(0, 0, 3, 2);
                return a1.contains(p);
            },
            start: new dt.Point(0, 0),
            construct: [
                [2, 0],[2, 1],[1, 1],[0, 1],[0, 0],[1, 0]
            ],
            trim: [
                [2, 0],[2, 1],[0, 1],[0, 0]
            ],
            outline: [
                [3, 0],[3, 2],[0, 2],[0, 0]
            ]
        },
        {
            /*

             0   1   2   3   4
            0    +---+---+
                 |   |   |
                 |   |   |
                 |   |   |
            1+---------------+
             |   |   |   |   |
             |   |   |   |   |
             |   |   |   |   |
            2+---------------+
             |   |   |   |   |
             |   |   |   |   |
             |   |   |   |   |
            3+---------------+
                 |   |   |
                 |   |   |
                 |   |   |
            4    +---+---+

            */


            func: function (p){
                var a1 = new dt.Rect(1, 0, 2, 4);
                var a2 = new dt.Rect(0, 1, 4, 2);
                return a1.contains(p) || a2.contains(p);
            },
            start: new dt.Point(1, 0),
            construct: [
                [2, 1],[3, 1],[3, 2],[2, 2],[2, 3],[1, 3],
                [1, 2],[0, 2],[0, 1],[1, 1],[1, 0],[2, 0]
            ],
            trim: [
                [2, 1],[3, 1],[3, 2],[2, 2],[2, 3],[1, 3],
                [1, 2],[0, 2],[0, 1],[1, 1],[1, 0],[2, 0]
            ],
            outline: [
                [3, 1],[4, 1],[4, 3],[3, 3],[3, 4],[1, 4],
                [1, 3],[0, 3],[0, 1],[1, 1],[1, 0],[3, 0]
            ]
        },
        {
            /*

            0    1   2   3
                 +---+
                 |   |
                 |   |
            1+-----------+
             |   |   |   |
             |   |   |   |
             |   |   |   |
            2+-----------+
             |   |   |   |
             |   |   |   |
             |   |   |   |
            3+---+---+---+

            */
            func: function (p){
                var a1 = new dt.Rect(1, 0, 1, 1);
                var a2 = new dt.Rect(0, 1, 3, 2);
                return a1.contains(p) || a2.contains(p);
            },
            start: new dt.Point(1, 0),
            construct: [
                [2, 1],[2, 2],[1, 2],[0, 2],[0, 1],[1, 1],[1, 0],[1, 1]
            ],
            trim: [
                [2, 1],[2, 2],[0, 2],[0, 1],[1, 1],[1, 0],[1, 1]
            ],
            outline: [
                [3, 1],[3, 3],[0, 3],[0, 1],[1, 1],[1, 0],[2, 0],[2, 1]
            ]
        },
        {
            /*

             0   1   2   3
            0+---+---+---+
             |   |   |   |
             |   |   |   |
             |   |   |   |
            1+-----------+
             |   |   |   |
             |   |   |   |
             |   |   |   |
            2+---+   +---+

            */
            func: function (p){
                var a1 = new dt.Rect(0, 0, 3, 1);
                var a2 = new dt.Rect(0, 1, 1, 1);
                var a3 = new dt.Rect(2, 1, 1, 1);
                return a1.contains(p) || a2.contains(p) || a3.contains(p);
            },
            start: new dt.Point(0, 0),
            construct: [
                [2, 0],[2, 1],[2, 0],[1, 0],[0, 0],[0, 1],[0, 0],[1, 0]
            ],
            trim: [
                [2, 0],[2, 1],[2, 0],[0, 0],[0, 1],[0, 0]
            ],
            outline: [
                [3, 0],[3, 2],[2, 2],[2, 1],[1, 1],[1, 2],[0, 2],[0, 0]
            ]
        },
        {
            /*

             0   1   2
            0+---+
             |   |
             |   |
             |   |
            1+----
             |   |
             |   |
             |   |
            2+-------+
             |   |   |
             |   |   |
             |   |   |
            3+---+---+

            */
            func: function test_shape_4(p){
                var a2 = new dt.Rect(0, 0, 1, 3);
                var a3 = new dt.Rect(1, 2, 1, 1);
                return a2.contains(p) || a3.contains(p);
            },
            start: new dt.Point(0, 0),
            construct: [
                [0, 2], [1, 2], [0, 2], [0, 1], [0, 0], [0, 1]
            ],
            trim: [
                [0, 2], [1, 2], [0, 2], [0, 0]
            ],
            outline: [
                [1, 2],[2, 2],[2, 3],[0, 3],[0, 0],[1, 0]
            ]
        }
    ];
    it.only("testshapes", function(){
        tfunc = function(x){
            var arr = dt.Polygon.construct(x.start, x.func);
            expect(arr.roteq(dt.Points(x.construct))).toBeTruthy();
            arr = dt.Polygon.trim(arr);
            expect(arr.roteq(dt.Points(x.trim))).toBeTruthy();
            arr = dt.Polygon.outline(arr, x.func);
            expect(arr.roteq(dt.Points(x.outline))).toBeTruthy();
        };
        _.each(test_shapes, tfunc);
    });


    it("enclosing_rect", function () {
        poly = dt.Polygon.construct(test_shapes[0].start, test_shapes[0].func);
        poly = dt.Polygon.trim(poly);
        poly = dt.Polygon.outline(poly, test_shapes[0].func);
        poly =  new dt.Polygon(poly);
        expect(poly.enclosing_rect()).toEqual(new dt.Rect(0, 0, 3, 2));

        poly = dt.Polygon.construct(test_shapes[2].start, test_shapes[2].func);
        poly = dt.Polygon.trim(poly);
        poly = dt.Polygon.outline(poly, test_shapes[2].func);
        poly =  new dt.Polygon(poly);
        expect(poly.enclosing_rect()).toEqual(new dt.Rect(0, 0, 3, 2));
    });
});


describe("Array", function() {
    it("rotates", function() {
        var n = [0, 1, 2, 3, 4];
        n.rotate(2);
        expect(n).toEqual([2, 3, 4, 0, 1]);
    });
});


describe("extent_outline", function(){
    it("does", function(){
        var view = new dt.Extent(0, 90808);
        var extent = new dt.Extent(31040, 31360);
        expect(
            dt.extent_outline(
                curves.Curves.hilbert,
                view,
                extent,
                256,
                1024
            )
        ).toBeTruthy();
    });
});
