var gulp = require('gulp');
var del = require('del');
var { execSync } = require('child_process');
var replace = require('gulp-replace');
var babel = require('gulp-babel');
var postcss = require('gulp-postcss');
var less = require('gulp-less');
// 编译sass
/*
var sass = require('gulp-sass');
var gulpResolveUrl = require('gulp-resolve-url');
var importOnce = require('node-sass-import-once');
var sourcemaps = require('gulp-sourcemaps');
*/
var bump = require('gulp-bump');
var clone = require('gulp-clone');
var eslint = require('gulp-eslint');
var stylelint = require('gulp-stylelint');
var { merge } = require('event-stream');

const MODULE = process.env.BABEL_ENV;
const SRC_PATH = 'src';                 
const ES_PATH = 'es';
const LIB_PATH = 'lib';                 
const DEST_PATH = MODULE === 'esm' ? ES_PATH : LIB_PATH;
const WATCH_DELAY = 1000;

// 校验代码规范        
function lintStyle(stream) {
    return stream.pipe(stylelint({           
        fix: true,                                          // 自动修复部分错误
        cache: true,
        failAfterError: true,
        configFile: 'stylelint.config.js',
        reporters: [{ formatter: 'string', console: true }] // 控制台输出日志
    }));
}
/**
 * 文件清除
 */
// 清除 /es 目录下所有文件
gulp.task('clean-es', () => {
    return del([`${ES_PATH}/**`, `!${ES_PATH}`]);
});
// 清除 /lib 目录下所有文件
gulp.task('clean-lib', () => {
    return del([`${LIB_PATH}/**`, `!${LIB_PATH}`]);
});
/**
 * 编译
 */
// 将 less, sass, postcss 编译为 css
gulp.task('build-css', () => {
    // 校验代码规范
    var cssStream = lintStyle(gulp.src(`${SRC_PATH}/**/*.@(css)`));
    // 校验代码规范
    var styleStream = lintStyle(gulp.src(`${SRC_PATH}/**/*.@(less|scss|sass)`));
    // 复制 less, sass 源文件流
    var sourceStream = styleStream.pipe(clone());
    // 编译 less, sass 文件流
    var compileStream = styleStream
            // 编译less
            .pipe(less({ 
                rewriteUrls: 'local',
                javascriptEnabled: true
            }));
    // 编译sass
    /*
            .pipe(sourcemaps.init())   
            .pipe(sass({ importer: importOnce }).on('error', sass.logError))    // 过滤重复导入的文件
            .pipe(gulpResolveUrl())                                             // 等于 less 的 rewriteUrls 配置, 需要搭配sourcemaps使用
            .pipe(sourcemaps.write());
            */
    // 编译 postcss
    var mergeStream = merge(compileStream, cssStream).pipe(postcss());
    // 将 less, scss 源文件和编译后的 css 文件共同拷贝到目的地.
    return merge(sourceStream, mergeStream).pipe(gulp.dest(DEST_PATH));    
});
// 将 JS 编译为 es module 或 commonjs 格式(根据 BABEL_ENV 参数), JS引用的图片转换为 base64 格式
gulp.task('build-js', () => {
    return gulp.src(`${SRC_PATH}/**/*.@(js|jsx)`)
            .pipe(eslint({                                    // 校验代码规范
                fix: true,                                    // 自动修复部分错误
                configFile: '.eslintrc.prod.js'
            }))
            .pipe(eslint.failAfterError())
            .pipe(babel())                                    // 代码编译
            .pipe(replace(/\.jsx/g, '.js'))                   // 替换 jsx 文件名和文件内的引用名
            .pipe(gulp.dest(DEST_PATH));
});

/**
 * 拷贝文件
 */
// 复制图片
gulp.task('copy-image', () => {
    return gulp.src(`${SRC_PATH}/**/*.@(png|gif|jpg|jpeg|svg)`)
            .pipe(gulp.dest(DEST_PATH));
});
// 复制字体
gulp.task('copy-font', () => {
    return gulp.src(`${SRC_PATH}/**/*.@(woff|eot|ttf|otf)`)
            .pipe(gulp.dest(DEST_PATH));
});
// 复制json
gulp.task('copy-json', () => {
    return gulp.src(`${SRC_PATH}/**/*.@(json)`)
            .pipe(gulp.dest(DEST_PATH));
});
// 整体构建
gulp.task('build', gulp.series('build-css', 'build-js', 'copy-image', 'copy-font', 'copy-json'));

/**
 * 监听
 */
// 监听文件改动, 调用时依赖 BABEL_ENV 参数可选值为 esm 或 commonjs.
gulp.task('watch', (done) => {
    gulp.watch([`${SRC_PATH}/**/*.@(js|jsx)`], { delay: WATCH_DELAY },  gulp.series('build-js'));
    gulp.watch([`${SRC_PATH}/**/*.@(css|less|scss|sass)`], { delay: WATCH_DELAY },  gulp.series('build-css'));
    gulp.watch([`${SRC_PATH}/**/*.@(png|jpg|jpeg|gif|svg)`], { delay: WATCH_DELAY }, gulp.series('copy-image'));
    gulp.watch([`${SRC_PATH}/**/*.@(woff|eot|ttf|otf)`], { delay: WATCH_DELAY }, gulp.series('copy-font'));
});

/**
 * 版本发布
 * x.y.z-alpha.0
 */
// 更新预发布版本号, 开发中版本, 可能会有较大改动.
gulp.task('version-prerelease', () => {
    return gulp.src('./package.json')
            .pipe(bump({
                type: 'prerelease'
            }))
            .pipe(gulp.dest('./'));
});
// 更新 Z 版本号, 修复bug, 兼容老版本
gulp.task('version-patch', () => {
    return gulp.src('./package.json')
            .pipe(bump({
                type: 'patch'
            }))
            .pipe(gulp.dest('./'));
});
// 更新 Y 版本号, 兼容老版本
gulp.task('version-minor', () => {
    return gulp.src('./package.json')
            .pipe(bump({
                type: 'minor'
            }))
            .pipe(gulp.dest('./'));
});
// 更新 X 版本号, 不兼容老版本
gulp.task('version-major', () => {
    return gulp.src('./package.json')
            .pipe(bump({
                type: 'major'
            }))
            .pipe(gulp.dest('./'));
});

/**
 * git 提交
 */
// 更新版本号
gulp.task('git-push', (done) => {
    execSync('git add -A :/');
    execSync('git commit -m "update version"');
    execSync('git push');
    done();
});