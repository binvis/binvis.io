
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devServer: {
        proxy: {
            '/examples': {
                target: 'http://localhost:8080',
                pathRewrite: {'^/examples' : '/build/examples'}
            }
        },
    },
});