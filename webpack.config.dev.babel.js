import path from 'path';
import webpack from 'webpack';
import webpackMerge from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import proxyConfig from '@easytool/proxy-config';
import defineConfig from '@easytool/define-config';
import baseConfig from './webpack.config.base';
import pkg from './package.json';

const JS_FILE = pkg.name + '.js';
const CSS_FILE = pkg.name + '.css';
const { servers, proxies, globals } = pkg.devEnvironments;

export default webpackMerge(baseConfig('development'), {
    mode: 'development',
    entry: {
        main: ['./test/app.js']
    },
    output: {
        filename: JS_FILE
    },
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        host: '0.0.0.0',
        port: servers.local,
        disableHostCheck: true,
        compress: true,             // 开起 gzip 压缩
        inline: true,
        historyApiFallback: true,   // browserHistory路由
        contentBase: path.resolve(__dirname, 'build'),
        proxy: {
            ...proxyConfig(proxies)
        }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: CSS_FILE
        }),
        // 配置全局变量
        new webpack.DefinePlugin({
            ...defineConfig(globals)
        }),
        new HtmlWebpackPlugin({                             // 主页面入口index.html
            filename: 'index.html',
            template: './test/template.ejs'
        })
    ]
});