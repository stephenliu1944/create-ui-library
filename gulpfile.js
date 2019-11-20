var gulp = require('gulp');
var del = require('del');
var zip = require('gulp-zip');
var sftp = require('gulp-sftp-up4');
var { execSync } = require('child_process');
var sourcemaps = require('gulp-sourcemaps');
var replace = require('gulp-replace');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var postcss = require('gulp-postcss');
// var less = require('gulp-less');
// var sass = require('gulp-sass');
var bump = require('gulp-bump');
var eslint = require('gulp-eslint');
var eventStream = require('event-stream');
var cssBase64 = require('gulp-css-base64');
var pkg = require('./package.json');

const MODULE = process.env.BABEL_ENV;
const SRC_PATH = 'src';                 
const DIST_PATH = 'dist';               
const BUILD_PATH = 'build';                  
const ES_PATH = 'es';                  
const LIB_PATH = 'lib';                 
const DEST_PATH = MODULE === 'esm' ? ES_PATH : LIB_PATH;
const WATCH_DELAY = 1000;

/**
 * 文件清除
 */
// 清除 /build 目录下所有文件
gulp.task('clean-dist', () => {
    return del([`${DIST_PATH}/**`, `!${DIST_PATH}`]);
});
// 清除 /es 目录下所有文件
gulp.task('clean-es', () => {
    return del([`${ES_PATH}/**`, `!${ES_PATH}`]);
});
// 清除 /lib 目录下所有文件
gulp.task('clean-lib', () => {
    return del([`${LIB_PATH}/**`, `!${LIB_PATH}`]);
});
// 清除 /build, /es 和 /lib 目录
gulp.task('clean', gulp.parallel('clean-dist', 'clean-es', 'clean-lib'));

/**
 * 代码校验
 */
// JS校验
gulp.task('eslint', () => {
    return gulp.src([`${SRC_PATH}/**/*.@(js|jsx)`, `!${SRC_PATH}/dev.js`])
        .pipe(eslint({
            fix: true,      // 自动修复错误
            configFile: '.eslintrc.prod.json'
        }))
        .pipe(eslint.failOnError());
});

/**
 * 编译, 拷贝
 */
// 编译 less, sass, css 文件
gulp.task('build-css', () => {
    // 编译 less
    // var lessStream = gulp.src(`${SRC_PATH}/**/*.@(less)`)
    //     .pipe(less());
    
    // 编译 sass
    // var sassStream = gulp.src(`${SRC_PATH}/**/*.@(scss|sass)`)
    //     .pipe(sass().on('error', sass.logError));

    // 编译 postcss                         
    // var mergeStream = eventStream.merge(lessStream, sassStream, gulp.src(`${SRC_PATH}/**/*.@(css)`)).pipe(postcss());
    var mergeStream = eventStream.merge(gulp.src(`${SRC_PATH}/**/*.@(css)`)).pipe(postcss());
    
    return mergeStream.pipe(gulp.dest(DEST_PATH));
});
// 编译成 es module 或 commonjs 格式(根据 BABEL_ENV 参数), 引用的图片转换为base64格式
gulp.task('build-js', gulp.series('eslint', () => {
    return gulp.src(`${SRC_PATH}/**/*.@(js|jsx)`)
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
// 复制 build 到 dist 目录
gulp.task('copy-umd', () => {
    return gulp.src(`${BUILD_PATH}/**`)
        .pipe(gulp.dest(DIST_PATH));
});
// 整体构建
gulp.task('build', gulp.series('build-css', 'build-js', 'copy-image', 'copy-font'));

/**
 * 监听
 */
// 监听文件改动, 调用时依赖 BABEL_ENV 参数可选值为 esm 或 commonjs.
gulp.task('watch', (done) => {
    gulp.watch([`${SRC_PATH}/**/*.@(js|jsx)`], { delay: WATCH_DELAY },  gulp.series('build-js'));
    gulp.watch([`${SRC_PATH}/**/*.@(css|scss|sass)`], { delay: WATCH_DELAY },  gulp.series('build-css'));
    gulp.watch([`${SRC_PATH}/**/*.@(png|gif|jpg|jpeg|svg)`], { delay: WATCH_DELAY }, gulp.series('copy-image'));
    gulp.watch([`${SRC_PATH}/**/*.@(woff|eot|ttf||otf)`], { delay: WATCH_DELAY }, gulp.series('copy-font'));
});

/**
 * 版本发布
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

/**
 * 文件压缩
 */
// 将静态资源压缩为zip格式
gulp.task('zip', () => {
    return gulp.src([`${DIST_PATH}/**`, `!${DIST_PATH}/*.zip`], { base: `${DIST_PATH}/` })
        .pipe(zip(`${pkg.name}.zip`))
        .pipe(gulp.dest(DIST_PATH));
});

/**
 * 静态资源部署
 */
// 将静态资源发布到 dev 服务器
gulp.task('deploy-dev', () => {
    return gulp.src(dev.zip ? [`${DIST_PATH}/*.zip`] : [`${DIST_PATH}/**`, `!${DIST_PATH}/*.zip`])
        .pipe(sftp(dev));
});
// 将静态资源发布到 test 服务器
gulp.task('deploy-test', () => {
    return gulp.src(test.zip ? [`${DIST_PATH}/*.zip`] : [`${DIST_PATH}/**`, `!${DIST_PATH}/*.zip`])
        .pipe(sftp(test));
});
// 同时部署到开发和测试服务器
gulp.task('deploy-all', gulp.parallel('deploy-dev', 'deploy-test'));