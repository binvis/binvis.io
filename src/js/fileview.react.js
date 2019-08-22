var React = require("react");
var ReactRouter = require("react-router");
var Reflux = require("reflux");
var $ = require("jquery");
var _ = require("lodash");
require("./canvas-toBlob");
var DocumentTitle = require("react-document-title");
/* polyfill */

var settings = require("./settings");
var ModalProgress = require("./components.react").ModalProgress;
var FileContentView = require("./filecontents.react");
var CrawlerView = require("./crawlerview.react");
var CursorView = require("./cursorview.react");
var HexView = require("./hexview.react");
var InfoPane = require("./infopane.react");
var Menu = require("./menu.react");
var viewstore = require("./stores/view");
var Legend = require("./legend.react");
var components = require("./components.react");
var dt = require("./datastructures");
var utils = require("./utils");


module.exports = React.createClass({
    mixins: [
        ReactRouter.Navigation,
        Reflux.listenTo(viewstore.store, "_onChange"),
        components.MediaMixin
    ],
    contextTypes: {
        save_file: React.PropTypes.func,
        router: React.PropTypes.object
    },
    getInitialState: function() {
        return {
            view: viewstore.store.get_data(),
            progress: 0
        };
    },
    _onChange: function(){
        this.setState({
            view: viewstore.store.get_data()
        });
    },
    load_file: function (file) {
        var self = this;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", this.props.params.splat, true);
        xhr.responseType = "arraybuffer";
        xhr.onprogress = function (e){
            self.setState(
                {
                    progress: Math.floor((e.loaded / e.total)*100)
                }
            );
        };
        xhr.onload = function (e) {
            if (xhr.status == 200) {
                var view = null;
                if (self.props.location.query.view){
                    var parts = self.props.location.query.view.split("-");
                    view = new dt.Extent(
                        parseInt(parts[0]),
                        parseInt(parts[1])
                    );
                }
                viewstore.actions.load(
                    false,
                    self.props.params.splat,
                    new Uint8Array(
                        this.response,
                        0,
                        this.response.byteLength
                    ),
                    view,
                    self.props.location.query.curve,
                    self.props.location.query.colors
                );
            } else {
                self.setState(
                    {
                        error: xhr.statusText
                    }
                );
            }
        };
        xhr.send();
    },
    update_route: function(){
        if (!this.state.view.data)
            return;
        var query = _.clone(this.props.location.query);
        if (this.state.view.curvename != settings.DefaultCurve){
            query.curve = this.state.view.curvename;
        } else {
            delete query.curve;
        }
        if (this.state.view.colorscheme != settings.DefaultColors){
            query.colors = this.state.view.colorscheme;
        } else {
            delete query.colors;
        }
        if (
                this.state.view.view &&
                this.state.view.view.len() != this.state.view.data.len()
        ){
            query.view = this.state.view.view.start + "-" + this.state.view.view.end;
        } else {
            delete query.view;
        }
        // Route updates turn out to be expensive, so avoid if possible...
        if (!_.isEqual(this.props.location.query, query)){
            var loc = this.props.location;
            loc.query = query;
            this.context.router.replace(loc);
        }
    },
    snapshot: function(){
        var c = $(".filecanvas")[0];
        var self = this;
        // While entropy progress bar is up, canvas does not exist...
        if (c){
            var name = utils.savename(
                self.state.view.name,
                self.state.view.data,
                self.state.view.view
            ) + ".png";
            c.toBlob(
                function(blob){
                    var title = "Save image (" +
                                    utils.formatsize(blob.size) +
                                ")";
                    self.context.save_file(
                        title,
                        name,
                        blob
                    );
                },
                "image-png"
            );
        }
    },
    current_colorscheme: function(){
        for (var i in this.state.view.colorschemes){
            if (this.state.view.colorschemes[i].name == this.state.view.colorscheme){
                return this.state.view.colorschemes[i];
            }
        }
    },
    _prepColorscheme: function(){
        var cs = this.current_colorscheme();
        var self = this;
        if (cs.prepare && !cs.prepared && !cs.preparing) {
            cs.prepare(
                self.state.view.data_bytes,
                function(v){
                    self.setState({progress: v});
                },
                function(){
                    self.forceUpdate();
                }
            );
        }
    },
    handleResize: function(){
        this.forceUpdate();
    },
    componentWillMount: function(){
        var n = this.props.params.splat;
        if (n !== "local" && n !== this.state.view.name){
            viewstore.actions.clear();
            // FIXME: This is really funky, and seems like a race that will
            // come back to bite us...
            this.setState({
                view: {}
            });
        }
    },
    componentDidMount: function(){
        var n = this.props.params.splat;
        if (this.state.view.data){
            this._prepColorscheme();
        } else if (n !== "local") {
            this.load_file();
        } else {
            window.location = "./";
        }
        window.addEventListener("resize", this.handleResize);
    },
    componentWillUnmount: function(){
        window.removeEventListener("resize", this.handleResize);
    },
    componentDidUpdate: function(){
        if (this.state.view.data){
            this._prepColorscheme();
        }
        this.update_route();
    },
    render_fileview: function () {
        var cs = this.current_colorscheme();
        if (cs.prepare && !cs.prepared) {
            content = <components.ModalProgress
                    progress={this.state.progress}
                    message="Calculating entropy"
                ></components.ModalProgress>;
        } else {
            content = <div className="scrollbox">
                <div className="sizebox">
                    <FileContentView
                        curvename={this.state.view.curvename}
                        colorscheme={cs}
                        view={this.state.view.view}
                        data_bytes={this.state.view.data_bytes}
                    ></FileContentView>
                    <CrawlerView
                        focus={this.state.view.focus}
                        curvename={this.state.view.curvename}
                        crawler_pinned={this.state.view.crawler_pinned}
                        view={this.state.view.view}
                        focus_length={viewstore.focus_length(this.state.view)}
                    ></CrawlerView>
                    <CursorView
                        view={this.state.view.view}
                        cursor={this.state.view.cursor}
                        curvename={this.state.view.curvename}
                    ></CursorView>
                </div>
            </div>;
        }
        var cls = "fileview " + this.state.media;
        return <div className={cls}>
                <div className="menu">
                    <Menu
                        is_zoomed={viewstore.view_is_zoomed(this.state.view)}
                        is_max_zoomed={viewstore.view_is_max_zoomed(this.state.view)}
                        colorscheme={this.state.view.colorscheme}
                        colorschemes={this.state.view.colorschemes}
                        curvename={this.state.view.curvename}

                        snapshot={this.snapshot}
                    ></Menu>
                </div>
                <div className="image">
                    {content}
                </div>
                <div className="sidebar">
                    <div className="sidebar-inner">
                        <div className="header">
                        </div>
                        <div className="content">
                            <HexView
                                focus={this.state.view.focus}
                                cursor={this.state.view.cursor}
                                data_bytes={this.state.view.data_bytes}
                                view={this.state.view.view}
                                focus_block_len={this.state.view.focus_block_len}
                                focus_blocks={this.state.view.focus_blocks}
                                hexview_byte_menu={this.state.view.hexview_byte_menu}
                                offset_decimal={this.state.view.offset_decimal}
                            ></HexView>
                        </div>
                        <div className="infobox">
                            <table>
                                <tbody>
                                    <tr>
                                        <td>
                                            <Legend
                                                scheme={this.current_colorscheme()}>
                                            </Legend>
                                        </td>
                                        <td>
                                            <InfoPane
                                                view={this.state.view.view}
                                                data={this.state.view.data}
                                                data_bytes={this.state.view.data_bytes}
                                                name={this.state.view.name}
                                                save_file={this.context.save_file}
                                            ></InfoPane>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>;
    },
    render: function () {
        if (this.state.view.data){
            return <DocumentTitle title={"binvis.io - " + this.state.view.name}>
                {this.render_fileview()}
            </DocumentTitle>;
        } else if (this.state.error){
            return <div className="error content">
                <div className="row">
                    <div className="pickbox col-md-2 col-md-offset-5">
                        <div className="alert alert-danger" role="alert">
                            Error: {this.state.error}
                        </div>
                    </div>
                </div>
            </div>;
        } else {
            return <ModalProgress
                    progress={this.state.progress}
                    message="Downloading binary"
                ></ModalProgress>;
        }
    }
});
