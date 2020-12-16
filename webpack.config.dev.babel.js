import webpack from 'webpack';
import webpackMerge from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import WebpackBundleAnalyzer from 'webpack-bundle-analyzer';
import proxyConfig from '@easytool/proxy-config';
import defineConfig from '@easytool/define-config';
import getBaseConfig from './webpack.config.base';
import { devEnvironments } from './package.json';

const NODE_ENV = process.env.NODE_ENV;  // development, link
const { servers, proxies, globals } = devEnvironments;
const baseConfig = getBaseConfig();

export default webpackMerge(baseConfig, {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    devServer: {
        writeToDisk: NODE_ENV === 'link',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true'
        },
        host: '0.0.0.0',
        port: servers.local,
        inline: true,
        compress: true,             // 开起 gzip 压缩
        disableHostCheck: true,
        historyApiFallback: true,   // browserHistory路由
        contentBase: baseConfig.output.path,
        proxy: {
            ...proxyConfig(proxies)
        }
    },
    plugins: [
        // 主页面入口index.html
        NODE_ENV === 'development' && new HtmlWebpackPlugin({                             
            filename: 'index.html',
            template: './test/index.ejs'
        }),
        // 配置全局变量
        NODE_ENV === 'development' && new webpack.DefinePlugin({
            ...defineConfig(globals)
        })
        // 依赖包分析
        // NODE_ENV === 'development' && new WebpackBundleAnalyzer.BundleAnalyzerPlugin()
    ].filter(Boolean)
});

