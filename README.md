# my-ui

## Install

## Usage

## API

## License

## 项目介绍
用于开发 UI 组件模块, 支持打包为 UMD, ESModule(esm), CommonJS(cjs) 格式, 支持按需引入的形式.
可自行扩展为 React 或 Vue UI库.

### 项目依赖
```
node:       v8.x.x
npm:        v6.x.x
webpack:    v4.x.x
eslint:     v5.x.x
stylelint   v11.x.x
babel:      v7.x.x
gulp:       v4.x.x
jest:       v25.x.x
```

### 安装教程
```
npm install
```

### React扩展
1. 安装 babel 插件
```
npm i -D @babel/preset-react
npm i -S react react-dom
```

2. 修改 babel.config.js 配置, 解开2处 '@babel/preset-react' 注释即可.

### 注册和登陆
```
npm adduser      // 注册账号, 执行后会依次提示输入用户名, 密码, 邮箱.
npm login        // 登录npm服务.
```

### 模块配置
1. 在 package.json 中对模块的相关信息进行配置, 参考npm官方文档.
2. name 为模块的名字, libraryName 为UMD格式打包后的全局变量名, 这两项为必填.

### 服务配置
本地服务端口默认为8080, 在 package.json > devEnvironments > servers > local 中可修改端口配置.

### 本地调试
1. 开发阶段执行 bin/startup.bat 启动开发服务器, 组件开发过程中可在 src/dev.js 文件中模拟外部使用模块的情况进行本地调试.
2. 开发完成后可以在 bin/test.bat 执行单元测试.(需先在test/目录进行单元测试编码, 测试框架为jest).

### link调试
1. 将模块引入到项目中调试执行 bin/link , 然后在需要引入模块的项目中执行 npm link 模块名.
2. 如需与项目联调, 可以根据项目引用模块的格式(umd/esm/cjs), 选择执行 bin/package-watch-dist.bat或package-watch-lib.bat或package-watch-esm.bat, 即可实时打包.

### 打包发布
1. 发布X版本号执行 bin/publish-major.bat, 表示有重大更新, 并且不兼容老的版本.
2. 发布Y版本号执行 bin/publish-minor.bat, 表示有功能更新, 并且兼容老的版本.
3. 发布Z版本号执行 bin/publish-patch.bat, 表示有bug修复, 并且兼容老的版本.
3. 发布预发布版本号执行 bin/publish-prerelease.bat, 表示该版本还在开发测试中, 可能会有较大改动.
4. 从服务端卸载模块执行 bin/unpublish.bat.

### 目录结构
```
bin                                         // 可执行命令目录.
|-build-dev.bat                             // 将src目录中的源码通过 webpack.config.dev.babel.js 编译到build目录.
|-build-umd.bat                             // 将src目录中的源码通过 webpack.config.prod.babel.js 编译到build目录.
|-build-esm.bat                             // 将src目录中的源码通过 gulpfile.js 编译为 esm 格式并保存到build目录.
|-build-cjs.bat                             // 将src目录中的源码通过 gulpfile.js 编译为 commonjs 格式并保存到build目录.
|-git-push.bat                              // 更新 git 版本号.
|-link.bat                                  // 执行 npm link, 用于关联到项目调试.
|-lint.bat                                  // 执行eslint生产环境代码校验.
|-package.bat                               // 将src目录中的源码编译打包到dist(umd), lib(commonjs), es(esm)目录.
|-publish-major.bat                         // 发布新X版本.
|-publish-minor.bat                         // 发布新Y版本.
|-publish-patch.bat                         // 发布新Z版本.
|-publish-prerelease.bat                    // 发布预发布版.
|-startup.bat                               // 启动开发环境web服务(window)
|-startup.sh                                // 启动开发环境web服务(linux)
|-test.bat                                  // 执行jest单元测试(window)
|-test.sh                                   // 执行jest单元测试(linux)
|-unpublish.bat                             // 用于从服务端下架模块
build                                       // 代码编译后生成的临时目录.
dist                                        // 代码打包为 umd 格式后存放的目录.
es                                          // 代码打包为 esm 格式后存放的目录.
lib                                         // 代码打包为 commonjs 格式后存放的目录.
src                                         // 项目源码目录
|-_config                                   // 模块内部配置文件.
    |-settings.js                           // 全局配置文件
|-_constants                                // 模块内部常量文件.
    |-common.js                             // 常量文件.
|-_styles                                   // 模块内部全局样式文件.
    |-common.js                             // 全局样式.
|-_utils                                    // 模块内部工具文件.
    |-common.js                             // 常用工具库.
|-module1                                   // 模块组件1
    |-components                            // 组件包含的子组件.
        ...
    |-images                                // 组件使用的图片
    |-Modules1.js                           // 组件js文件.
    |-Modules1.css                          // 组件的样式文件.
    |-index.js                              // 组件的索引文件(用于外部快速引入)
|-module2                                   // 模块组件1
    |-components                            // 组件包含的子组件.
        ...
    |-images                                // 组件使用的图片
    |-Modules2.js                           // 组件js文件.
    |-Modules2.css                          // 组件的样式文件.
    |-index.js                              // 组件的索引文件(用于外部快速引入)
|-index.js                                  // 组件打包时的入口js文件.
|-dev.js                                    // 本地调试模拟外部使用的测试文件, 仅用于调试.
|-template.html                             // 开发调试时的页面模板文件, 仅用于调试.
test                                        // 测试代码目录, 目录结构同src
.eslintignore                               // eslint忽略校验配置文件.
.eslintrc.json                              // eslint开发环境代码校验配置文件.
.eslintrc.prod.json                         // eslint生产环境代码校验配置文件, 比开发环境更加严格, 发版和提交代码时会自动执行此配置校验代码.
.gitignore                                  // git忽略提交配置文件.
package.json                                // npm配置文件.
README.md                                   // 项目开发文档.
babel.config.js                             // babel配置文件.
fileTransformer.js                          // jest单元测试时的文件转换器.
jest.config.js                              // jest单元测试配置.
gulpfile.js                                 // 组件打包为cjs, esm格式的脚本配置文件.
webpack.config.base.js                      // webpack公共配置文件.
webpack.config.dev.babel.js                 // webpack开发环境打包umd格式配置文件.
webpack.config.prod.babel.js                // webpack生产环境打包umd格式配置文件.
```