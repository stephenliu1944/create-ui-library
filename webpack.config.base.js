import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import StyleLintPlugin from 'stylelint-webpack-plugin';
import { name } from './package.json';

const BUILD_PATH = 'build';

export default function(config) {
    return {
        output: {
            path: path.resolve(__dirname, BUILD_PATH),
            jsonpFunction: name            // 避免多个应用之间 jsonpFunction 名冲突
        },
        resolve: {
            extensions: ['.js', '.jsx', '.css', '.scss', '.sass', '.less']
        },
        optimization: {
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
                test: /\.(css|less|sass|scss)$/,
                include: path.resolve(__dirname, 'src'),
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: './'    // 设置css文件中的url()图片引用前缀
                    }
                },
                'css-loader',               // 不使用cssModule, 便于用户覆盖class
                'postcss-loader',
                'less-loader'
                // 以下为 sass 配置
                // 'resolve-url-loader',
                // {
                //     loader: 'sass-loader',
                //     options: {
                //         sourceMap: true
                //     }
                // }
                ]
            }, {
                /**
                 * 第三方组件的css, scss.
                 */
                test: /\.(css|less|sass|scss)$/,
                include: path.resolve(__dirname, 'node_modules'),
                use: [
                    MiniCssExtractPlugin.loader, 
                    'css-loader' 
                    // 'less-loader'
                    // 'sass-loader'
                ]
            }, {
                /**
                 * 图片加载器                 
                 */
                test: /\.(png|jpg|jpeg|gif|svg)$/,
                exclude: path.resolve(__dirname, 'src/fonts'),
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: false,
                        name: 'images/[name].[ext]'
                    }
                }]
            }, {
                /**
                 * 字体加载器
                 */
                test: /\.(woff|eot|ttf|js|svg|otf)$/,
                include: path.resolve(__dirname, 'src/fonts'),
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: false,
                        name: 'fonts/[name].[ext]'
                    }
                }]
            }]
        },
        plugins: [
            // 清空编译目录
            new StyleLintPlugin({
                context: 'src',
                files: '**/*.(c|sc|sa|le)ss',
                fix: true,
                cache: true
            }),
            // 文件大小写检测
            new CaseSensitivePathsPlugin()
        ]
    };
}