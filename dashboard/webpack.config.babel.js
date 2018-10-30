import path from 'path';

import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

import pkg from './package';

module.exports = {
    entry: {
        dashboard: './src/ApplicationRenderer.js'
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, 'build'),
        publicPath: '',
        library: 'FIXParserDashboard',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [{ loader: 'babel-loader' }],
                exclude: /node_modules/
            },
            {
                test: /\.(css|sass|scss)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                test: /\.jpg$|\.gif$|\.png$|\.mp4$|\.svg$|\.woff$|\.woff2$|\.ttf$|\.eot$|\.ico$/,
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]'
                },
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({ filename: './dashboard.css' }),
        new CopyWebpackPlugin([{ from: 'templates' }]),
        new webpack.DefinePlugin({
            __PACKAGE_VERSION__: JSON.stringify(pkg.version),
            __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
        })
    ],
    context: __dirname,
    devServer: {
        host: '0.0.0.0',
        disableHostCheck: true,
        port: 8090,
        contentBase: __dirname,
        overlay: {
            warnings: false,
            errors: true
        },
        quiet: false,
        noInfo: false
    }
};
