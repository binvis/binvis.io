
var React = require("react");
var _ = require("lodash");

module.exports = React.createClass({
    render: function() {
        var keyrows = [];
        _.each(this.props.scheme.key, function(x, off){
            var style = {
                "backgroundColor": x[1]
            };
            keyrows.push(
                <tr key={off}>
                    <td className="keyname">{x[0]}</td>
                    <td style={style} className="keycolor">&nbsp;</td>
                </tr>
            );
        });
        return (
            <table className="legend">
                <tbody>
                    <tr>
                        <td colSpan="2" className="heading">
                            {this.props.scheme.name}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <table className="keytable">
                                <tbody>{keyrows}</tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
});
