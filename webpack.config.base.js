import path from 'path';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import pkg from './package.json';

const libraryName = pkg.libraryName;
const isProd = process.env.NODE_ENV === 'production';
const ASSETS_PATH = process.env.BUILD_PATH || 'build';
const JS_NAME = 'index.js';
const CSS_NAME = 'index.css';
var thirdpartyCSS = [path.resolve(__dirname, 'node_modules')];

if (!isProd) {
    thirdpartyCSS.push([path.resolve(__dirname, 'es'), path.resolve(__dirname, 'lib')]);
}

export default function(env = {}) {
    return {
        mode: process.env.NODE_ENV,
        entry: {
            main: [`./src/${ isProd ? 'index' : 'dev' }.js`]
        },
        output: {
            publicPath: '/',
            path: path.resolve(__dirname, ASSETS_PATH),
            filename: JS_NAME,
            library: isProd ? libraryName : undefined,
            libraryTarget: isProd ? 'umd' : undefined
        },
        resolve: {
            extensions: ['.js', '.jsx', '.css', '.scss'],
            alias: {
                config: path.resolve(__dirname, 'src/_config/'),
                constants: path.resolve(__dirname, 'src/_constants/'),
                fonts: path.resolve(__dirname, 'src/_fonts/'),
                styles: path.resolve(__dirname, 'src/_styles/'),
                utils: path.resolve(__dirname, 'src/_utils/')
            }
        },
        optimization: {
            // splitChunks: {
            //     minSize: 10,
            //     minChunks: 1,
            //     cacheGroups: {
            //         vendors: {
            //             test: /[\\/]node_modules[\\/]/,
            //             name: 'vendors',
            //             chunks: 'all'
            //         }
            //     }
            // },
            minimizer: isProd ? [
                new UglifyJsPlugin({
                    cache: true,
                    parallel: true,
                    extractComments: true,
                    sourceMap: true
                }),
                new OptimizeCSSAssetsPlugin()
            ] : undefined,
            noEmitOnErrors: true
        },
        module: {
            rules: [{
                test: /\.(js|jsx)?$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true
                    }
                }]
            }, {
                /**
                 * 主项目的css
                 */
                test: /\.(css|scss)$/,
                include: path.resolve(__dirname, 'src'),
                use: [{
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: './'    // 设置css文件中的url()图片引用前缀
                        }
                    },
                    'css-loader',               // 不使用cssModule, 使用方便用户覆盖的命名规则, 如xxx-xxx-xxx
                    'postcss-loader',
                    'sass-loader'
                ]
            }, {
                /**
                 * 第三方组件的css, scss.
                 */
                test: /\.(css|scss)$/,
                include: thirdpartyCSS,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            }, {
                /**
                 * 图片加载器
                 */
                test: /\.(png|jpg|jpeg|gif|svg)$/,
                exclude: path.resolve(__dirname, 'src/_fonts'),
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 1,
                        name: 'images/[name]_[hash:base64:5].[ext]'
                    }
                }]
                /**
                 * 字体加载器
                 */
            }, {
                test: /\.(woff|eot|ttf|js|svg|otf)$/,
                include: path.resolve(__dirname, 'src/_fonts'),
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 1,
                        name: 'fonts/[name].[ext]'
                    }
                }]
            }]
        },
        plugins: [
            new CleanWebpackPlugin([`${ASSETS_PATH}/*.*`, `${ASSETS_PATH}/fonts`, `${ASSETS_PATH}/images`]),    // 清空编译目录
            new CaseSensitivePathsPlugin(),                              // 文件大小写检测
            new MiniCssExtractPlugin({
                filename: CSS_NAME
            })
        ]
    };
}