var ReactDOM = require("react-dom");
var React = require("react");
var $ = require("jquery");

var MouseTail = require("./mousetail");
var utils = require("./utils");

module.exports = React.createClass({
    handle_mousedown: function(e){
        var coords = utils.mouse_coords(e);
        var rect = ReactDOM.findDOMNode(this).getBoundingClientRect();
        var scale = this.props.view.len()/rect.height;
        var offset = this.props.view.start + Math.floor(coords[1] * scale);
        if (!$(e.target).is(".background")){
            return;
        }
        this.props.update(offset);
    },
    handle_onwheel: function(evt){
        var v = Math.floor(
                this.props.focus.start + evt.deltaY
            );
        if (v > this.props.view.end - this.props.focus.length)
            v = this.props.view.end - this.props.focus.length;
        if (v < this.props.view.start)
            v = this.props.view.start;
        this.props.update(v);
    },
    componentDidMount: function(){
        var d = ReactDOM.findDOMNode(this);
        var m = MouseTail.create(d);
        var height = $(d).height();
        m.on("mousedown", function(){
            this.props.disable_selection();
        }.bind(this));
        m.on("mouseup", function(){
            this.props.enable_selection();
        }.bind(this));
        m.on("update", function(e){
            if (e.deltaY){
                this.props.update(
                    Math.floor(
                        this.props.focus.start +
                        (e.deltaY/height) *
                        this.props.view.len()
                    )
                );
            }
        }.bind(this));
    },
    render: function() {
        var height = (this.props.focus.len()/this.props.view.len()) * 100;
        height = Math.max(height, 0.5);
        height = height + "%";
        var y = (
            (this.props.focus.start - this.props.view.start) /
            this.props.view.len()
        ) * 100;
        y = y + "%";
        return (
            <svg
                onMouseDown={this.handle_mousedown}
                onWheel={this.handle_onwheel}
            >
                <rect className="background" x="0" y="0" height="100%" width="100%"/>
                <rect className="scrubber" x="0" y={y} height={height} width="100%"/>
            </svg>
        );
    }
});
