const ENV = {
    DEVELOPMENT: 'development',
    PRODUCTION: 'production',
    TEST: 'test'
};

module.exports = function(api) {
    api.cache(true);

    var env = process.env.NODE_ENV;
    var presets = [
        ['@babel/preset-env', {
            targets: [
                'last 2 version',
                'ie >= 9'
            ],
            // 默认为 "auto". "false" 保持 es module 格式.
            modules: process.env.BABEL_ENV === 'esm' ? false : 'commonjs'
        }],
        '@babel/preset-react'
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

    // 根据需要为不同环境增加配置
    switch (env) {
        case ENV.DEVELOPMENT:
            break;
        case ENV.PRODUCTION:        
            break;
        case ENV.TEST:
            break;
    }

    return {
        presets,
        plugins
    };
};
