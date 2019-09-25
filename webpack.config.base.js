import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';

const BUILD_PATH = 'build';
/* var thirdpartyCSS = [path.resolve(__dirname, 'node_modules')];

if (!isProd) {
    thirdpartyCSS.push([path.resolve(__dirname, 'es'), path.resolve(__dirname, 'lib')]);
} */

export default function(env = {}) {
    return {
        output: {
            publicPath: '/',
            path: path.resolve(__dirname, BUILD_PATH)
        },
        resolve: {
            extensions: ['.js', '.jsx', '.css', '.scss', '.sass', '.less'],
            alias: {
                config: path.resolve(__dirname, 'src/_config/'),
                constants: path.resolve(__dirname, 'src/_constants/'),
                fonts: path.resolve(__dirname, 'src/_fonts/'),
                images: path.resolve(__dirname, 'src/_images/'),
                styles: path.resolve(__dirname, 'src/_styles/'),
                utils: path.resolve(__dirname, 'src/_utils/')
            }
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
                'postcss-loader'
                // 'sass-loader'
                // 'less-loader'
                ]
            }, {
                /**
                 * 第三方组件的css, scss.
                 */
                test: /\.(css|scss)$/,
                include: path.resolve(__dirname, 'node_modules'),
                use: [
                    MiniCssExtractPlugin.loader, 
                    'css-loader' 
                    // 'sass-loader'
                    // 'less-loader'
                ]
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
                        name: 'images/[name].[ext]'
                    }
                }]
            }, {
                /**
                 * 字体加载器
                 */
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
        optimization: {
            noEmitOnErrors: true
        },
        plugins: [
            // 清空编译目录
            new CleanWebpackPlugin(
                process.env.BUILD_CLEAN !== 'false' ? [
                    `${BUILD_PATH}/*.*`, 
                    `${BUILD_PATH}/fonts`, 
                    `${BUILD_PATH}/images`
                ] : []
            ),
            // 文件大小写检测
            new CaseSensitivePathsPlugin()
        ]
    };
}