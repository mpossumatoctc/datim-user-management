var webpack = require('webpack');
var path = require('path');

module.exports = {
    context: __dirname,
    entry: './src/index.js',
    output: {
        path: path.join(__dirname, '/build'),
        filename: 'index.js',
    },
    //module: {
    //    loaders: [
    //        {
    //            test: /\.jsx?$/,
    //            exclude: [/(node_modules)/, /d2\-ui/],
    //            loader: 'babel',
    //            query: {
    //                stage: 0,
    //            },
    //        },
    //        {
    //            test: /\.css$/,
    //            loader: 'style-loader!css-loader',
    //        },
    //    ],
    //},
    resolve: {
        alias: {
            jquery: path.resolve('./vendor/jquery/dist/jquery.js'),
        },
    },
    plugins: [
        new webpack.optimize.DedupePlugin(),
    ],
    devtool: ['sourcemap'],
    devServer: {
        contentBase: './src/',
        progress: true,
        colors: true,
        port: 8081,
        inline: true,
    },
};