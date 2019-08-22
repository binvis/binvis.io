
jest.dontMock("../entropy");
jest.dontMock("./testutils");


describe("entropy", function () {
    var entropy = require("../entropy");
    var testutils = require("./testutils");
    it("calculates entropy", function(){
        var t = testutils.random_arraybuf(1024);
        entropy(new Uint8Array(t), 256, function(){}, function(out){
            expect(out).toBeTruthy();
        });
    });
});


