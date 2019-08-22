jest.autoMockOff();

describe("lineorder", function () {
    var curves = require("../curves");
    it("is symmetric", function(){
        var w = 128;
        var h = 512;
        for (var m = 0; m < w*h; m++) {
            var p = curves.Scan.offset_to_point(m, w, h);
            var m2 = curves.Scan.point_to_offset(p, w, h);
            expect(m).toEqual(m2);
        }
    });
});
