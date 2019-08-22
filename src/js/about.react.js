var React = require("react");

module.exports = React.createClass({
    render: function () {
        return <div className="about content">
                <div className="row">
                    <div className="col-md-6 body">

                        <p> Binvis lets you visually dissect and analyze binary
                        files. It's the interactive grandchild of a static
                        visualisation tool I published a few years ago. Many of
                        the ideas here are discussed in more detail on my
                        blog:</p>

                        <ul>

                            <li>
                                <a href="http://corte.si/posts/visualisation/entropy/index.html">
                                Visualizing entropy in binary files
                                </a>
                            </li>

                            <li>
                                <a href="http://corte.si/posts/visualisation/malware/index.html">
                                Malware
                                </a>
                            </li>


                            <li>
                                <a href="http://corte.si/posts/visualisation/binvis/index.html">
                                Visualizing binaries with space-filling curves
                                </a>
                            </li>

                        </ul>

                        <div className="contact">
                            <div>
                                <a href="http://twitter.com/cortesi">
                                    <i className="fa fa-lg fa-twitter"/>
                                    @cortesi
                                </a>
                            </div>
                            <div>
                                <a href="http://corte.si">
                                    <i className="fa fa-lg fa-rss"/>
                                    http://corte.si
                                </a>
                            </div>
                        </div>


                    </div>
                </div>
            </div>;
    }
});
