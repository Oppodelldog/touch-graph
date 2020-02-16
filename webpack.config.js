const path = require('path');

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: './src/index.ts',
    output: {
        filename: 'touch-graph.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'touchGraph'
    },
    devServer: {
        contentBase: './dist',
    },
    resolve: {
        extensions: [".ts",".js"]
    },
    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.ts?$/, loader: "awesome-typescript-loader" }
        ],

    },

};
