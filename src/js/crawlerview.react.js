var ReactDOM = require("react-dom");
var React = require("react");
var $ = require("jquery");
var _ = require("lodash");
var ds = require("./datastructures");
var utils = require("./utils");
var settings = require("./settings");
var viewstore = require("./stores/view");
var PolyDrawerMixin = require("./polydrawer.react");
var classNames = require("classnames");

function evt_coords(evt, scale) {
    var coords = utils.mouse_coords(evt);
    return new ds.Point(
        Math.floor(coords[0]/scale),
        Math.floor(coords[1]/scale)
    );
}

module.exports = React.createClass({
    mixins: [PolyDrawerMixin],
    drag_trigger: 5,
    getInitialState: function() {
        return { dragging: false };
    },
    disable_event: function (evt) {
        evt.preventDefault();
        return false;
    },
    draw: function(){
        var canvas = ReactDOM.findDOMNode(this);
        if (canvas.width != this.real_width || canvas.height != this.real_height){
            canvas.width = this.real_width;
            canvas.height = this.real_height;
        }
        this.clear(settings.creeper_border_width);

        var ctx = canvas.getContext("2d");
        ctx.strokeStyle = settings.creeper_border_color;
        ctx.fillStyle = settings.creeper_fill_color;
        ctx.lineWidth = settings.creeper_border_width;

        var curve = Curves[this.props.curvename];
        var scale = canvas.width/settings.ViewWidth;

        var poly = ds.extent_outline(
            curve,
            this.props.view,
            this.state.dragging || this.props.focus,
            settings.ViewWidth,
            settings.ViewHeight
        );

        poly = poly.scale(scale);
        this.save_poly(poly);
        ctx.beginPath();
        function xrange(x){
            var max = canvas.width - settings.creeper_border_width/2;
            if (x < 2) {
                return 1;
            } else if (x > max) {
                return max;
            }
            return x;
        }
        function yrange(y){
            var max = canvas.height - settings.creeper_border_width/2;
            if (y < 2) {
                return 1;
            } else if (y > max) {
                return max;
            }
            return y;
        }
        ctx.moveTo(xrange(poly.points[0].x), yrange(poly.points[0].y));
        for (var i = 1; i < poly.points.length; i++){
            ctx.lineTo(xrange(poly.points[i].x), yrange(poly.points[i].y));
        }
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
    },
    handleResize: function(){
        var canvas = ReactDOM.findDOMNode(this);
        this.real_width = $(canvas).width();
        this.real_height = $(canvas).height();
        this.draw();
    },
    componentWillUnmount: function(){
        window.removeEventListener("resize", this.handleResize);
    },
    componentDidUpdate: function(){
        this.draw();
    },
    componentDidMount: function(){
        this.handleResize();
        window.addEventListener("resize", this.handleResize);
        this.last_creeper = new ds.Extent(0, 0);
        // Double-click selects text, so we catch and disable
        $(ReactDOM.findDOMNode(this)).on("selectstart", this.disable_event);
        this.draw();
    },
    shouldComponentUpdate: function(nextProps, nextState){
        if (!_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState)){
            if (
                    !_.isEqual(this.props.view, nextProps.view) ||
                    !_.isEqual(this.props.curvename, nextProps.curvename)
                ){
                this.last_creeper = new ds.Extent(0, 0);
            }
            return true;
        }
        return false;
    },
    mouse_offset: function(coords) {
        var curve = Curves[this.props.curvename];
        return utils.view_offset(
            coords,
            this.props.view.len(),
            curve,
            settings.ViewWidth,
            settings.ViewHeight
        ) + this.props.view.start;
    },
    mouseUp: function(evt){
        if (this.state.dragging) {
            viewstore.actions.zoom_absolute(
                this.state.dragging
            );
        } else {
            if (this.props.crawler_pinned) {
                var coords = evt_coords(evt, this.scale());
                offset = this.mouse_offset(coords);
                mid = offset - (this.props.focus_length/2);
                viewstore.actions.refocus(mid, offset);
            }
            viewstore.actions.toggle_crawler_pin();
        }

        this.drag_start_offset = null;
        this.drag_start = null;
        this.setState({dragging: null});
    },
    mouseDown: function(evt){
        if (this.props.view.len() > this.props.focus_length){
            this.drag_start = evt_coords(evt, this.scale());
            this.drag_start_offset = this.props.focus.start;
        }
    },
    mouseMove: function(evt){
        var coords = evt_coords(evt, this.scale());
        var offset = this.mouse_offset(coords);
        if (this.drag_start) {
            if (!this.state.dragging) {
                if (this.drag_start.distance(coords) > this.drag_trigger) {
                    if (this.props.crawler_pinned){
                        this.drag_start_offset = offset;
                    }
                    this.setState(
                        {
                            dragging: this.props.focus
                        }
                    );
                }
            } else {
                this.last_creeper = this.state.dragging;
                this.setState({
                    dragging: new ds.Extent(
                        this.drag_start_offset,
                        offset
                    )
                });
            }
        } else {
            if (this.props.crawler_pinned){
                viewstore.actions.set_cursor(offset);
            } else {
                var mid = offset - (this.props.focus_length/2);
                viewstore.actions.refocus(mid, offset);
            }
        }
    },
    mouseLeave: function(evt){
        var self = this;
        viewstore.actions.set_cursor(null);
        if (this.state.dragging){
            $(document).on("mouseup", function() {
                if (self.state.dragging){
                    viewstore.actions.zoom_absolute(
                        self.state.dragging
                    );
                }
                self.drag_start_offset = null;
                self.drag_start = null;
                self.setState({dragging: null});
                $(document).off("mouseup");
            }
            );
        }
    },
    doubleClick: function(evt){
        viewstore.actions.zoom_factor(2);
    },
    touchStart: function(evt){
        // Blank - it appears we get a mousedown event anyway, as long as
        // the onTouchStart event is registered.
    },
    scale: function(){
        var canvas = ReactDOM.findDOMNode(this);
        return canvas.width/settings.ViewWidth;
    },
    render: function () {
        var classes = classNames({
            "pulse": this.props.crawler_pinned,
            "crawlercanvas": true
        });
        return <canvas
            className={classes}
            onMouseMove={this.mouseMove}
            onMouseDown={this.mouseDown}
            onMouseUp={this.mouseUp}
            onMouseLeave={this.mouseLeave}
            onClick={this.click}
            onDoubleClick={this.doubleClick}
            onTouchStart={this.touchStart}
        ></canvas>;
    }
});
