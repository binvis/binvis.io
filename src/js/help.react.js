var React = require("react");
var $ = require("jquery");
var CurveDemo = require("./curvedemo.react");
var ColorDemo = require("./colordemo.react");
var colours = require("./colours");
var classNames = require("classnames");
// Include to enable jQuery plugin
var ScrollTo = require("jquery.scrollto"); // eslint-disable-line no-unused-vars


SideMenu = React.createClass({
    scroll: function(name){
        $(".help.content").scrollTo(
            "." + name,
            { axis: "y"}
        );
    },
    render: function(){
        return <ul className="nav outer">
            <li>
                <a onClick={this.scroll.bind(this, "curves")}> Curves </a>
                <ul className="nav inner">
                    <li onClick={this.scroll.bind(this, "cluster")}><a>cluster</a></li>
                    <li onClick={this.scroll.bind(this, "scan")}><a>scan</a></li>
                </ul>
            </li>
            <li>
                <a onClick={this.scroll.bind(this, "colorschemes")}> Colorschemes </a>
                <ul className="nav inner">
                    <li onClick={this.scroll.bind(this, "byteclass")}><a>byteclass</a></li>
                    <li onClick={this.scroll.bind(this, "magnitude")}><a>magnitude</a></li>
                    <li onClick={this.scroll.bind(this, "detail")}><a>detail</a></li>
                    <li onClick={this.scroll.bind(this, "entropy")}><a>entropy</a></li>
                </ul>
            </li>
        </ul>;
    }
});


Section = React.createClass({
    render: function(){
        var klass = {
            "row": true,
            "section": true
        };
        klass[this.props.name||this.props.title] = true;
        return <div className={classNames(klass)}>
            <div className="col-md-4 center">
                {this.props.left}
            </div>
            <div className="col-md-6">
                <h2>{this.props.title}</h2>
                {this.props.children}
            </div>
        </div>;
    }
});


module.exports = React.createClass({
    render: function () {
        return <div className="help content">
            <div className="row">
                <div className="col-md-2">
                    <SideMenu/>
                </div>

                <div className="col-md-10 helpbody">
                    <section>
                        <h1 className="curves"> Curves </h1>
                        <Section
                            title="cluster"
                            left={
                                <CurveDemo
                                    curve={"cluster"}
                                    size={4}
                                    width={200}
                                    height={400}/>
                            }
                        >
                            <p>The <b>cluster</b> curve makes fine
                                    detail stand out by visually grouping data
                                    that is close together in the file. Use the
                                    cluster curve to pick out details and get a
                                    good overview of the structure of files.</p>

                            <p> This curve exploits a very cool
                                    property of a mathematical construct called
                                    the <a
                                href="http://corte.si/posts/code/hilbert/portrait/index.html">Hilbert
                                    curve</a>: locality preservation. In fact,
                                    the Hilbert curve gives us an almost (but
                                    not quite) optimal way to take a
                                    one-dimensional array of bytes, and arrange
                                    them in two dimensions, such that bytes
                                    that are close together in a single
                                    dimension are also close in two dimensions.
                                    The tradeoff is that the Hilbert Curve is
                                    not very visually intuitive: it is hard to
                                    glean information about offset in a file
                                    simply by looking at the image.</p>
                        </Section>


                        <Section
                            title="scan"
                            left={
                                <CurveDemo
                                    curve={"scan"}
                                    size={4}
                                    width={200}
                                    height={400}/>
                            }
                        >
                            <p>The <b>scan</b> curve has poor clustering
                                    properties, but is very visually intuitive.
                                    Use the scan curve to visually select and
                                    zoom in to data ranges.</p>
                        </Section>
                    </section>

                    <section>
                        <h1 className="colorschemes"> Colorschemes </h1>


                        <Section
                            title="byteclass"
                            left={
                                <ColorDemo
                                    colorscheme={new colours.ByteClass()}
                                />
                            }
                        >

                            <p>The <b>byteclass</b> colorscheme
                                    classifies bytes into a small number of
                                    categories: low bytes, ascii text, high
                                    bytes, and special colors for 0x00 and 0xff.
                                    Tab (09), newline (0a) and carriage return
                                    (0d) are considered to be text.</p>

                            <p>Use the byteclass colorscheme to get a
                                    quick high-level overview of the structure
                                    of a file.</p>

                        </Section>

                        <Section
                            title="magnitude"
                            left={
                                <ColorDemo
                                    colorscheme={new colours.ByteMagnitude()}
                                />
                            }
                        >

                            <p>The <b>magnitude</b> colorscheme varies
                                colour with byte ordinal values (0-255). It uses
                                a multi-hued color scheme, but with luminance
                                calculated to increase linearly.</p>

                            <p>Magitude is an intuitive colorscheme that can
                                reveal small structural details that do not
                                appear in the byteclass scheme.</p>

                        </Section>


                        <Section
                            title="detail"
                            left={
                                <ColorDemo
                                    colorscheme={new colours.Detail()}
                                />
                            }
                        >

                            <p>The <b>detail</b> colorscheme assigns a
                                colour to each different byte value. It tries to
                                maximise the difference between colours, while
                                at the same time keeping colours for bytes that
                                are close in value as similar as possible.</p>

                            <p>To balance these two conflictinc constraints,
                                we again resort to the Hilbert curve. This time,
                                we project the 1-dimensional sequence of byte
                                values in to a 3-dimensional Hilbert curve
                                traversal of the RGB colour cube. You can find
                                an explanation of this technique <a
                                href="http://corte.si/%2Fposts/code/hilbert/portrait/index.html">here</a>.
                            </p>

                        </Section>

                        <Section
                            title="entropy"
                            left={
                                <ColorDemo
                                    blank={true}
                                    colorscheme={new colours.Entropy()}
                                />
                            }
                        >

                            <p>The <b>entropy</b> coloscheme calculates
                                    the Shannon entropy over window surrounding
                                    the byte in question.</p>

                            <p>The entropy view lets you quickly pick
                                    out encrypted and compressed sections.</p>

                        </Section>

                    </section>

                </div>
            </div>
        </div>;
    }
});
