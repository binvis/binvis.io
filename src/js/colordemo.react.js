var React = require("react");
var utils = require("./utils");


function getContrastYIQ(hexcolor){
    var r = parseInt(hexcolor.substr(1,2),16);
    var g = parseInt(hexcolor.substr(3,2),16);
    var b = parseInt(hexcolor.substr(5,2),16);
    var yiq = ((r*299)+(g*587)+(b*114))/1000;
    return (yiq >= 128) ? "black" : "white";
}

module.exports = React.createClass({
    render: function() {
        var cells = [];
        for (var i = 0; i < 256; i++){
            var background = this.props.colorscheme.color_value(i);
            var style = {
                "backgroundColor": background,
                "color": getContrastYIQ(background)
            };
            var disp;
            if (this.props.blank)
                disp = <span></span>;
            else if (i == 32)
                disp = <span></span>;
            else if (i >= 32 && i <= 126)
                disp = String.fromCharCode(i);
            else
                disp = utils.num(i, 16, 2);
            cells.push(
                <span
                    style={style}
                    key={i}
                >{disp}</span>
            );
        }
        return (
            <div className="colordemo">{cells}</div>
        );
    }
});
