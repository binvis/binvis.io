var React = require("react");
var ReactBootstrap = require("react-bootstrap");
var $ = require("jquery");
var filesaver = require("./FileSaver");
var browser = require("bowser");
var classNames = require("classnames");
var PureRenderMixin = require("react-addons-pure-render-mixin");
var createReactClass = require('create-react-class');

var Bobble = createReactClass({
    mixins: [PureRenderMixin],
    render: function(){
        var cs = {
            "bobble": true
        };
        if (this.props.active){
            cs.active = true;
        }
        return <span className={classNames(cs)}
            onClick={this.props.onClick}
        >{this.props.text}</span>;
    }
});

var FileSaver = createReactClass({
    close: function(){
        this.props.onHide();
    },
    save: function(){
        filesaver.saveAs(
            this.props.blob,
            this.refs.input.getValue()
        );
        this.props.onHide();
    },
    render: function(){
        var ref;
        if (this.props.blob.type.lastIndexOf("image", 0) === 0){
            ref = <img src={URL.createObjectURL(this.props.blob)}/>;
        }
        var klass = "savefile popup modal";
        if (this.props.klass)
            klass = klass + " " + this.props.klass;

        var prompt;
        if (browser.safari){
            if (ref) {
                prompt = <div>
                    Please right click on the image, then 'Save Image As'.
                </div>;
            } else {
                prompt = <div>
                    Unfortunately, data saving doesn't work in Safari due to
                    bugs and limitations of the browser. I've worked hard to
                    make binvis work in all browsers, but in this case I
                    recommend Chrome or Firefox.
                </div>;
            }
        } else if (browser.ios){
            if (ref) {
                prompt = <div>
                    Please long-tap on the image, then 'Save Image'.
                </div>;
            } else {
                prompt = <div>
                    Unfortunately, data saving does not work in Safari on IOS.
                </div>;
            }
        } else {
            prompt = <div>
                <ReactBootstrap.Input
                    type="text"
                    ref="input"
                    label="Save as:"
                    defaultValue={this.props.name}
                />
                <div>
                    <ReactBootstrap.Button
                        bsStyle="primary"
                        onClick={this.save}
                    >Save</ReactBootstrap.Button>
                    <ReactBootstrap.Button
                        onClick={this.close}
                        bsStyle="primary"
                    >Cancel</ReactBootstrap.Button>
                </div>
            </div>;

        }

        var body;
        if (ref){
            body = <div className="row body">
                <div className="col-md-9 prompt">{prompt}</div>
                <div className="col-md-3">{ref}</div>
            </div>;
        } else {
            body = <div className="row body">
                <div className="col-md-12 prompt">{prompt}</div>
            </div>;
        }
        return  <ReactBootstrap.Modal
            show={true}
            title={this.props.title}
            className={klass}
            onHide={this.props.onHide}
        > {body} </ReactBootstrap.Modal>;
    }
});


var media_query = window.matchMedia("(min-width: 750px)");
var MediaMixin = {
    getInitialState: function() {
        return {
            media: this.get_media_state()
        };
    },
    get_media_state: function(){
        if (media_query.matches){
            return "large";
        } else {
            return "small";
        }
    },
    update_media_state: function (){
        this.setState({
            media: this.get_media_state()
        });
    },
    componentDidMount: function(){
        media_query.addListener(this.update_media_state);
    },
    componentWillUnmount: function(){
        media_query.removeListener(this.update_media_state);
    }
};

var DismissOnClick = {
    componentDidMount: function(){
        var self = this;
        $(document).on("click", function(evt){
            if ($(evt.target).parents(".popover").length === 0){
                self.dismiss();
            }

        });
    },
    componentWillUnmount: function(){
        $(document).off("click");
    }
};


var ProgressBar = createReactClass({
    render: function(){
        bar = {
            width: this.props.progress + "%"
        };
        return <div className="progress">
            <div
                style={bar}
                className="progress-bar">
            </div>
        </div>;
    }
});

var ModalProgress = createReactClass({
    render: function(){
        return <div className="progressor">
            <div className="row">
                <div className="box col-md-4 col-md-offset-4">
                    <ProgressBar progress={this.props.progress}/>
                    <p>{this.props.message}</p>
                </div>
            </div>
        </div>;
    }
});

module.exports = {
    ProgressBar: ProgressBar,
    ModalProgress: ModalProgress,
    DismissOnClick: DismissOnClick,
    FileSaver: FileSaver,
    Bobble: Bobble,
    MediaMixin: MediaMixin
};
