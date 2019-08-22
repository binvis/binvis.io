
var React = require("react");
var ReactBootstrap = require("react-bootstrap");
var _ = require("lodash");
var PureRenderMixin = require("react-addons-pure-render-mixin");

var viewstore = require("./stores/view");
var utils = require("./utils");

var OffsetInput = React.createClass({
    mixins: [PureRenderMixin],
    getInitialState: function() {
        return {value: this.props.value};
    },
    componentWillReceiveProps: function(nextprops){
        this.setState({value: nextprops.value});
    },
    change: function(evt){
        if (!evt.target.value){
            this.setState({value: ""});
            return;
        }
        if (evt.target.value.toLowerCase() != "0x"){
            var val = _.parseInt(evt.target.value);
            if (isNaN(val)){
                return;
            }
        }
        this.setState({value: evt.target.value});
    },
    actuate: function(){
        if (!this.state.value){
            this.setState({value: this.props.value});
        }
        var val = _.parseInt(this.state.value);
        this.props.change(val);
    },
    keydown: function(evt){
        if (evt.key == "Enter"){
            this.actuate();
        }
    },
    render: function(){
        return <ReactBootstrap.Input
            size="11"
            type="text"
            onKeyDown={this.keydown}
            onChange={this.change}
            onBlur={this.actuate}
            value={this.state.value}
        ></ReactBootstrap.Input>;
    }
});


var InfoPane = React.createClass({
    mixins: [PureRenderMixin],
    change_start: function(value){
        viewstore.actions.set_focus_start(value);
    },
    change_end: function(value){
        viewstore.actions.set_focus_end(value);
    },
    export: function(){
        var name = utils.savename(
            this.props.name,
            this.props.data,
            this.props.view
        ) + ".bin";
        var data = this.props.data_bytes;
        if (!this.props.data.eq(this.props.view)){
            data = data.subarray(this.props.view.start, this.props.view.end);
        }
        var blob = new Blob([data], {type: "application/octet-stream"});
        var title = "Export bytes " +
                    this.props.view.start +
                    " - " +
                    this.props.view.end +
                    " (" +
                        utils.formatsize(this.props.view.len()) +
                    ")";
        this.props.save_file(title, name, blob);
    },
    render: function() {
        return <table className="infopane">
            <tbody>
                <tr>
                    <td colSpan="4" className="heading">range</td>
                </tr>
                <tr>
                    <td>
                        <OffsetInput
                            value={this.props.view.start}
                            change={this.change_start}
                        ></OffsetInput>
                    </td>
                    <td>-</td>
                    <td>
                        <OffsetInput
                            value={this.props.view.end}
                            change={this.change_end}
                        ></OffsetInput>
                    </td>
                    <td>
                        <ReactBootstrap.Button
                            bsSize="small"
                            onClick={this.export}
                        >export</ReactBootstrap.Button>
                    </td>
                </tr>
                <tr>
                    <td colSpan="3" className="yesselect">
                        {utils.formatsize(this.props.view.len())} / {utils.formatsize(this.props.data.len())}
                    </td>
                </tr>
            </tbody>
        </table>;
    }
});

module.exports = InfoPane;
