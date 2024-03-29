'use strict'

// process.env.BABEL_ENV = 'web';

const path = require('path');
const webpack = require('webpack');
// const MinifyPlugin = require("babel-minify-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const tsImportPluginFactory = require('ts-import-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { getLocalIPs } = require("./utils");
const config = require("../config.json");

let webConfig = {
    devtool: '#cheap-module-eval-source-map',
    entry: {
        web: path.join(__dirname, '../src/web/main.ts')
    },
    externals: {
        // 'vue': 'Vue',
        // 'vue': "VueRouter",
        // 'axios': 'axios',
        // 'element-ui': 'ELEMENT',
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: ['vue-style-loader', 'css-loader', 'less-loader']
            },
            {
                test: /\.css$/,
                use: ['vue-style-loader', 'css-loader']
            },
            {
                test: /\.html$/,
                use: 'vue-html-loader'
            },
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            },
            {
                test: /\.vue$/,
                use: {
                    loader: 'vue-loader',
                    options: {
                        extractCSS: true,
                        loaders: {
                            sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax=1',
                            scss: 'vue-style-loader!css-loader!sass-loader',
                            less: 'vue-style-loader!css-loader!less-loader'
                        }
                    }
                }
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use: {
                    loader: 'url-loader',
                    query: {
                        limit: 10000,
                        name: 'imgs/[name].[ext]'
                    }
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use: {
                    loader: 'url-loader',
                    query: {
                        limit: 10000,
                        name: 'fonts/[name].[ext]'
                    }
                }
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({ filename: 'styles.css' }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, '../src/index.ejs'),
            minify: {
                collapseWhitespace: true,
                removeAttributeQuotes: true,
                removeComments: true
            },
            nodeModules: false
        }),
        new webpack.DefinePlugin({
            'process.env.IS_WEB': 'true',
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ],
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vender: {
                    name: 'vender',
                    test: /[\\/]node_modules[\\/]/,
                    priority: 10,
                    chunks: 'initial' // 只打包初始时依赖的第三方
                },
                elementUI: {
                    name: "element-ui", // 单独将 elementUI 拆包
                    priority: 20, // 权重要大于 libs 和 app 不然会被打包进 libs 或者 app
                    test: /[\\/]node_modules[\\/]element-ui[\\/]/
                },
                jsonEditor: {
                    name: "jsoneditor", // 单独将 elementUI 拆包
                    priority: 20, // 权重要大于 libs 和 app 不然会被打包进 libs 或者 app
                    test: /[\\/]node_modules[\\/]v-jsoneditor[\\/]/
                },
            }
        },
        runtimeChunk: 'single',
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, '../dist/web')
    },
    resolve: {
        alias: {
            '@': path.join(__dirname, '../src/web'),
            'vue$': 'vue/dist/vue.esm.js'
        },
        extensions: ['.ts', '.js', '.vue', '.json', '.css']
    },
    target: 'web'
}

/**
 * Adjust webConfig for production settings
 */
if (process.env.NODE_ENV == 'production') {
    webConfig.devtool = '';

    let definePluginParams = {
        "process.env.NODE_ENV": '"production"',
    }

    if (config.domain) {
        definePluginParams['process.env.SERVER_BASE_URL'] = `'${config.domain}'`;
    }

    webConfig.plugins.push(
        // new MinifyPlugin(),
        new CopyWebpackPlugin([
            {
                from: path.join(__dirname, '../static/live2d'),
                to: path.join(__dirname, '../dist/web/static/live2d'),
                ignore: ['.*']
            },
            {
                from: path.join(__dirname, '../static/favicon.ico'),
                to: path.join(__dirname, '../dist/web/static/favicon.ico'),
                ignore: ['.*']
            }
        ]),
        new webpack.DefinePlugin(definePluginParams),
        new webpack.LoaderOptionsPlugin({ minimize: true })
    );
} else {
    webConfig.plugins.push(
        new webpack.DefinePlugin({
            'process.env.SERVER_BASE_URL': `'http://${getLocalIPs()[0].address}:${config.proxyHttpPort}'`
        }),
        // new BundleAnalyzerPlugin({
        //     analyzerMode: 'server',
        //     analyzerHost: '127.0.0.1',
        //     analyzerPort: 9088,
        //     reportFilename: 'report.html',
        //     defaultSizes: 'parsed',
        //     openAnalyzer: true,
        //     generateStatsFile: false,
        //     statsFilename: 'stats.json',
        //     statsOptions: null,
        //     logLevel: 'info'
        // }),
    );
}

module.exports = webConfig
