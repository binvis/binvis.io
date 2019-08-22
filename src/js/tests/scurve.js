jest.dontMock("../scurve");

describe("hilbert", function () {
    var scurve = require("../scurve");
    it("point/index operations symmetric", function(){
        for (var m = 2; m <= 5; m++) {
            for (var i = 0; i < Math.pow(2, 2 * m); i++) {
                var v = scurve.hilbert_point(m, i);
                expect(i).toEqual(scurve.hilbert_index(m, v[0], v[1]));
            }
        }
    });
    it("index", function(){

        // From the example on p 18 of Hamilton
        expect(scurve.hilbert_index(3, 5, 6)).toEqual(45);

    });
});

