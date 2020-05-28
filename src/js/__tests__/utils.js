jest.autoMockOff();

describe("utils", function () {
    var utils = require("../utils");
    var ds = require("../datastructures");
    it("savename", function(){
        var v = new ds.Extent(12, 34);
        var d = new ds.Extent(0, 1000);
        expect(utils.savename("foobar", d, v)).toEqual("foobar-12-34");
        expect(utils.savename("foobar", d, d)).toEqual("foobar");

        expect(utils.savename("foobar.png", d, d)).toEqual("foobar");
        expect(utils.savename("foobar.png", d, v)).toEqual("foobar-12-34");
    });
});
