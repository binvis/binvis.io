var React = require("react");

module.exports = React.createClass({
    render: function () {
        return <div className="changelog content">
                <div className="row">
                    <div className="col-md-6 body">
                    <h3> 13 February 2016 </h3>
                    <ul>

                        <li> Almost a year since the last update, and every
                        dependency has had a major update - this release moves
                        to the new hotness on all fronts.</li>
                        <li> Restore the hexview scrollbar. </li>
                        <li> Bugfix: "Resolve" an annoying flicker on Chrome by
                        disabling cursor blink for the moment.</li>
                        <li> Bugfix: Prevent mouse scrolling on hex view from
                        jumping the file position around erratically.</li>

                    </ul>

                    <h3> 8 March 2015 </h3>
                    <ul>
                        <li> Eke out 10% more hover performance.</li>
                        <li> Fix some small weirdnesses on the landing page.</li>

                        <li> Add a multi-hued colorscheme for byte magnitude,
                        with luminance calculated to increase linearly. Uses <a
                        href="https://github.com/gka/chroma.js">chroma.js</a>
                        and ideas from <a
                        href="https://vis4.net/blog/posts/mastering-multi-hued-color-scales/">this
                        excellent article.</a></li>

                    </ul>

                    <h3> 28 February 2015 </h3>
                    <ul>
                        <li> Improve focus behaviour for non-aligned views.</li>
                    </ul>

                    <h3> 19 February 2015 </h3>
                    <ul>
                        <li> Update underlying libraries, resulting in small speed boost.</li>

                        <li> Fix logo hover in Safari.</li>
                    </ul>

                    <h3> 19 January 2015 </h3>
                    <ul>
                        <li> Fix focus alignment behaviour at the end of ranges.</li>

                        <li> Better spacing for file save dialogs.</li>

                        <li> File save doesn't work in Safari. Recommend Chrome
                        or Firefox.</li>
                    </ul>

                    <h3> 17 January 2015 </h3>
                    <ul>
                        <li> Help page explaining curves and color schemes.</li>

                        <li> Interactive curve demos on help page.</li>

                        <li> More informative save file dialogs (with image previews).</li>

                        <li> New look and feel for modal pages.</li>

                    </ul>

                    <h3> 14 January 2015 </h3>
                    <ul>
                        <li> Detail color palette that assigns a different color to each
                        byte value. Thanks to the magic of the Hilbert curve, these
                        colours are chosen to be maximally distinct, but with values close
                        together still being similar.</li>
                    </ul>

                    <h3> 13 January 2015 </h3>
                    <ul>
                        <li> A living, randomly generated logo for binvis.io. Stroke of
                        genius or over-complicated folly? You decide. </li>
                    </ul>

                    <h3> 11 January 2015 </h3>
                    <ul>
                        <li> Rough adaptations for mobile devices and touch interactions </li>
                    </ul>

                    <h3> 8 January 2015 </h3>
                    <ul>
                        <li> Change scan curve to zig-zag, instead of always moving from
                        left to right.</li>
                        <li> Make hex/dec offset toggle explcit with buttons </li>
                        <li> Show view and total file size </li>
                    </ul>

                    <h3> 7 January 2015 </h3>
                    <ul>
                        <li> Changelog </li>
                        <li> Clarify app flow by making About and Changelog modals </li>
                        <li> Cope better with very small ranges</li>
                        <li> Nice filenames for image exports </li>
                        <li> Export current view as data </li>
                    </ul>

                    <h3> 6 January 2015 </h3>
                    <ul>
                        <li> Huge improvement in responsiveness </li>
                        <li> "Start view here" and "End view here" context
                        menu on bytes for exact view selection. </li>
                    </ul>
                </div>
            </div>
        </div>;
    }
});
