import path from 'path';
import webpack from 'webpack';
import webpackMerge from 'webpack-merge';
import baseConfig from './webpack.config.base';

export default function(env = {}) {
    return webpackMerge(baseConfig(env), {
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
        },
        plugins: [
            // 配置全局变量
            new webpack.DefinePlugin({
                __DEV__: false,
                'process.env.NODE_ENV': JSON.stringify('production')
            })
        ]
    });
}