
var React = require("react");
var ReactRouter = require("react-router");
var ReactBootstrap = require("react-bootstrap");
var Reflux = require("reflux");
var _ = require("lodash");
var createReactClass = require('create-react-class');

var Logo = require("./logo.react");
var viewstore = require("./stores/view");
var components = require("./components.react");

module.exports = createReactClass({
    mixins: [
        // ReactRouter.Navigation,
        Reflux.listenTo(viewstore.store, "_onChange"),
        components.MediaMixin
    ],
    getInitialState: function() {
        var vs = viewstore.store.get_data();
        return {
            name: vs.name,
            hashes: vs.hashes,

            showmodal: null
        };
    },
    _onChange: function(){
        var vs = viewstore.store.get_data();
        /* For efficiency, we only update if the name changes */
        if (vs.name != this.state.name){
            this.setState({
                name: vs.name,
                hashes: vs.hashes
            });
        }
    },
    open_virustotal: function(){
        var url = "https://www.virustotal.com/en/file/";
        url = url + this.state.hashes.sha256 + "/analysis";
        window.open(url, "_blank");
    },
    open_metascan: function(){
        var url = "https://www.metascan-online.com/scanresult/hash/";
        url = url + this.state.hashes.sha256;
        window.open(url, "_blank");
    },
    open_google: function(){
        var url = "https://www.google.co.nz/search?q=";
        var query = _.values(this.state.hashes).join(" OR ");
        window.open(url + query, "_blank");
    },
    isactive: function(active, me){
        if (active === me)
            return "active";
        else
            return "";
    },
    render_large: function(active){
        var file = null;
        if (this.state.name){
            file = <ReactBootstrap.ButtonToolbar className="pull-right">
                <ReactBootstrap.DropdownButton
                    bsStyle="link"
                    pullRight={true}
                    key={"filedropdown-3"}
                    title={
                        <span className="filename">{this.state.name}</span>
                    }
                    id="filedropdown"
                    className="pull-right"
                >
                    <ReactBootstrap.MenuItem header={true}>
                            Look up on...
                    </ReactBootstrap.MenuItem>
                    <ReactBootstrap.MenuItem
                        onSelect={this.open_virustotal}>
                            VirusTotal
                    </ReactBootstrap.MenuItem>
                    <ReactBootstrap.MenuItem
                        onSelect={this.open_metascan}>
                            MetaScan
                    </ReactBootstrap.MenuItem>
                    <ReactBootstrap.MenuItem
                        onSelect={this.open_google}>
                            Google
                    </ReactBootstrap.MenuItem>
                    <ReactBootstrap.MenuItem divider/>
                    <ReactBootstrap.MenuItem header={true}>
                        <table
                            className="hashtable">
                            <tbody>
                                <tr>
                                    <td><b>MD5:</b></td>
                                    <td> {this.state.hashes.md5}</td>
                                </tr>
                                <tr>
                                    <td><b>SHA1:</b></td>
                                    <td> {this.state.hashes.sha1}</td>
                                </tr>
                                <tr>
                                    <td><b>SHA256:</b></td>
                                    <td>{this.state.hashes.sha256}</td>
                                </tr>
                            </tbody>
                        </table>
                    </ReactBootstrap.MenuItem>
                </ReactBootstrap.DropdownButton>
            </ReactBootstrap.ButtonToolbar>;
        }
        return <div className="outer">
            <ReactBootstrap.Navbar
                fixedTop={true}
                fluid={true}
                className="topmenu"
            >
                <ReactBootstrap.Nav>
                    <ReactBootstrap.Navbar.Header>
                        <ReactBootstrap.Navbar.Brand>
                            <a href="">
                                <div><Logo size={20}/><b>binvis.io</b></div>
                            </a>
                        </ReactBootstrap.Navbar.Brand>
                    </ReactBootstrap.Navbar.Header>
                    <ReactBootstrap.NavItem
                        key={1}
                        onSelect={this.props.set_modal.bind(null, "about")}
                        className={this.isactive(active, "about")}
                    >about</ReactBootstrap.NavItem>
                    <ReactBootstrap.NavItem
                        key={2}
                        onSelect={this.props.set_modal.bind(null, "changelog")}
                        className={this.isactive(active, "changelog")}
                    >changelog</ReactBootstrap.NavItem>
                    <ReactBootstrap.NavItem
                        key={3}
                        onSelect={this.props.set_modal.bind(null, "help")}
                        className={this.isactive(active, "help")}
                    >help</ReactBootstrap.NavItem>
                </ReactBootstrap.Nav>
                {file}
            </ReactBootstrap.Navbar>
            {React.cloneElement(
                this.props.children,
                {save_file: this.save_file})
            }
        </div>;
    },
    render_small: function(active){
        var file = null;
        if (this.state.name){
            file = <ReactBootstrap.Nav className="pull-right">
                <ReactBootstrap.DropdownButton
                    key={3}
                    title={
                        <span className="filename">{this.state.name}</span>
                    }
                    id="filedropdown-small"
                >
                    <ReactBootstrap.MenuItem
                        key={1}
                        onSelect={this.props.set_modal.bind(null, "about")}
                        className={this.isactive(active, "about")}
                    >about</ReactBootstrap.MenuItem>
                    <ReactBootstrap.MenuItem
                        key={2}
                        onSelect={this.props.set_modal.bind(null, "changelog")}
                        className={this.isactive(active, "changelog")}
                    >changelog</ReactBootstrap.MenuItem>
                    <ReactBootstrap.MenuItem
                        key={3}
                        onSelect={this.props.set_modal.bind(null, "help")}
                        className={this.isactive(active, "help")}
                    >help</ReactBootstrap.MenuItem>
                    <ReactBootstrap.MenuItem divider/>
                    <ReactBootstrap.MenuItem header={true}>
                            Look up on...
                    </ReactBootstrap.MenuItem>
                    <ReactBootstrap.MenuItem
                        onSelect={this.open_virustotal}>
                            VirusTotal
                    </ReactBootstrap.MenuItem>
                    <ReactBootstrap.MenuItem
                        onSelect={this.open_metascan}>
                            MetaScan
                    </ReactBootstrap.MenuItem>
                    <ReactBootstrap.MenuItem
                        onSelect={this.open_google}>
                            Google
                    </ReactBootstrap.MenuItem>
                </ReactBootstrap.DropdownButton>
            </ReactBootstrap.Nav>;
        }
        return <div className="outer">
            <ReactBootstrap.Navbar
                fixedTop={true}
                fluid={true}
                className="topmenu small"
                brand={<a href=""><Logo size={20}/></a>}
            >
                {file}
            </ReactBootstrap.Navbar>
            {React.cloneElement(
                this.props.children,
                {save_file: this.save_file})
            }
        </div>;
    },
    render: function(){
        var q = this.props.location.query;
        if(this.state.media == "large")
            return this.render_large(q.modal);
        else
            return this.render_small(q.modal);
    }
});
