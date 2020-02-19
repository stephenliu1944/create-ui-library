module.exports = function(api) {
    api.cache(true);

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
        }]
    ];

    // JS 导入的图片全部转成 base64 格式, 避免用户在使用时发生路径错误的问题. 仅对 webpack 打包有效.
    if (!process.env.BABEL_ENV) {
        plugins.push(
            ['babel-plugin-inline-import-data-uri', {
                extensions: ['png', 'jpg', 'jpeg', 'gif', 'svg']
            }]
        );
    }

    // 根据需要为不同环境增加配置
    switch (process.env.NODE_ENV) {
        case 'development':
            break;
        case 'production':        
            break;
        case 'test':
            break;
    }

    return {
        presets,
        plugins
    };
};
