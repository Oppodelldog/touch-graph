// noinspection JSUnresolvedFunction
const path = require('path');

// noinspection JSUnresolvedVariable
module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: './src/index.ts',
    output: {
        filename: 'touch-graph.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'touchGraph',
    },
    devServer: {
        static: './dist',
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    module: {
        rules: [
            { test: /\.dot$/, use: 'raw-loader' },
            { test: /\.ts?$/, loader: "awesome-typescript-loader" }
        ],

    },
};
