module.exports = function(api) {
    api.cache(true);
    
    var presets = [
        ['@babel/preset-env', {
            targets: [
                'last 2 version',
                'ie >= 9'
            ],
            // "amd" | "umd" | "systemjs" | "commonjs" | "cjs" | "auto" | false, defaults to "auto". "false" keep es6.
            modules: process.env.BABEL_ENV === 'esm' ? false : 'commonjs'
        }]
        // '@babel/preset-react'
    ];
    var plugins = [
        '@babel/plugin-transform-runtime',
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-optional-chaining',
        ['@babel/plugin-proposal-pipeline-operator', { 
            'proposal': 'minimal' 
        }],
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-proposal-export-namespace-from',
        ['babel-plugin-module-resolver', {
            alias: {
                'Fonts': './src/fonts',
                'Images': './src/images',
                'Styles': './src/styles',
                'Utils': './src/utils'
            }
        }],
        // JS 引入的图片全部转成 base64 格式, 避免打包后路径错误的问题. umd, esm, lib 格式打包时都会用到.
        ['babel-plugin-inline-import-data-uri', {
            extensions: ['png', 'jpg', 'jpeg', 'gif', 'svg']
        }]
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
