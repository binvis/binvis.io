var ReactDOM = require("react-dom");
var React = require("react");

import { HashRouter as Router, Route } from "react-router-dom";

var ReactBootstrap = require("react-bootstrap");
var ReactOverlays = require("react-overlays");
var $ = require("jquery");
var History = require("history");
var createReactClass = require('create-react-class');
import PropTypes from 'prop-types';

import TopMenu from "./topmenu.react.js";
import Landing from "./landing.react.js";
import FileView from "./fileview.react.js";
var Help = require("./help.react");
var About = require("./about.react");
var ChangeLog = require("./changelog.react");
var components = require("./components.react");

import '../css/app.less';
import '../css/vendor.less';

var App = createReactClass({
    contextTypes: {
        router: PropTypes.object
    },
    childContextTypes: {
        save_file: PropTypes.func,
        set_modal: PropTypes.func
    },
    getChildContext: function() {
        return {
            save_file: this.save_file,
            set_modal: this.set_modal
        };
    },
    mixins: [
        // components.MediaMixin,
        // ReactRouter.Navigation,
        // ReactBootstrap.OverlayMixin
    ],
    getInitialState: function(){
        return {
            filesaver: null
        };
    },
    save_file: function(title, name, blob){
        this.setState({
            filesaver: {
                name: name,
                blob: blob,
                title: title
            }
        });
    },
    set_modal: function(modal){
        var q = this.props.location.query;
        if (modal)
            q.modal = modal;
        else
            delete q.modal;
        this.context.router.history.push(
            {
                pathname: this.props.location.pathname,
                query: q
            }
        );
    },
    dismiss: function(){
        this.setState( {filesaver: null} );
    },
    renderOverlay: function(){
        var p = this.props.location.query.modal;
        var klass = "modalpage modal " + this.state.media;
        if (this.state.filesaver){
            return <components.FileSaver
                onHide={this.dismiss}
                blob={this.state.filesaver.blob}
                name={this.state.filesaver.name}
                title={this.state.filesaver.title}
                klass={this.state.media}
            ></components.FileSaver>;
        } else if (p == "about"){
            return <ReactBootstrap.Modal
                show={true}
                title="about"
                animation={false}
                className={klass}
                onHide={this.set_modal.bind(this, null)}>
                <About/>
            </ReactBootstrap.Modal>;
        } else if (p == "changelog") {
            return <ReactBootstrap.Modal
                show={true}
                title="changelog"
                className={klass}
                animation={false}
                onHide={this.set_modal.bind(this, null)}>
                <ChangeLog/>
            </ReactBootstrap.Modal>;
        } else if (p == "help") {
            return <ReactBootstrap.Modal
                show={true}
                title="help"
                className={klass}
                animation={false}
                onHide={this.set_modal.bind(this, null)}>
                <Help/>
            </ReactBootstrap.Modal>;
        } else {
            return <span/>;
        }
    },
    render: function(){
        return <div id="binvisapp" ref="binvisapp">
            {React.cloneElement(
                this.props.children,
                {set_modal: this.set_modal, save_file: this.save_file})
            }
            <ReactOverlays.Portal>
                {this.renderOverlay()}
            </ReactOverlays.Portal>
        </div>;
    }
});


$(function(){
    var routes = (
        <Route component={App}>
            <Route exact name="landing" path="/" component={Landing}/>
            <Route component={TopMenu}>
                <Route
                    name="view"
                    path="/view/*"
                    {...this.props}
                    component={FileView}
                ></Route>
            </Route>
            <Route name="help" path="/help" component={Help}/>
        </Route>
    );
    ReactDOM.render(
        <Router>{routes}</Router>,
        document.getElementById("binvis-container")
    );
});
