# my-ui

## Install

## Usage

## API

## License

# 脚手架介绍
脚手架用于开发基于 React 的 UI 库.

## 特性
- 内置单元测试.
- 内置eslint, stylelint代码检测.
- 支持打包 UMD, ESModule(esm), CommonJS(cjs) 格式.
- 支持按需引入.
- 支持主题定制(less/sass).

## 项目依赖
```
react:      v16+
react-dom:  v16+
node:       v8+
webpack:    v4
eslint:     v5
stylelint   v11
babel:      v7
gulp:       v4
jest:       v24
less:       v3
```

## 安装
```
npm install
```

## 开发规范
1. 在 /src/index.js 中导入所有的组件脚本.
2. 在 /src/styles/index.less 中导入所有的组件样式.
3. 每个 component 的 JS 中不要直接引入样式(css/less/scss)文件, 将 js 和 css 解耦, 用户在使用时可以通过babel-plugin-import 或 babel-plugin-import-less 等按需引入插件自动导入必要的样式.
4. css 命名直接使用中横线(my-ui-btn)等命名规则, 便于用户覆盖样式.

## 主题开发
### 1. 定义变量
在 /src/styles/themes/default.less 中定义主题变量.

### 2. 导入变量
在每个组件的样式文件中导入主题变量并使用, 如:  
/src/component1/styles/index.less
```less
@import 'styles/base.less';
@import 'styles/themes/default.less';

.component1 {
    ...
    p {
        background-color: @bg-color1;
    }
}
```

### 3. 局部导入样式
仅在 .my-ui-btn 下有效.
```less
.component1 {
    ...
    .my-ui-btn {
        // 可以导入本地和第三方UI库的样式
        @import 'xxx/style.less';
    }
}
```

## 使用Sass
### 1. 安装依赖
```
// 安装sass依赖
npm i -D node-sass node-sass-import-once sass-loader resolve-url-loader gulp-sass gulp-resolve-url gulp-sourcemaps
// 卸载less依赖
npm un -D less less-loader gulp-less
```
通过测试的版本:
```js
"gulp-resolve-url": "0.0.2",
"gulp-sass": "^4.0.2",
"gulp-sourcemaps": "^2.6.5",
"node-sass": "^4.13.1",
"node-sass-import-once": "^1.2.0",
"resolve-url-loader": "^3.1.1",
"sass-loader": "^8.0.2",
```

### 2. 修改文件
1. gulpfile.js 删除第9, 67, 112行代码. 移除第10-13, 70-73, 113行注释.
2. webpack.config.base.js 删除第 44 行代码, 移除第 46-52 行注释.
3. webpack.config.prod.babel.js 第52行 "index.less" 后缀改为 "scss".
4. 将所有 less 文件后缀改为 scss, 将用到的 less 变量声明改为 sass 变量声明("@" > "$").

## 别名
默认在 babel.config.js 中配置了 Fonts, Images, Styles, Utils 别名.
```js
['babel-plugin-module-resolver', {
    alias: {
        'Fonts': './src/fonts',
        'Images': './src/images',
        'Styles': './src/styles',
        'Utils': './src/utils'
    }
}]
```
注意: 仅适用于JS文件.

## 开发
### 环境配置
在 package.json 中配置:
```
  ...
  "devEnvironments": {
    "servers": {
      "local": 8080,    // 本地web服务端口, 默认为 8080
      "mock": 3000      // 本地mock服务端口, 默认为 3000
    },
    "proxies": {        // 代理服务配置, 参考 @easytool/proxy-config 库文档
      "/api": "http://localhost:3000"
    },
    "globals": {        // 全局变量配置, 仅适用于开发环境, 生产环境会保留变量名
    }
  }
```
注意: 该配置仅适用于开发环境.

### 服务
1. 执行 bin/startup.bat 启动本地 web 服务, 组件开发过程中可在 /test/app.js 中调试用户使用组件的情况.
1. 执行 bin/mock.bat 启动 mock 服务, 如有数据需求可在 mock 服务中配置模拟数据.

### 测试
执行 bin/test.bat 启动单元测试, 需先在 /test/ 目录中对组件进行测试编码(测试框架为jest).

### link模式
该模式可以在应用端引入当前模块进行联调.  
注意: 请确保 package.json 中的 name 和 browser 项已经配置完毕(参考下方"打包配置"部分).

#### 当前模块
1. 链接到全局
```
npm link
```
2. 启动link模式
```
npm run link
```

#### 应用端
1. 链接本库
```
npm link my-ui(模块名称)
```
2. 配置本库静态资源路径
```
// 关联到本库服务地址
// 端口为 package.json > devEnvironments.servers.local
window.__MY_LIB_PUBLIC_PATH__ = 'http://localhost:8080/';
// or
<script>
window.__MY_UI_PUBLIC_PATH__ = 'http://localhost:8080/';
</script>
```
3. 启动应用
```
npm start
```

## 打包配置
```
{
  "name": "my-ui",                  // 模块名称
  "version": "0.1.0",               // 模块版本
  "main": "lib/index.js",           // 模块cjs格式引入路径
  "module": "es/index.js",          // 模块esm格式引入路径
  "browser": "dist/my-ui.js",       // 模块umd格式引入路径, 注意: js 文件名需与 name 保持一致
  "parcel": {                       // 生产环境打包配置
    "library": "MyLib",             // 模块打包为 umd 格式时, 使用的全局变量名称
    "externals": []                 // 模块打包时排除的依赖项, 参考 webpack > externals 文档说明
  },
  "description": "Use for development UI library.",     // 模块描述
  "license": "MIT",                 // 模块使用协议, 默认MIT
  "repository": {                   // 模块保存的仓库地址
    "type": "git",
    "url": ""
  },
  "homepage": "",                   // 模块首页地址
  "bugs": {                         // 模块提issue地址
    "url": ""
  },
  "keywords": [],                   // 模块搜索关键字
  "files": [                        // 模块打包上传到npm服务器的文件
    "dist",
    "lib",
    "es",
    "LICENSE",
    "README.md"
  ],
  ...
}
```
其余配置请参考npm官方文档.

## 部署
### 1. 注册和登陆
注册npm账号, 执行后会依次提示输入用户名, 密码, 邮箱.
```
npm adduser  
```

登录npm服务, 便于发布.
```
npm login
```

### 2. 发布
1. 发布X版本号执行 bin/publish-major.bat, 表示有重大更新, 并且不兼容老的版本.
2. 发布Y版本号执行 bin/publish-minor.bat, 表示有功能更新, 并且兼容老的版本.
3. 发布Z版本号执行 bin/publish-patch.bat, 表示有bug修复, 并且兼容老的版本.
4. 发布预发布版本号执行 bin/publish-prerelease.bat, 表示该版本还在开发测试中, 可能会有较大改动.
5. 从服务端卸载模块执行 bin/unpublish.bat.

## 目录结构
```
bin                                         // 可执行命令目录.
|-build-cjs.bat                             // 将源代码编译为 commonjs 格式保存到lib目录.
|-build-dev.bat                             // 将源代码编译为调试格式保存到build目录.
|-build-esm.bat                             // 将源代码编译为 esm 格式保存到es目录.
|-build-umd.bat                             // 将源代码编译为 umd 格式保存到build目录.
|-git-push.bat                              // 更新 git 版本号.
|-link.bat                                  // 用于 npm link 时在应用端调试.
|-lint-css.bat                              // 执行 stylelint 生产环境 style 代码校验.
|-lint-js.bat                               // 执行 eslint 生产环境 JS 代码校验.
|-mock.bat                                  // 启动mock服务(window)
|-mock.sh                                   // 启动mock服务(linux)
|-package.bat                               // 将代码编译打包(window).
|-package.sh                                // 将代码编译打包(linux).
|-publish-patch.bat                         // 发布新Z版本.
|-publish-prerelease.bat                    // 发布预发布版.
|-startup-mock.bat                          // 同时启动web服务和mock服务(window)
|-startup-mock.sh                           // 同时启动web服务和mock服务(linux)
|-startup.bat                               // 启动开发环境web服务(window)
|-startup.sh                                // 启动开发环境web服务(linux)
|-test.bat                                  // 执行jest单元测试(window)
|-test.sh                                   // 执行jest单元测试(linux)
|-unpublish.bat                             // 用于从服务端下架模块.
build                                       // 代码通过webpack编译后生成的临时目录.
dist                                        // 代码打包为 umd 格式后存放的目录.
es                                          // 代码打包为 esm 格式后存放的目录.
lib                                         // 代码打包为 commonjs 格式后存放的目录.
src                                         // 项目源码目录
|-component1                                // 模块组件1
    |-images                                // 组件使用的图片
    |-styles                                // 组件的样式文件
        |-index.js                          // 组件样式的入口文件
        |-index.less                        // 组件样式less文件
    |-Component1.js                         // 组件js文件
    |-index.js                              // 组件的入口文件
|-component2                                // 模块组件2
    |-images                                // 组件使用的图片
    |-styles                                // 组件的样式文件
        |-index.js                          // 组件样式的入口文件
        |-index.less                        // 组件样式less文件
    |-Component2.js                         // 组件js文件
    |-index.js                              // 组件的入口文件
|-fonts                                     // 字体文件存放目录
|-images                                    // 公共图片存放目录
|-styles                                    // 公共样式存放目录
    |-themes                                // 主题样式存放目录(主要是一些全局变量, 供所有组件引用)
        |-default.less                      // 默认的主题变量配置
    |-base.less                             // 全局的基础样式文件
    |-fonts.less                            // 字体样式文件
    |-index.less                            // 所有组件样式的入口文件
|-utils                                     // 模块内部工具文件.
    |-common.js                             // 常用工具库.
|-index.js                                  // 组件库打包的入口文件.
|-publicPath.js                             // 对外暴露的 publicPath 属性, 用于项目动态设置UI资源路径.
test                                        // 测试代码目录
|-component1                                // 测试组件1
    |-Component1.js                         // 测试代码
|-index.ejs                                 // 开发调试时的页面模板文件(仅用于调试, 不会打包).
|-index.js                                  // 本地Web引用测试文件(仅用于调试, 不会打包).
.eslintignore                               // eslint忽略校验配置文件.
.eslintrc.js                                // eslint开发环境代码校验配置文件.
.eslintrc.prod.js                           // eslint生产环境代码校验配置文件, 比开发环境更加严格, 发版和提交代码时会自动执行此配置校验代码.
.gitignore                                  // git忽略提交配置文件.
.stylelintignore                            // stylelint忽略校验配置文件.
babel.config.js                             // babel配置文件.
fileTransformer.js                          // jest单元测试时的文件转换器.
gulpfile.js                                 // gulp配置文件.
jest.config.js                              // jest单元测试配置.
package.json                                // npm module配置文件.
postcss.config.js                           // postcss配置文件
README.md                                   // 项目开发文档.
stylelint.config.js                         // stylelint 配置文件
webpack.config.base.js                      // webpack公共配置文件.
webpack.config.dev.babel.js                 // webpack开发环境打包umd格式配置文件.
webpack.config.prod.babel.js                // webpack生产环境打包umd格式配置文件.
```