var ReactDOM = require("react-dom");
var React = require("react");
var $ = require("jquery");
var _ = require("lodash");
var createReactClass = require('create-react-class');

var ds = require("./datastructures");
var curves = require("./curves");

var ticktime = 3500;

const PointStyle = "#303030";
const LineStyle = "#0091ff";

module.exports = createReactClass({
    margin: 6,
    demos: [2, 4, 8, 16],
    getInitialState: function(){
        return {
            demo: 1
        };
    },
    size: function(){
        return this.demos[this.state.demo];
    },
    draw: function(){
        var canvas = $(ReactDOM.findDOMNode(this));
        var ctx = canvas[0].getContext("2d");
        ctx.imageSmoothingEnabled = false;
        var prev = null;
        var points = [];
        ctx.strokeStyle = LineStyle;

        ctx.clearRect(0, 0, canvas.width(), canvas.height());

        var vheight = this.size() * Math.floor(this.props.height/this.props.width);

        for (var i=0; i < this.size()*vheight; i++){
            var point = curves.Curves[this.props.curve].offset_to_point(
                i,
                this.size(),
                this.size()
            );

            var dim = canvas[0].width-(this.margin*2);
            var xscale = (dim/(this.size()-1));

            dim = canvas[0].height-(this.margin*2);
            var yscale = (dim/(vheight-1));

            point = new ds.Point(
                this.margin + point.x * xscale,
                this.margin + point.y * yscale
            );
            if (prev !== null){
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(prev.x, prev.y);
                ctx.lineTo(point.x, point.y);
                ctx.stroke();
            }
            points.push(point);
            prev = point;
        }
        ctx.fillStyle = PointStyle;
        _.each(points, function(point){
            ctx.beginPath();
            ctx.arc(point.x, point.y, 3, 0, Math.PI*2, true);
            ctx.fill();
        });
    },
    tick: function(){
        if (!this.mousing)
            this.incdemo();
    },
    mouseover: function(){
        this.mousing = true;
    },
    mouseout: function(){
        this.mousing = false;
    },
    componentDidUpdate: function(){
        this.draw();
    },
    componentDidMount: function(){
        this.interval = null;
        if (!this.props.static)
            this.interval = setInterval(this.tick, ticktime);
        this.draw();
    },
    componentWillUnmount: function(){
        clearInterval(this.interval);
    },
    incdemo: function(){
        if (!this.props.static)
            this.setState({
                demo: (this.state.demo + 1)%this.demos.length
            });
    },
    render: function() {
        return (
            <canvas
                onClick={this.incdemo}
                onMouseOver={this.mouseover}
                onMouseOut={this.mouseout}
                className="curvedemo noselect"
                width={this.props.width}
                height={this.props.height}/>
        );
    }
});
