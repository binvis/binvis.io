var ReactDOM = require("react-dom");
var React = require("react");
var _ = require("lodash");
var scurve = require("./scurve");

var curveorder = 8;
var ticktime = 3500;

var boxes = 1 << curveorder;
var side = Math.sqrt(boxes);


var logovals = "";
for (var i = 0; i < boxes/5; i++)
    logovals = logovals + _.sample("abc");

var colormap = {
    "a": "#df5b5b",
    "b": "#4362bf",
    "c": "#fff"
};

function mod(x, m) {
    return (x%m + m)%m;
}

module.exports = React.createClass({
    getInitialState: function(){
        return {
            offset: 0
        };
    },
    draw: function(){
        var canvas = ReactDOM.findDOMNode(this);
        var ctx = canvas.getContext("2d");

        var step = this.props.size/side;
        point = scurve.hilbert_point(curveorder, this.state.offset);
        for (var x = 0; x < side; x++){
            for (var y = 0; y < side; y++){
                var sx = x * step;
                var sy = y * step;
                var n = scurve.hilbert_index(curveorder, x, y);
                n = (n + this.state.offset)%(boxes)/boxes;
                var currval = Math.floor(logovals.length * n);
                ctx.fillStyle = colormap[logovals[currval]];
                ctx.fillRect(
                    Math.floor(sx),
                    Math.floor(sy),
                    Math.ceil(step),
                    Math.ceil(step)
                );
            }
        }
    },
    componentDidUpdate: function(){
        this.draw();
    },
    tick: function(){
        this.setState({
            offset: (this.state.offset + 1)%boxes
        });
    },
    componentDidMount: function(){
        this.interval = setInterval(this.tick, ticktime);
        this.draw();
    },
    componentWillUnmount: function(){
        clearInterval(this.interval);
    },
    sign: Math.sign || function(x) {
        x = +x; // convert to a number
        if (x === 0 || isNaN(x)) {
            return x;
        }
        return x > 0 ? 1 : -1;
    },
    mouseMove: function(evt){
        if (this.prevmouse){
            var dx = evt.pageX - this.prevmouse.x;
            var dy = evt.pageY - this.prevmouse.y;
            var delta;
            if (Math.abs(dx) > Math.abs(dy)){
                delta = dx;
            } else {
                delta = dy;
            }
            delta = this.sign(delta);
            this.setState({
                offset: mod(this.state.offset + delta, boxes)
            });
        }
        this.prevmouse = {
            x: evt.pageX,
            y: evt.pageY
        };
    },
    render: function () {
        return <canvas
            width={this.props.size}
            height={this.props.size}
            onMouseMove={this.mouseMove}
            className="logo"></canvas>;
    }
});
