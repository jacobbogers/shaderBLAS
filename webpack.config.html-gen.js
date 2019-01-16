'use strict'
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {
    resolve
} = require('path');

const packJSON = require('./package.json')

const version = packJSON.version

module.exports = {
    entry: {
        app: resolve('app.js')
    },
    output: {
        path: resolve('dist'),
        filename: () => `pck/[name]-${version}-[hash].js`
    },
    plugins: [
        new CleanWebpackPlugin(['dist/**/*.*']),
        new HtmlWebpackPlugin(),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: () => `[name]-${version}.css`,
            chunkFilename: "[id].css"
        })
    ],
    module: {
        rules: [{

                test: /jpg$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]'
                }

            },
            //css-start
            {
                test: /\.css$/,
                use: [
                    /*{
                        loader: 'file-loader',
                        options: {
                            name: function (fileName) {
                                return '[name].-v3-[hash].[ext]'
                            }
                        },
                    },*/
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // you can specify a publicPath here
                            // by default it use publicPath in webpackOptions.output
                            publicPath: '../'
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                        }
                    }
                ]
            }
             //css-end
        ]
    }
}