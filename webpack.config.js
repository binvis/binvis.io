const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: "./src/js/binvis.react.js",
    devServer: {
        proxy: {
            '/examples': {
                target: 'http://localhost:8080',
                pathRewrite: {'^/examples' : '/build/examples'}
            }
        },
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: "[name].[hash].js",
        sourceMapFilename: "[name].[hash].map",
    },
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
    plugins: [
        new HtmlWebpackPlugin(
            {
                template: path.resolve(__dirname, 'src/index.html'),
                path: path.resolve(__dirname, 'build'),
            },
        ),
    ]
};