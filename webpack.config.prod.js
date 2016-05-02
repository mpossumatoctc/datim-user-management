var webpack = require('webpack');
var webpackBaseConfig = require('./webpack.config');
var pckg = require('./package.json');
var path = require('path');

webpackBaseConfig.output = {
    path: path.join(__dirname, '/build'),
    filename: `user-maintenance-${pckg.version}.js`,
};

webpackBaseConfig.plugins = [
    // Replace any occurance of process.env.NODE_ENV with the string 'production'
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: '\'production\'',
        },
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
    //     minimize: false,
        sourceMap: true,
        mangle: false,
        enclose: false,
        comments: false,
    }),
];

module.exports = webpackBaseConfig;