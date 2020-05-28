const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = (env, argv) => {
    return merge(common(env, argv), {
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
}