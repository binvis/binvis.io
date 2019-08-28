var ReactDOM = require("react-dom");
var React = require("react");
var $ = require("jquery");
var _ = require("lodash");
var settings = require("./settings");
var ds = require("./datastructures");
var createReactClass = require('create-react-class');


module.exports = createReactClass({
    draw: function(){
        var canvas = ReactDOM.findDOMNode(this);
        var ctx = canvas.getContext("2d");
        canvas.width = $(canvas).width();
        canvas.height = $(canvas).height();
        var w = canvas.width;
        var h = canvas.height;
        var scale = canvas.width/settings.ViewWidth;
        var viewscale = (settings.ViewWidth * settings.ViewHeight) / this.props.view.len();

        // Clear needed to avoid a weird flashing effect on Chrome, which
        // appears to be related to aliasing
        ctx.clearRect(0, 0, w, h);
        var curve = Curves[this.props.curvename];
        var r;
        for (var y = 0; y < settings.ViewHeight; y++){
            var run = 0;
            var run_col = null;
            for (var x = 0; x < settings.ViewWidth; x++){
                var offset = curve.point_to_offset(
                    new ds.Point(x, y),
                    settings.ViewWidth,
                    settings.ViewHeight
                );
                var view_offset = Math.floor(offset / viewscale);
                var col = this.props.colorscheme.color(
                    this.props.view.start + view_offset,
                    this.props.data_bytes
                );
                if (run_col !== null && run_col !== col){
                    ctx.fillStyle = run_col;
                    r = new ds.Rect(x-run, y, run, 1);
                    r = r.scale(scale);
                    ctx.fillRect(r.point.x, r.point.y, r.w, r.h);
                    run = 0;
                    run_col = col;
                }
                run_col = col;
                run += 1;
            }
            if (run > 0){
                ctx.fillStyle = run_col;
                r = new ds.Rect(settings.ViewWidth-run, y, run, 1);
                r = r.scale(scale);
                ctx.fillRect(r.point.x, r.point.y, r.w, r.h);
            }
        }
    },
    componentDidUpdate: function(){
        this.draw();
    },
    componentDidMount: function(){
        this.draw();
    },
    shouldComponentUpdate: function(nextProps, nextState){
        if (_.every([
            _.isEqual(this.props.view, nextProps.view),
            _.isEqual(this.props.curvename, nextProps.curvename),
            _.isEqual(this.props.colorscheme, nextProps.colorscheme),
            _.isEqual(this.props.canvas_width, nextProps.canvas_width)
        ])){
            return false;
        }
        return true;
    },
    render: function () {
        return <canvas className="filecanvas"></canvas>;
    }
});
