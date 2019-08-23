var ReactDOM = require("react-dom");
var React = require("react");
var ReactBootstrap = require("react-bootstrap");
var $ = require("jquery");
var PureRenderMixin = require("react-addons-pure-render-mixin");

var viewstore = require("./stores/view");
var utils = require("./utils");
var components = require("./components.react");
var ScrollBar = require("./scrollbar.react");


function hexoff(){
    return viewstore.actions.set_offset_decimal(true);
}


function hexon(){
    return viewstore.actions.set_offset_decimal(false);
}


var ByteContextMenu = React.createClass({
    mixins: [
        components.DismissOnClick,
        PureRenderMixin
    ],
    dismiss: function(){
        viewstore.actions.set_hexview_byte_menu(null);
    },
    set_start: function(){
        viewstore.actions.set_focus_start(this.props.offset);
        viewstore.actions.set_hexview_byte_menu(null);
    },
    set_end: function(){
        viewstore.actions.set_focus_end(this.props.offset+1);
        viewstore.actions.set_hexview_byte_menu(null);
    },
    render: function(){
        return <ReactBootstrap.Popover id="locationselector" placement="bottom">
            <ul className="popover-menu">
                <li key="start" onClick={this.set_start}><a>start view here</a></li>
                <li key="end" onClick={this.set_end}><a>end view here</a></li>
            </ul>
        </ReactBootstrap.Popover>;
    }
});


var HexRow = React.createClass({
    mixins: [PureRenderMixin],
    handle_click_byte: function(offset, ascii){
        if (this.props.hexview_byte_menu)
            viewstore.actions.set_hexview_byte_menu(null);
        else
            viewstore.actions.set_hexview_byte_menu(offset, ascii);
    },
    mouseover: function(e, key){
        if (this.props.hexview_byte_menu === null){
            viewstore.actions.set_cursor(
                $(e.target).data("offset")
            );
        }
    },
    byte: function(value, offset, ascii, selected) {
        var classstr = "";
        if (selected){
            classstr = "selected";
        }
        var disp;
        if (ascii){
            if (value >= 32 && value <= 126) {
                disp = String.fromCharCode(value);
            } else {
                disp = ".";
            }
        } else {
            disp = utils.num(value, 16, 2);
        }
        if (
            this.props.hexview_byte_menu &&
                this.props.hexview_byte_menu.offset == offset &&
                this.props.hexview_byte_menu.ascii == ascii
        ){
            return (
                <div key="popup-menu">
                    <span
                        key={offset}
                        data-offset={offset}
                        onMouseOver={this.mouseover}
                        className={classstr}
                    >
                        {disp}
                    </span>
                    <ByteContextMenu
                        offset = {offset}
                    ></ByteContextMenu>
                </div>
            );
        } else {
            return (
                <span
                    key={offset}
                    data-offset={offset}
                    onMouseOver={this.mouseover}
                    className={classstr}
                    onClick={
                        function(){
                            return this.handle_click_byte(offset, ascii);
                        }.bind(this)
                    }
                >{disp}</span>
            );
        }
    },
    render: function() {
        var bytes = [];
        var ascii = [];
        var self = this;

        var end = this.props.offset + this.props.focus_block_len;
        for (var i = this.props.offset; i < end; i++){
            if (i == this.props.offset + this.props.focus_block_len/2){
                bytes.push(<span key={"brk"+i} ></span>);
                ascii.push(<span key={"brk"+i}> </span>);
            }
            if (i < this.props.view.start || i >= this.props.view.end){
                bytes.push(<span key={i}> </span>);
                ascii.push(<span key={i}> </span>);
            } else {
                var value = this.props.data_bytes[i];
                bytes.push(
                    self.byte(value, i, false, this.props.cursor == i)
                );
                ascii.push(
                    self.byte(value, i, true, this.props.cursor == i)
                );
            }
        }
        var hoff;
        if (this.props.offset_decimal){
            hoff = utils.num(this.props.offset, 10, 7);
        } else {
            hoff = utils.num(this.props.offset, 16, 7);
        }
        return (
            <tr>
                <td className="offset">
                    {hoff}
                </td>
                <td className="bytes">{bytes}</td>
                <td className="ascii">{ascii}</td>
            </tr>
        );
    }
});


var HexView = React.createClass({
    changeOptions: "change:focus change:cursor",
    mixins: [PureRenderMixin],
    onwheel: function(evt){
        viewstore.actions.refocus_delta(
            Math.floor(evt.deltaY*this.props.focus_block_len),
            this.props.hexview_byte_menu
        );
    },
    mouseleave: function(evt){
        if (this.props.hexview_byte_menu === null){
            viewstore.actions.set_cursor(null);
        }
    },
    disable_selection: function(){
        $(ReactDOM.findDOMNode(this)).addClass("noselect");
    },
    enable_selection: function(){
        $(ReactDOM.findDOMNode(this)).removeClass("noselect");
    },
    componentWillReceiveProps: function(nextprops){
        if (
            this.props.hexview_byte_menu !== null &&
                (
                    !this.props.focus.within(this.props.hexview_byte_menu.offset) ||
                    this.props.cursor !== this.props.hexview_byte_menu.offset
                )
        ){
            viewstore.actions.set_hexview_byte_menu(null);
        }
    },
    scroll_update: function(offset){
        viewstore.actions.refocus(offset, this.props.hexview_byte_menu);
    },
    render: function () {
        var lines = [];
        var pbw = this.props.focus_block_len;
        for (var i = 0; i < this.props.focus_blocks; i++){
            var block_offset = Math.floor(
                (this.props.focus.start+i*pbw)/pbw
            )*pbw;
            if (this.props.cursor >= block_offset && this.props.cursor < block_offset + pbw){
                cursor = this.props.cursor;
            } else {
                cursor = null;
            }
            // Key should encode both start and end byte offsets
            var key = Math.max(this.props.view.start, block_offset) +
                        "-" +
                        Math.min(this.props.view.end, block_offset + pbw);
            lines.push(
                <HexRow
                    key={key}
                    offset={block_offset}
                    data_bytes={this.props.data_bytes}
                    view={this.props.view}
                    cursor={cursor}

                    focus_block_len = {this.props.focus_block_len}
                    offset_decimal={this.props.offset_decimal}
                    hexview_byte_menu = {this.props.hexview_byte_menu}
                ></HexRow>
            );
            block_offset += pbw;
        }
        return <div className="hexview">
            <table className="spacertable">
                <tbody>
                    <tr>
                        <td className="textarea">
                            <table onMouseLeave={this.mouseleave} onWheel={this.onwheel}>
                                <tbody>
                                    <tr>
                                        <th>
                                            <components.Bobble
                                                text="hex"
                                                active={!this.props.offset_decimal}
                                                onClick={hexon}
                                            ></components.Bobble>
                                            <components.Bobble
                                                text="dec"
                                                active={this.props.offset_decimal}
                                                onClick={hexoff}
                                            ></components.Bobble>
                                        </th>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                    {lines}
                                </tbody>
                            </table>
                        </td>
                        <td className="scrollbar">
                            <ScrollBar
                                view = {this.props.view}
                                focus = {this.props.focus}

                                update = {this.scroll_update}
                                enable_selection = {this.enable_selection}
                                disable_selection = {this.disable_selection}
                            ></ScrollBar>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>;
    }
});

module.exports = HexView;
