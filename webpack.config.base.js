import path from 'path';
import generate from 'generate-file-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import StyleLintPlugin from 'stylelint-webpack-plugin';
import { name, parcel } from './package.json';

const BUILD_PATH = 'build';
const DIST_PATH = 'dist';
const CONTENT_HASH = '[contenthash:4]';
const { library, externals } = parcel;
const NODE_ENV = process.env.NODE_ENV;      // development, link, production

function generateFile(ENV) {
    let path = ENV === 'link' ? 'src' : 'lib';

    return generate({
        file: `${name}.less`,
        content: `@import \'../${path}/styles/index.less\';`
    });
}

export default function(config = {}) {
    let { jsFile = `${name}.js`, cssFile = `${name}.css`, isClean = true } = config;
    
    return {        
        entry: {
            main: [
                './src/styles/index.less',      // js 和 css 是独立的
                './src/publicPath.js',
                NODE_ENV === 'development' ? './test/index.js' : './src/index.js'   // index.js 要放最后, issue: When combining with the output.library option: If an array is passed only the last item is exported.
            ]
        },
        output: {
            filename: jsFile,
            path: path.resolve(__dirname, NODE_ENV === 'development' ? BUILD_PATH : DIST_PATH),
            library,
            libraryTarget: 'umd',
            jsonpFunction: name            // 避免多个应用之间 jsonpFunction 名冲突
        },
        externals: NODE_ENV === 'development' ? undefined : externals,
        resolve: {
            extensions: ['.js', '.jsx', '.css', '.less', '.scss', '.sass']
        },
        optimization: {
            noEmitOnErrors: true
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
                        configFile: `.eslintrc${NODE_ENV === 'production' ? '.prod' : ''}.js`
                    }
                }]
            }, {
                // oneof
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
                        publicPath: './'    // 设置css文件中的url()图片引用前缀为相对路径
                    }
                },
                'css-loader',               // 不使用cssModule, 便于应用端覆盖class样式
                'postcss-loader',
                {
                    loader: 'less-loader',
                    options: {
                        lessOptions: {
                            javascriptEnabled: true
                        }
                    }
                }
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
                    'css-loader',
                    {
                        loader: 'less-loader',
                        options: {
                            lessOptions: {
                                javascriptEnabled: true
                            }
                        }
                    }
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
                        limit: 10,
                        name: `images/[name].${CONTENT_HASH}.[ext]`
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
                        limit: 10,
                        name: 'fonts/[name].[ext]'
                    }
                }]
            }]
        },
        plugins: [
            isClean && new CleanWebpackPlugin(),
            // 清空编译目录
            new StyleLintPlugin({
                context: 'src',
                files: '**/*.(c|sc|sa|le)ss',
                fix: true,
                cache: true
            }),
            // 文件大小写检测
            new CaseSensitivePathsPlugin(),
            new MiniCssExtractPlugin({
                filename: cssFile
            }),
            // dist目录下生成less快捷方式
            ['link', 'production'].includes(NODE_ENV) && generateFile(NODE_ENV)
        ].filter(plugin => plugin)
    };
}