const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = (env, argv) => {
    return merge(common(env, argv), {
        mode: 'production',
    });
}