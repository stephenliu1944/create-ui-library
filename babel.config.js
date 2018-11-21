module.exports = function(api) {
    api.cache(true);

    var presets = [
        ['@babel/preset-env', {
            targets: [
                'last 2 version',
                'ie >= 9'
            ],
            // useBuiltIns: 'entry',
            modules: process.env.BABEL_ENV === 'esm' ? false : 'commonjs'     // transform esm to cjs, false to keep esm.
        }]
        // '@babel/preset-react'
    ];

    var plugins = [
        '@babel/plugin-transform-runtime',
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-optional-chaining',
        '@babel/plugin-proposal-export-default-from',
        ['babel-plugin-module-resolver', {
            alias: {
                '^config/(.+)': './src/_config/\\1',
                '^constants/(.+)': './src/_constants/\\1',
                '^fonts/(.+)': './src/_fonts/\\1',
                '^images/(.+)': './src/_images/\\1',
                '^styles/(.+)': './src/_styles/\\1',
                '^utils/(.+)': './src/_utils/\\1'
            }
        }],
        // JS 引入的图片全部转成 base64格式, 避免打包后路径错误的问题.
        ['babel-plugin-inline-import-data-uri', {
            extensions: ['png', 'jpg', 'jpeg', 'gif', 'svg']
        }],
    ];

    return {
        presets,
        plugins,
        env: {
            test: {
                presets: [
                    '@babel/preset-env'
                    // '@babel/preset-react'
                ]
            }
        }
    };
};