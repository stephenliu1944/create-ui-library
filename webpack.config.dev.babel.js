import path from 'path';
import webpack from 'webpack';
import webpackMerge from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { settings } from 'http-proxy-config';
import baseConfig from './webpack.config.base';
import pkg from './package.json';

const { servers, proxies } = pkg.devEnvironments;

export default function(env = {}) {
    return webpackMerge(baseConfig(env), {
        entry: {
            main: ['./test/index.js']
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
                ...settings(proxies)
            }
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
                        configFile: '.eslintrc.json'
                    }
                }]
            }]
        },
        plugins: [
            // 配置全局变量
            new webpack.DefinePlugin({
                __DEV__: true,
                'process.env.NODE_ENV': JSON.stringify('development')
            }),
            new HtmlWebpackPlugin({                             // 主页面入口index.html
                filename: 'index.html',
                template: './test/template.html'
            })
        ]
    });
}