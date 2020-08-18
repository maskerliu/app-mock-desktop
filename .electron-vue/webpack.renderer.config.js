"use strict";

process.env.BABEL_ENV = "renderer";
const path = require("path");
const { dependencies } = require("../package.json");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const TerserPlugin = require("terser-webpack-plugin");
const tsImportPluginFactory = require('ts-import-plugin');
const camel2Dash = require('camel-2-dash');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { getLocalIPs } = require("./utils");
const config = require("../config.json");

let whiteListedModules = ["vue"];

let rendererConfig = {
    devtool: "#eval-source-map",
    entry: {
        renderer: path.join(__dirname, "../src/renderer/main.ts")
    },
    externals: [
        ...Object.keys(dependencies || {}).filter(d => !whiteListedModules.includes(d)),
    ],
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ["vue-style-loader", "css-loader", "sass-loader"]
            },
            {
                test: /\.sass$/,
                use: ["vue-style-loader", "css-loader", "sass-loader?indentedSyntax"]
            },
            {
                test: /\.less$/,
                use: ["vue-style-loader", "css-loader", "less-loader"]
            },
            {
                test: /\.css$/,
                use: ["vue-style-loader", "css-loader"]
            },
            {
                test: /\.tsx?$/,
                use: [
                    'babel-loader',
                    {
                        loader: "ts-loader",
                        options: {
                            appendTsSuffixTo: [/\.vue$/],
                            transpileOnly: true,
                            getCustomTransformers: () => ({
                                before: [tsImportPluginFactory({
                                    libraryName: 'element-ui',
                                    libraryDirectory: 'lib',
                                    camel2DashComponentName: true,
                                    style: (_path) =>
                                        path.join('element-ui', 'lib', 'theme-chalk', `${
                                            camel2Dash(path.basename(_path, '.js'))}.css`),
                                })]
                            }),
                            compilerOptions: {
                                module: 'es2015'
                            },
                        }
                    }
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.node$/,
                use: "node-loader"
            },
            {
                test: /\.vue$/,
                use: {
                    loader: "vue-loader",
                    options: {
                        extractCSS: process.env.NODE_ENV === "production",
                        loaders: {
                            sass: "vue-style-loader!css-loader!sass-loader?indentedSyntax=1",
                            scss: "vue-style-loader!css-loader!sass-loader",
                            less: "vue-style-loader!css-loader!less-loader"
                        }
                    }
                }
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use: {
                    loader: "url-loader",
                    query: {
                        limit: 10000,
                        name: "imgs/[name]--[folder].[ext]"
                    }
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: "url-loader",
                options: {
                    limit: 10000,
                    name: "media/[name]--[folder].[ext]"
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use: {
                    loader: "url-loader",
                    query: {
                        limit: 10000,
                        name: "fonts/[name]--[folder].[ext]"
                    }
                }
            }
        ]
    },
    node: {
        __dirname: process.env.NODE_ENV !== "production",
        __filename: process.env.NODE_ENV !== "production"
    },
    plugins: [
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({ filename: "styles.css" }),
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: path.resolve(__dirname, "../src/index.ejs"),
            minify: {
                collapseWhitespace: true,
                removeAttributeQuotes: true,
                removeComments: true
            },
            nodeModules: process.env.NODE_ENV !== "production" ? path.resolve(__dirname, "../node_modules") : false
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ],
    output: {
        filename: "[name].js",
        libraryTarget: "commonjs2",
        path: path.join(__dirname, "../dist/electron")
    },
    resolve: {
        alias: {
            "@": path.join(__dirname, "../src/renderer"),
            "vue$": "vue/dist/vue.esm.js"
        },
        extensions: [".js", ".ts", ".vue", ".json", ".css", ".node"]
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                extractComments: true,
                cache: true,
                parallel: true,
                sourceMap: true, // Must be set to true if using source-maps in production
                terserOptions: {
                    // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
                    extractComments: "all",
                    compress: { drop_console: true, },
                }
            }),
        ],
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
    },
    target: "electron-renderer"
};

/**
 * Adjust rendererConfig for development settings
 */
if (process.env.NODE_ENV !== "production") {
    rendererConfig.plugins.push(
        new webpack.DefinePlugin({
            "__static": `"${path.join(__dirname, "../static").replace(/\\/g, "\\\\")}"`
        })
    );
}

/**
 * Adjust rendererConfig for production settings
 */
if (process.env.NODE_ENV === "production") {
    rendererConfig.devtool = "";

    let definePluginParams = {
        "process.env.NODE_ENV": '"production"',
    }

    if (config.domain) {
        definePluginParams['process.env.SERVER_BASE_URL'] = `'${config.domain}'`;
    }

    rendererConfig.plugins.push(
        new CopyWebpackPlugin([
            {
                from: path.join(__dirname, "../static/jupaixiaoren"),
                to: path.join(__dirname, "../dist/electron/static/jupaixiaoren"),
                ignore: [".*"]
            },
            {
                from: path.join(__dirname, "../static/icon.ico"),
                to: path.join(__dirname, "../dist/electron/static/icon.ico"),
                ignore: [".*"]
            },
            {
                from: path.join(__dirname, "../static/icon_*.png"),
                to: path.join(__dirname, "../dist/electron/"),
                ignore: [".*"]
            }
        ]),
        new webpack.DefinePlugin(definePluginParams),
        new webpack.LoaderOptionsPlugin({ minimize: true })
    );
} else {
    rendererConfig.plugins.push(
        new webpack.DefinePlugin({
            'process.env.SERVER_BASE_URL': `'http://${getLocalIPs()[0].address}:${config.proxyHttpPort}'`
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: 'server',
            analyzerHost: '127.0.0.1',
            analyzerPort: 9089,
            reportFilename: 'report.html',
            defaultSizes: 'parsed',
            openAnalyzer: true,
            generateStatsFile: false,
            statsFilename: 'stats.json',
            statsOptions: null,
            logLevel: 'info'
        }),
    );
}

module.exports = rendererConfig;