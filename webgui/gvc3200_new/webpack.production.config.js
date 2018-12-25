var webpack = require('webpack');
var path = require("path");
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, "./src/components");
var BUILD_PATH = path.resolve(ROOT_PATH, "build");
const theme = require(APP_PATH + "/theme.js");

module.exports = {
    entry:
    {
        main:  "./src/components/entry.js",
        vendor: ['babel-polyfill', 'react', 'react-dom', 'intl', 'react-intl']
    },
    devtool: "source-map",
    output: {
        path: BUILD_PATH,
        publicPath: "/",
        filename: "gs-app.js",
        chunkFilename: '[name].chunk.js',
    },
    module: {
        rules: [
            { test: /\.css$/, use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: [
                {
                    loader: require.resolve('css-loader'),
                    options: {
                        minimize: true
                    }
                }
            ]})},
            {
                test: /\.less$/,
                use: [
                    require.resolve('style-loader'),
                    require.resolve('css-loader'),
                    {
                        loader: require.resolve('less-loader'),
                        options: {
                            modifyVars: theme,
                        },
                    },
                ],
            },
            { test: /\.js[x]?$/, exclude: /node_modules/, loader: 'babel-loader'},
            { test: /\.(png|jpg|gif)$/, loader: 'url-loader?limit=8192&name=img/[name].[ext]' },
            { test: /\.(gif)$/, loader: 'image-webpack-loader' },
            { test: /\.(woff|woff2|eot|ttf|svg)(\?.*$|$)/, loader: 'url-loader' }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css', '.less'],
        /*alias: {
            'jquery': path.resolve(ROOT_PATH, './js/jquery-2.2.1.min.js'),
        }*/
    },
    plugins: [
        new CopyWebpackPlugin([
            {
                from: path.resolve(ROOT_PATH, './src/js'),
                to: path.resolve(BUILD_PATH, './js')
            },
            {
                from: path.resolve(ROOT_PATH, './src/lang'),
                to: path.resolve(BUILD_PATH, './lang')
            },
            {
                from: path.resolve(ROOT_PATH, './src/img/favicon.ico'),
                to: path.resolve(BUILD_PATH, './img/favicon.ico')
            },
            {
                from: path.resolve(ROOT_PATH, './src/iconfont'),
                to: path.resolve(BUILD_PATH, './iconfont')
            }
        ]),
        new HtmlWebpackPlugin({
            template: path.resolve(ROOT_PATH, './index.html'),
            inject: false
        }),
        new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.js' }),
        new ExtractTextPlugin("[name].css"),
        // jquery配置
        //new webpack.ProvidePlugin({ $: "jquery", jQuery: "jquery" }),

        // 压缩配置
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),

        // 配置环境变量到Production，防止控制台警告
        new webpack.DefinePlugin({
          "process.env": {
             NODE_ENV: JSON.stringify("production")
           }
       })
　　]

};
