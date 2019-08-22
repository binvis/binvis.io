var ReactDOM = require("react-dom");

var PolyDrawerMixin = {
    prev_poly: null,
    clear: function(borderwidth){
        var canvas = ReactDOM.findDOMNode(this);
        var ctx = canvas.getContext("2d");
        if (this.prev_poly){
            var r = this.prev_poly.enclosing_rect();
            ctx.clearRect(
                r.point.x-borderwidth,
                r.point.y-borderwidth,
                r.w+(2*borderwidth),
                r.h+(2*borderwidth)
            );
        }
    },
    save_poly: function(poly){
        this.prev_poly = poly;
    }
};


module.exports = PolyDrawerMixin;
