import path from 'path';
import webpack from 'webpack';
import define from '@middlend/define';
import webpackMerge from 'webpack-merge';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import baseConfig from './webpack.config.base';
import pkg from './package.json';

const { globals } = pkg.devEnvironments;
const LIB_NAME = pkg.libraryName;
const JS_FILE = pkg.name + '.js';
const CSS_FILE = pkg.name + '.css';
const JS_MIN_FILE = pkg.name + '.min.js';
const CSS_MIN_FILE = pkg.name + '.min.css';

export default function(env = {}) {
    // 非压缩配置
    var uncompressedConfig = {
        mode: 'development',
        output: {
            filename: JS_FILE
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: CSS_FILE
            }),
            // 配置全局变量
            new webpack.DefinePlugin({
                ...define(globals, false),
                'process.env.NODE_ENV': JSON.stringify('development')
            })
        ]
    };
    // 压缩配置
    var compressedConfig = {
        mode: 'production',
        output: {
            filename: JS_MIN_FILE
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: CSS_MIN_FILE
            }),
            // 配置全局变量
            new webpack.DefinePlugin({
                ...define(globals, false),
                'process.env.NODE_ENV': JSON.stringify('production')
            })
        ]
    };

    return webpackMerge(baseConfig(env), {
        entry: {
            main: ['./src/index.js']
        },
        output: {
            library: LIB_NAME,
            libraryTarget: 'umd'
        },
        module: {
            rules: [{
                /**
                 * eslint代码规范校验
                 */
                test: /\.(js|jsx)$/,
                enforce: 'pre',
                include: path.resolve(__dirname, 'src'),
                use: [{
                    loader: 'eslint-loader',
                    options: {
                        fix: true,
                        configFile: '.eslintrc.prod.json'
                    }
                }]
            }]
        },
        optimization: {
            minimizer: [
                new UglifyJsPlugin({
                    cache: true,
                    parallel: true,
                    extractComments: true,
                    sourceMap: true
                }),
                new OptimizeCSSAssetsPlugin()
            ]
        }
    }, process.env.BUILD_COMPRESS ? compressedConfig : uncompressedConfig);
}