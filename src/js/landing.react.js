
var React = require("react");
var ReactRouter = require("react-router");
var Reflux = require("reflux");
var createReactClass = require('create-react-class');
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

var viewstore = require("./stores/view");
var Logo = require("./logo.react");

export default createReactClass({
    mixins: [
        // ReactRouter.Navigation,
        // ReactRouter.State,
        Reflux.listenTo(viewstore.store, "_onChange")
    ],
    contextTypes: {
        router: PropTypes.object
    },
    getInitialState: function() {
        var view = viewstore.store.get_data();
        return {
            view: view,
            error: null
        };
    },
    _onChange: function(){
        this.setState({
            view: viewstore.store.get_data()
        });
    },
    load_file: function (evt) {
        self = this;
        var file = evt.target.files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            // Trigger immediately, so state is present when fileview loads
            viewstore.actions.load.trigger(
                true,
                file.name,
                new Uint8Array(
                    reader.result,
                    0,
                    reader.result.byteLength
                )
            );
            self.context.router.history.push("/view/local");
        };
        reader.readAsArrayBuffer(file);
    },
    click: function(){
        var fileInput = document.querySelector("#fileinput");
        fileInput.click();
    },
    render: function () {
        return <div className="landing">
            <div className="row">
                <div className="banner">
                    <Logo size={120}/>
                    <h1>binvis.io</h1>
                    <p>visual analysis of binary files</p>
                </div>
            </div>
            <div className="row">
                <div className="pickbox col-md-2 col-md-offset-5">

                    <input id="fileinput" onChange={this.load_file} type="file"></input>
                    <div>
                        <button
                            className="btn btn-primary btn-med"
                            onClick={this.click}
                            id="filebutton">Open File</button>
                    </div>
                </div>
            </div>
            <div className="row examples">
                <div className="col-md-2 col-md-offset-3">
                    <Link to="/view/examples/elf-Linux-ARMv7-ls.bin">
                        <div>ELF Linux ARM</div>
                        <img src="examples/elf-Linux-ARMv7-ls.thumb.jpg"></img>
                    </Link>
                </div>
                <div className="col-md-2">
                    <Link to="#/view/examples/tcpview.exe.bin">
                        <div>MS Windows PE32</div>
                        <img src="examples/tcpview.exe.thumb.jpg"></img>
                    </Link>
                </div>
                <div className="col-md-2">
                    <Link to="#/view/examples/metricprops.pdf.bin">
                        <div>PDF</div>
                        <img src="examples/metricprops.pdf.thumb.jpg"></img>
                    </Link>
                </div>
            </div>

            <div className="row contact">
                <div className="col-md-6 col-md-offset-3">
                    <a href="http://corte.si">
                        Aldo Cortesi
                    </a><br/>
                    <a href="http://twitter.com/cortesi">
                        @cortesi
                    </a>
                </div>
            </div>


        </div>;
    }
});
