
jest.autoMockOff();

describe("view", function () {
    var view = require("../view");
    var tutils = require("../../tests/testutils");
    it("zoom", function(){
        var t = tutils.testpattern_arraybuf(1024);
        v = view.store;
        v.load(true, "test", t);
        expect(view.view_is_zoomed(v.get_data())).toBeFalsy();
        v.zoom_factor(1.5);
        expect(view.view_is_zoomed(v.get_data())).toBeTruthy();
    });
    it("actions", function(){
        var t = tutils.testpattern_arraybuf(1024);
        view.actions.load.trigger(true, "test2", t);
        expect(view.view_is_zoomed(view.store.get_data())).toBeFalsy();
    });
});


/*
QUnit.test("binvis.File.zooming", function (assert) {
    var arr = testpattern_arraybuf(4 * 4 * 4);
    var f = new binvis._File({
        name: "test",
        data: arr,
        curvename: "line",
        canvas_width: 2,
        canvas_height: 8,
        focus_blocks: 1,
        focus_block_len: 4
    });
    f.zoom_factor(0.5);
    assert.equal(f.get("view").len(), 64);
    f.zoom_factor(2);
    assert.equal(f.get("view").len(), 32);
    function checkfocus(f){
        var focus = f.get("focus");
        var view = f.view();
        any = false;
        for (var i = focus.start; i < focus.end; i++) {
            if (view[i] === null){
                any = true;
                break;
            }
        }
        if (any)
            assert.ok(false);
    }
    function upndown(f, n){
        for (var i = 0; i < n; i++){
            f.zoom_factor(2.1);
            checkfocus(f);
        }
        for (i = 0; i < n; i++){
            f.zoom_factor(0.54);
            checkfocus(f);
        }
        assert.equal(f.get("view").len(), 64);
    }
    upndown(f, 30);
    for (var bwidth = 1; bwidth < 6; bwidth++){
        f.set("focus_block_len", 3);
        for (var i = 0; i < f.get("data").byteLength; i+=2){
            f.zoom_factor(4);
            f.refocus(i);
            upndown(f, 8);
        }
    }
});
*/
