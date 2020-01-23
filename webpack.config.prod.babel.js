import path from 'path';
import webpack from 'webpack';
import define from '@easytool/define-config';
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

const JSParcels = [{
    // 非压缩配置
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
}, {
    // 压缩配置
    mode: 'production',
    output: {
        filename: JS_MIN_FILE
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
}];

const CSSParcels = [{
    // 非压缩配置
}, { 
    // 压缩配置
}];

export default JSParcels.map(config => {
    return webpackMerge(baseConfig(), {
        entry: {
            main: ['./src/index.js']
        },
        output: {
            library: LIB_NAME,
            libraryTarget: 'umd'
        },
        // externals: {
        //     jquery: 'jQuery'
        // },
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
        }
    }, config);
}).concat(CSSParcels);