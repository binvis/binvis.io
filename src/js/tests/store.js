jest.autoMockOff();

describe("view", function () {
    var view = require("../stores/view");
    var ds = require("../datastructures");
    var settings = require("../settings");
    var testutils = require("./testutils");
    it("refocus", function(){
        var fb = settings.FocusBlocks;
        var fbl = settings.FocusBlockLen;
        var fl = fb * fbl;

        view.store.load(true, "test", testutils.random_arraybuf(fl * 4));
        function _test(off, start, end){
            view.store.refocus(off);
            expect(view.store._data.focus).toEqual(
                 new ds.Extent(start, end)
            );
        }

        // The simplest case - the beginning of the view is at 0, and we're
        // block aligned.
        _test(0, 0, fl);
        _test(-10, 0, fl);
        _test(fl*3, fl*3, fl*4);
        // When we approach the end, we allow the user to "scroll up", shrinking
        // the focus.
        //var end = (fl*4)-fb;
        //_test(end, end, fl*4);

        // Short view
        view.store.zoom_absolute(
            new ds.Extent(fbl/2, fbl)
        );
        _test(0, fbl/2, fbl);
        _test(999, fbl/2, fbl);

        // Partial block at the beginning
        view.store.zoom_absolute(
            new ds.Extent(fbl/2, view.store._data.data.end)
        );
        _test(0, fbl/2, fl);
        _test(fl, fl, fl*2);

        // Partial block at the end
        var dend = view.store._data.data.end - fbl/2;
        view.store.zoom_absolute(
            new ds.Extent(
                view.store._data.data.start,
                view.store._data.data.end - fbl/2
            )
        );
        _test(dend, dend-fl+fbl/2, dend);




    });
});
