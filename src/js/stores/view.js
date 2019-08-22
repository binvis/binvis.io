
var Reflux = require("reflux");
var settings = require("../settings");
var ds = require("../datastructures");
var colours = require("../colours");
var utils = require("../utils");


var actions = Reflux.createActions([
    "clear",
    "load",
    "set_cursor",
    "refocus",
    "refocus_delta",
    "toggle_crawler_pin",
    "unzoom",
    "zoom_factor",
    "zoom_absolute",
    "set_curve",
    "set_colorscheme",

    "set_focus_start",
    "set_focus_end",

    // Byte menu in the hex view
    "set_hexview_byte_menu",
    "set_offset_decimal"
]);

function focus_length(data){
    return data.focus_blocks * data.focus_block_len;
}

function view_is_max_zoomed (data){
    if (data.view.len() <= focus_length(data))
        return true;
    else
        return false;
}

function view_is_zoomed(data){
    if (
        data.view.start === 0 &&
        data.view.len() == data.data.len()
    )
        return false;
    else
        return true;
}

var store = Reflux.createStore({
    listenables: actions,
    _data: {},
    clear: function(){
        this._data = {};
    },
    get_data: function(){
        return this._data;
    },
    align: function(v){
        return Math.floor(v / this._data.alignment) * this._data.alignment;
    },
    load: function(local, name, data_bytes, view, curvename, colorscheme){
        var focus_blocks = settings.FocusBlocks;
        var focus_block_len = settings.FocusBlockLen;
        if (!view){
            view = new ds.Extent(0, data_bytes.byteLength);
        }
        var focus = new ds.Extent(
            0,
            Math.min(
                focus_blocks * focus_block_len,
                view.len()
            )
        );
        focus = view.fit(focus);
        this._data =  {
            local: local,
            name: name,
            data_bytes: data_bytes,
            data: new ds.Extent(0, data_bytes.byteLength),
            view: view,
            focus: focus,
            cursor: null,
            focus_blocks: focus_blocks,
            focus_block_len: focus_block_len,
            focus_length: focus_length(this._data),
            curvename: curvename || settings.DefaultCurve,
            crawler_pinned: false,
            colorscheme: colorscheme || settings.DefaultColors,
            colorschemes: colours.ColorSchemes(),
            hashes: utils.calculate_hashes(data_bytes),
            alignment: focus_block_len,

            hexview_byte_menu: null,
            offset_decimal: false
        };
        this.trigger(this._data);
    },

    refocus_delta: function(delta, cursor) {
        this.refocus(this._data.focus.start + delta, cursor);
    },

    // Refocus within the current view
    // Start is a desired starting offset
    // Cursor is the cursor position, if any
    // Both parameters may be adjusted by this function for fit and alignment
    refocus: function(start, cursor){
        var pb = focus_length(this._data);
        start = Math.max(start, this._data.view.start);
        var blockstart = this.align(start);
        if (this._data.view.len() <= pb){
            this._data.focus = this._data.view;
        } else if (blockstart < this._data.view.start) {
            /* Partial block at the beginning */
            this._data.focus = new ds.Extent(
                start, blockstart + pb
            );
        } else if (blockstart + pb > this._data.view.end){
            /* Partial block at the beginning */
            start = (this.align(this._data.view.end) +
                    this._data.focus_block_len) - pb;
            this._data.focus = new ds.Extent(
                start,  this._data.view.end
            );
        } else {
            this._data.focus = new ds.Extent(
                blockstart, blockstart + pb
            );
        }
        this._data.cursor = cursor;
        this.trigger(this._data);
    },
    unzoom: function(){
        this.zoom_absolute(
            new ds.Extent(0, this._data.data.len())
        );
    },
    /*
        Zoom by a constant factor > 1 to zoom in, < 1 to zoom out.

        Tries to keep the focus in more or less the same location on screen.
    */
    zoom_factor: function (factor) {
        var newlen = Math.max(
            Math.floor(this._data.view.len() / factor),
            focus_length(this._data)
        );
        if (newlen >= this._data.data.len()) {
            extent = new ds.Extent(0, this._data.data.len());
        }

        // First find the current midpoint
        var mid = this._data.focus.start + (Math.floor(this._data.focus.len()/2));
        var mid_offset = utils.canvas_offset(
            this._data.view.len(),
            mid - this._data.view.start,
            settings.ViewWidth,
            settings.ViewHeight
        );
        var curve = Curves[this._data.curvename];
        var point = curve.offset_to_point(
            mid_offset,
            settings.ViewWidth,
            settings.ViewHeight
        );

        // Now, our problem is to find a view of length "newlen", such
        // that "mid" is at "point"

        // Translate point into new the new view length. This is the
        // offset in bytes we need from the beginning of the view
        var newmid = utils.view_offset(
            point,
            newlen,
            curve,
            settings.ViewWidth,
            settings.ViewHeight
        );
        var start = this.align(mid - newmid);
        var extent = this._data.data.fit(
            new ds.Extent(start,  start + newlen)
        );

        this.zoom_absolute(extent);
    },
    zoom_absolute: function (ext) {
        if (ext.start == ext.end){
            ext = new ds.Extent(ext.start, ext.end + 1);
        }
        var newview = this._data.data.fit(
            new ds.Extent(ext.start, ext.end)
        );
        this._data.view = newview;
        var newfocus = newview.fit(this._data.focus);
        this._data.focus = newfocus;
        this.trigger(this._data);
    },
    toggle_crawler_pin: function(){
        var newval = !this._data.crawler_pinned;
        this._data.crawler_pinned = newval;
        if (!newval){
            this._data.cursor = null;
        }
        this.trigger(this._data);
    },
    set_cursor: function(offset){
        this._data.cursor = offset;
        this.trigger(this._data);
    },
    set_curve: function(curvename){
        this._data.curvename = curvename;
        this.trigger(this._data);
    },
    set_colorscheme: function(colorscheme){
        this._data.colorscheme = colorscheme;
        this.trigger(this._data);
    },
    set_focus_start: function(offset){
        var view = new ds.Extent(
            offset,
            this._data.view.end
        );
        this.zoom_absolute(view);
    },
    set_focus_end: function(offset){
        var view = new ds.Extent(
            this._data.view.start,
            offset
        );
        this.zoom_absolute(view);
    },
    set_hexview_byte_menu: function(offset, ascii){
        if (offset === null)
            this._data.hexview_byte_menu = null;
        else {
            this._data.hexview_byte_menu = {
                offset: offset,
                ascii: ascii
            };
            this.set_cursor(offset);
        }
    },
    set_offset_decimal: function(val){
        this._data.offset_decimal = val;
        this.trigger(this._data);
    }
});

module.exports = {
    focus_length: focus_length,
    view_is_max_zoomed: view_is_max_zoomed,
    view_is_zoomed: view_is_zoomed,
    store: store,
    actions: actions
};
