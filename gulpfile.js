var gulp = require('gulp');
var del = require('del');
var pkg = require('./package.json');
var { execSync } = require('child_process');
var sourcemaps = require('gulp-sourcemaps');
var replace = require('gulp-replace');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var less = require('gulp-less');
var sass = require('gulp-sass');
var bump = require('gulp-bump');
var eslint = require('gulp-eslint');
var eventStream = require('event-stream');
var cssBase64 = require('gulp-css-base64');

const MODE = process.env.BABEL_ENV;
const PACKAGE_NAME = pkg.packageName;   // 打包生成的文件名, 如www.bbdservice.com
const SRC_PATH = 'src';                 // 编译文件
const ESM_PATH = 'es';                  // 编译文件
const LIB_PATH = 'lib';                 // 编译文件
const DEST_PATH = MODE === 'esm' ? ESM_PATH : LIB_PATH;
const WATCH_DELAY = 1000;
var cleanTask = 'clean';
if (MODE === 'esm') {
    cleanTask = 'clean-esm';
} else if (MODE === 'commonjs') {
    cleanTask = 'clean-lib';
}

// 清除 /es 目录下所有文件
gulp.task('clean-esm', () => {
    return del([`${ESM_PATH}/**`, `!${ESM_PATH}`]);
});
// 清除 /lib 目录下所有文件
gulp.task('clean-lib', () => {
    return del([`${LIB_PATH}/**`, `!${LIB_PATH}`]);
});
// 清除 /es 和 /lib 目录
gulp.task('clean', gulp.parallel('clean-esm', 'clean-lib'));
// 编译 less, sass, css 文件
gulp.task('build-css', () => {
    // 编译 less
    var lessStream = gulp.src(`${SRC_PATH}/**/*.@(less)`)
                         .pipe(less());
    // 编译 sass
    var sassStream = gulp.src(`${SRC_PATH}/**/*.@(scss|sass)`)
                         .pipe(sass().on('error', sass.logError));
    return eventStream.merge(lessStream, sassStream, gulp.src(`${SRC_PATH}/**/*.@(css)`))
                //    .pipe(cssBase64())       // css引用的图片转成base64格式
                      .pipe(gulp.dest(DEST_PATH));
});
// 代码校验
gulp.task('eslint', () => {
    return gulp.src([`${SRC_PATH}/**/*.@(js|jsx)`, `!${SRC_PATH}/dev.js`])
               .pipe(eslint({
                    fix: true,      // 自动修复错误
                    configFile: '.eslintrc.prod.json'
               }))
               .pipe(eslint.failOnError());
});
// 编译成 es module 或 commonjs 格式(根据BABEL_ENV参数), 引用的图片转换为base64格式
gulp.task('build-js', gulp.series('eslint', () => {
    return gulp.src([`${SRC_PATH}/**/*.@(js|jsx)`, `!${SRC_PATH}/dev.js`])
               .pipe(babel())
               .pipe(replace(/\.jsx/g, '.js'))                   // 替换 jsx 文件名和文件内的引用名
               .pipe(replace(/\.(less|scss|sass)/g, '.css'))     // 替换 less, scss 文件名和 js 文件中引用的 scss 文件名
               .pipe(gulp.dest(DEST_PATH));
}));
// 复制图片
gulp.task('copy-image', () => {
    return gulp.src(`${SRC_PATH}/**/*.@(png|gif|jpg|jpeg|svg)`)
               .pipe(gulp.dest(DEST_PATH));

});
// 复制字体
gulp.task('copy-font', () => {
    return gulp.src(`${SRC_PATH}/**/*.@(woff|eot|ttf||otf)`)
               .pipe(gulp.dest(DEST_PATH));

});
// 整体编译
gulp.task('build', gulp.series(cleanTask, 'build-css', 'build-js', 'copy-image', 'copy-font'));
// 监听文件改动, 调用时依赖 BABEL_ENV 参数可选值为 esm 或 commonjs.
gulp.task('watch', (done) => {
    gulp.watch([`${SRC_PATH}/**/*.@(js|jsx)`], { delay: WATCH_DELAY },  gulp.series('build-js'));
    gulp.watch([`${SRC_PATH}/**/*.@(css|scss|sass)`], { delay: WATCH_DELAY },  gulp.series('build-css'));
    gulp.watch([`${SRC_PATH}/**/*.@(png|gif|jpg|jpeg|svg)`], { delay: WATCH_DELAY }, gulp.series('copy-image'));
    gulp.watch([`${SRC_PATH}/**/*.@(woff|eot|ttf||otf)`], { delay: WATCH_DELAY }, gulp.series('copy-font'));
});
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
// 更新版本号
gulp.task('git-push', (done) => {
    execSync('git add -A :/');
    execSync('git commit -m "update version"');
    execSync('git push');
    done();
});