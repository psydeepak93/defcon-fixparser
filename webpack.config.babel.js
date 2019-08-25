import path from 'path';

import webpack from 'webpack';
import yargs from 'yargs';

import pkg from './package';

const { optimizeMinimize } = yargs.alias('p', 'optimize-minimize').argv;
const nodeEnv = optimizeMinimize ? 'production' : 'development';

const commonConfig = {
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: { babelrcRoots: ['.', '../'] },
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.json'],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(nodeEnv),
                __PACKAGE_VERSION__: JSON.stringify(pkg.version),
                __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
            },
        }),
    ],
    devtool: optimizeMinimize ? 'inline-source-map' : false,
};

const nodeConfig = Object.assign({}, commonConfig, {
    entry: {
        FIXParser: './src/FIXParser.ts',
    },
    output: {
        path: path.join(__dirname),
        filename: 'fixparser.js',
        library: 'FIXParser',
        libraryTarget: 'umd',
    },
    target: 'node',
});

const serverConfig = Object.assign({}, commonConfig, {
    entry: {
        FIXParser: './src/FIXServer.ts',
    },
    output: {
        path: path.join(__dirname),
        filename: 'server.js',
        library: 'FIXParser',
        libraryTarget: 'umd',
    },
    target: 'node',
});

const browserConfig = Object.assign({}, commonConfig, {
    entry: {
        FIXParser: './src/FIXParserBrowser.ts',
    },
    output: {
        path: path.join(__dirname),
        filename: 'browser.js',
        library: 'FIXParser',
        libraryTarget: 'umd',
    },
    target: 'web',
});

export default [nodeConfig, serverConfig, browserConfig];
