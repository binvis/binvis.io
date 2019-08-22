var ReactDOM = require("react-dom");
var React = require("react");
var $ = require("jquery");
var _ = require("lodash");
var ds = require("./datastructures");
var settings = require("./settings");
var curves = require("./curves");
var PolyDrawerMixin = require("./polydrawer.react");

module.exports = React.createClass({
    mixins: [PolyDrawerMixin],
    draw: function(){
        var canvas = ReactDOM.findDOMNode(this);
        if (canvas.width != this.real_width || canvas.height != this.real_height){
            canvas.width = this.real_width;
            canvas.height = this.real_height;
        }
        var ctx = canvas.getContext("2d");
        var scale = canvas.width/settings.ViewWidth;
        this.clear(0);

        var he = this.props.cursor;
        if (he === null)
            return;
        var start = this.props.cursor;
        var end = Math.min(start + 1, this.props.view.end);
        ctx.fillStyle = settings.HexHoverFill;
        var curve = curves.Curves[this.props.curvename];

        var poly = ds.extent_outline(
            curve,
            this.props.view,
            new ds.Extent(start, end),
            settings.ViewWidth,
            settings.ViewHeight
        );

        poly = poly.scale(scale);
        this.save_poly(poly);
        ctx.beginPath();
        ctx.moveTo(poly.points[0].x, poly.points[0].y);
        for (var i = 1; i < poly.points.length; i++){
            ctx.lineTo(poly.points[i].x, poly.points[i].y);
        }
        ctx.closePath();
        ctx.fill();
    },
    handleResize: function(){
        var canvas = ReactDOM.findDOMNode(this);
        this.real_width = $(canvas).width();
        this.real_height = $(canvas).height();
    },
    componentWillUnmount: function(){
        window.removeEventListener("resize", this.handleResize);
    },
    componentDidUpdate: function(){
        this.draw();
    },
    componentDidMount: function(){
        this.handleResize();
        this.draw();
        window.addEventListener("resize", this.handleResize);
    },
    shouldComponentUpdate: function(nextProps, nextState){
        if (!_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState)){
            return true;
        }
        return false;
    },
    render: function () {
        return <canvas className="cursorcanvas"></canvas>;
    }
});
