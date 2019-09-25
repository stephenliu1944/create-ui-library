import path from 'path';
import webpack from 'webpack';
import define from '@middlend/define';
import webpackMerge from 'webpack-merge';
import baseConfig from './webpack.config.base';
import pkg from './package.json';

const LIB_NAME = pkg.libraryName;
const FILE_NAME = pkg.name;
const { globals } = pkg.devEnvironments;

export default function(env = {}) {
    console.log('process.env.BUILD_COMPRESS)--------------', process.env.BUILD_COMPRESS);
    // 非压缩配置
    uncompressedConfig = {
        mode: 'development',
        output: {
            filename: FILE_NAME + '.js'
        },
        // optimization: {
        //     minimizer: [
        //         new OptimizeCSSAssetsPlugin()
        //     ]
        // },
        plugins: [
            new MiniCssExtractPlugin({
                filename: FILE_NAME + '.css'
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
            filename: FILE_NAME + '.min.js'
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
                filename: FILE_NAME + '.min.css'
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
        }
    }, process.env.BUILD_COMPRESS ? compressedConfig : uncompressedConfig);
}