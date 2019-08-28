var ReactDOM = require("react-dom");
var React = require("react");
var ReactBootstrap = require("react-bootstrap");
import PropTypes from 'prop-types';
var $ = require("jquery");
var _ = require("lodash");
var classNames = require("classnames");
var createReactClass = require('create-react-class');

var settings = require("./settings");
var viewstore = require("./stores/view");
var components = require("./components.react");
var CurveDemo = require("./curvedemo.react");


var ColorPickerRow = createReactClass({
    pick: function(){
        viewstore.actions.set_colorscheme(this.props.scheme.name);
    },
    render: function() {
        var classes = classNames({
            "active": this.props.selected == this.props.scheme.name
        });
        var keyrows = [];
        _.each(this.props.scheme.key, function(x, off){
            var style = {
                "backgroundColor": x[1]
            };
            keyrows.push(
                <td key={x[1]} style={style} className="keycolor"></td>
            );
        });
        return (
            <tr className={classes} onClick={this.pick}>
                <td>
                    <table className="keytable">
                        <tbody>
                            <tr>{keyrows}</tr>
                        </tbody>
                    </table>
                    {this.props.scheme.name}
                </td>
            </tr>
        );
    }
});

var ColorPicker = createReactClass({
    mixins: [components.DismissOnClick],
    dismiss: function(){
        this.props.set_active_popout(null);
    },
    render: function() {
        var self = this;

        var schemes = [];
        _.each(this.props.colorschemes, function(o){
            schemes.push(
                <ColorPickerRow
                    key={o.name}
                    scheme={o}
                    selected={self.props.colorscheme}
                    set_colorscheme={self.props.set_colorscheme}
                >
                </ColorPickerRow>
            );
        });
        return (
            <table className="colorpopover"><tbody>{schemes}</tbody></table>
        );
    }
});




var CurvePickerRow = createReactClass({
    pick: function(){
        viewstore.actions.set_curve(this.props.curve.name);
    },
    shouldComponentUpdate : function(nextProps, nextState){
        return !_.isEqual(nextProps, this.props) || !_.isEqual(nextState, this.state);
    },
    render: function() {
        var classes = classNames({
            "active": this.props.current_curve == this.props.curve.name
        });
        return (
            <tr className={classes} onClick={this.pick}>
                <td>
                    <CurveDemo
                        static={true}
                        curve={this.props.curve.name}
                        size={4}
                        width={70}
                        height={70}/>
                    {this.props.curve.name}
                </td>
            </tr>
        );
    }
});


var CurvePicker = createReactClass({
    mixins: [components.DismissOnClick],
    dismiss: function(){
        this.props.set_active_popout(null);
    },
    render: function() {
        var self = this;
        var curves = [];
        _.each(CurveList, function(o){
            curves.push(
                <CurvePickerRow
                    key={o.name}
                    curve={o}
                    set_curve={self.props.set_curve}
                    current_curve={self.props.curvename}
                ></CurvePickerRow>
            );
        });
        return (
            <table className="shapepopover"><tbody>{curves}</tbody></table>
        );
    }
});


var MenuItem = createReactClass({
    propTypes: {
        name: PropTypes.string,
        icon: PropTypes.string,
        active: PropTypes.bool,
        tooltip: PropTypes.string,
        click: PropTypes.func,
        popout: PropTypes.element
    },
    getPosition: function () {
        var node = ReactDOM.findDOMNode(this);
        var container = this.getContainerDOMNode();

        var offset = container.tagName == "BODY" ?
            domUtils.getOffset(node) : domUtils.getPosition(node, container);

        return merge(offset, {
            height: node.offsetHeight,
            width: node.offsetWidth
        });
    },
    getDefaultProps: function(){
        return {
            active: true
        };
    },
    componentDidUpdate: function(){
        if (this.props.popout && this.props.active_popout === this.props.name){
            var node = $(ReactDOM.findDOMNode(this));
            var pos = node.position();
            var popout = node.find(".popout");
            var top = pos.top + node.height()/2 - popout.height()/2;
            var left = pos.left + node.width() + 5;
            popout.css({
                left: left,
                top: top
            });
        }
    },
    onClick: function(e){
        if (this.props.active){
            if (this.props.click){
                this.props.click(e);
            } else {
                this.props.toggle_active_popout(this.props.name);
            }
        }
    },
    render: function(){
        var disabled = "disabled";
        if (this.props.active){
            disabled = "";
        }

        var ic = {
            "fa": true,
            "fa-lg": true
        };
        ic[this.props.icon] = true;
        var icon = <i
            className={classNames(ic)}
            onClick={this.onClick}
        ></i>;

        var tipcomponent = <ReactBootstrap.Tooltip id={this.props.name + "tooltip"}>
            {this.props.tooltip}
        </ReactBootstrap.Tooltip>;

        var popout = <span/>;
        if (this.props.popout){
            if (this.props.active_popout === this.props.name){
                popout = this.props.popout;
            }
        }
        if (!this.props.active_popout) {
            icon = <ReactBootstrap.OverlayTrigger
                placement="right"
                overlay={tipcomponent}
                delayShow={400}
                delayHide={0}
            >
                {icon}
            </ReactBootstrap.OverlayTrigger>;
        }
        return <li className={disabled}>
            {icon}{popout}
        </li>;
    }
});

var Menu = createReactClass({
    shouldComponentUpdate: function(prev_props, prev_state){
        if (_.isEqual(prev_props, this.props) && _.isEqual(prev_state, this.state)){
            return false;
        }
        return true;
    },
    getInitialState: function(){
        return {
            active_popout: null
        };
    },
    set_active_popout: function(name){
        this.setState({
            active_popout: name
        });
    },
    toggle_active_popout: function(name){
        if (name == this.state.active_popout){
            this.set_active_popout(null);
        } else {
            this.set_active_popout(name);
        }
    },
    zoomin_click: function(){
        viewstore.actions.zoom_factor(settings.zoom_in);
    },
    zoomout_click: function(){
        viewstore.actions.zoom_factor(settings.zoom_out);
    },
    unzoom_click: function(){
        viewstore.actions.unzoom();
    },
    snapshot_click: function(){
        this.props.snapshot();
    },
    about_click: function(){
    },
    render: function () {
        return <ul>
            <MenuItem
                name="zoomin"
                icon="fa-plus"
                tooltip="Zoom in"
                active={!this.props.is_max_zoomed}
                click={this.zoomin_click}
                active_popout={this.state.active_popout}
            ></MenuItem>
            <MenuItem
                name="zoomout"
                icon="fa-minus"
                tooltip="Zoom out"
                active={this.props.is_zoomed}
                click={this.zoomout_click}
                active_popout={this.state.active_popout}
            ></MenuItem>
            <MenuItem
                name="unzoom"
                icon="fa-expand"
                tooltip="Un-zoom"
                active={this.props.is_zoomed}
                click={this.unzoom_click}
                active_popout={this.state.active_popout}
            ></MenuItem>
            <MenuItem
                name="shape"
                icon="fa-th"
                tooltip="Curve"
                popout={
                    <ReactBootstrap.Popover className="popout" id="shape">
                        <CurvePicker
                            curvename = {this.props.curvename}
                            set_active_popout = {this.set_active_popout}
                        ></CurvePicker>
                    </ReactBootstrap.Popover>
                }
                toggle_active_popout={this.toggle_active_popout}
                active_popout={this.state.active_popout}
            ></MenuItem>
            <MenuItem
                name="colour"
                icon="fa-paint-brush"
                tooltip="Colorscheme"
                popout={
                    <ReactBootstrap.Popover className="popout" id="colorscheme">
                        <ColorPicker
                            colorschemes = {this.props.colorschemes}
                            colorscheme = {this.props.colorscheme}
                            set_active_popout = {this.set_active_popout}
                        ></ColorPicker>
                    </ReactBootstrap.Popover>
                }
                toggle_active_popout={this.toggle_active_popout}
                active_popout={this.state.active_popout}
            ></MenuItem>
            <MenuItem
                name="snapshot"
                icon="fa-camera-retro"
                tooltip="Snapshot"
                click={this.snapshot_click}
                active_popout={this.state.active_popout}
            ></MenuItem>
        </ul>;
    }
});

export { Menu };