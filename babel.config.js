const ENV = {
    DEVELOPMENT: 'development',
    PRODUCTION: 'production',
    TEST: 'test'
};

module.exports = function (api) {
    api.cache(true);
    
    var env = process.env.NODE_ENV;
    var presets = [
        ['@babel/preset-env', {
            targets: [
                'last 2 version',
                'ie >= 9'
            ],
            // Enable transformation of ES6 module syntax to another module type.
            // Setting this to false will not transform modules. keep to esm.
            modules: process.env.BABEL_ENV === 'esm' ? false: 'commonjs'
        }]
    ];
    var plugins = [
        '@babel/plugin-transform-runtime',
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-optional-chaining',
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-proposal-export-namespace-from',
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
        }]
    ];

    switch(env) {
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
