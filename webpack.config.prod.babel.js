import path from 'path';
import webpackMerge from 'webpack-merge';
import TerserPlugin from 'terser-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import baseConfig from './webpack.config.base';
import pkg from './package.json';

const { library, externals } = pkg.parcel;
const JS_FILE = pkg.name + '.js';
const CSS_FILE = pkg.name + '.css';
const MIN_JS_FILE = pkg.name + '.min.js';
const MIN_CSS_FILE = pkg.name + '.min.css';
const ParcelList = [{
    // 非压缩配置
    mode: 'none',
    output: {
        filename: JS_FILE
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: CSS_FILE
        })
    ]
}, {
    // 压缩配置
    mode: 'production',
    output: {
        filename: MIN_JS_FILE
    },
    optimization: {
        minimizer: [
            new TerserPlugin(),
            new OptimizeCSSAssetsPlugin()
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: MIN_CSS_FILE
        })
    ]
}];

export default ParcelList.map(config => {
    return webpackMerge(baseConfig('production'), {
        // 公共配置
        entry: {
            // js 和 css 是分离的所以分开打包
            main: [
                './src/styles/index.less',
                './src/publicPath.js',
                './src/index.js'                    // index.js 要放最后, issue: When combining with the output.library option: If an array is passed only the last item is exported.
            ]
        },
        output: {
            library,
            libraryTarget: 'umd'
        },
        externals
    }, config);
});