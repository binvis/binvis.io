const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = (env, argv) => {
  var DST = "build";
  if (argv.mode == "production") {
    DST = "build-prod";
  };
  var config = {
    entry: "./src/js/binvis.react.js",
    module: {
      rules: [
        {
          test: /\.less$/,
          use: [
            "style-loader",
            "css-loader",
            "less-loader",
          ]
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'fonts/'
              }
            }
          ]
        }
      ]
    },
    output: {
        path: path.resolve(__dirname, DST),
        filename: "[name].[hash].js",
        sourceMapFilename: "[name].[hash].map",
    },
    plugins: [
        new HtmlWebpackPlugin(
            {
                template: path.resolve(__dirname, 'src/index.html'),
                path: path.resolve(__dirname, DST),
            },
        ),
    ]
  };
  return config;
};