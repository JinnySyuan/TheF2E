// Gulp's Reference from:https://codertw.com/前端開發/226133/

// Import
var gulp = require('gulp'),
    open = require('open'),
    $ = require('gulp-load-plugins')(); //這樣的話 其他的模組可以直接使用 $ 符號來引入

// Defining path
var app = {
    srcPath: 'src/',
    devPath: 'build/',
    prdPath: 'dist/'
};

// HTML
gulp.task('html', function () {
    gulp.src(app.srcPath  '**/*.html')
        .pipe(gulp.dest(app.devPath))
        .pipe(gulp.dest(app.prdPath))
        .pipe($.connect.reload());
});

// JSON
gulp.task('json', function () {
    gulp.src(app.srcPath   'data/**/*.json')
        .pipe(gulp.dest(app.devPath   'data'))
        .pipe(gulp.dest(app.prdPath   'data'))
        .pipe($.connect.reload());
});

// SASS (編譯 Sass、Autoprefix 及縮小化)
gulp.task('sass', function () {
    gulp.src(app.srcPath   'sass/main.sass')
        .pipe($.sass({ style: 'expanded' }))
        .pipe($.autoprefixer('last 2 version'))
        .pipe(gulp.dest(app.devPath   'css'))
        .pipe($.cssnano())
        .pipe($.rename({ suffix: '.min' }))
        .pipe(gulp.dest(app.prdPath   'css'))
        .pipe($.connect.reload());
});

// JavaSript (JSHint、拼接及縮小化 JavaScript)
gulp.task('script', function () {
    gulp.src(app.srcPath   'javascript/**/*.js')
        .pipe($.jshint('.jshintrc'))
        .pipe($.jshint.reporter('default'))
        .pipe($.concat('main.js'))
        .pipe(gulp.dest(app.devPath   'javascript'))
        .pipe($.uglify())
        .pipe(gulp.dest(app.prdPath   'javascript'))
        .pipe($.connect.reload());
});

// IMAGE (壓縮)
gulp.task('image', function () {
    gulp.src(app.srcPath   'image/**/*')
        .pipe(gulp.dest(app.devPath   'image'))
        .pipe($.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
        .pipe(gulp.dest(app.prdPath   'image'))
        .pipe($.connect.reload());
});

// Build
gulp.task('build', ['image', 'script', 'sass', 'json', 'html']);

// Clean
gulp.task('clean', function () {
    gulp.src([app.devPath, app.prdPath])
        .pipe($.clean());
})


/////////////////////////
//編寫服務
gulp.task('serve', ['build'], function () {
    $.connect.server({
        //服務起來的入口
        root: [app.devPath],
        //檔案更改後自動重新整理頁面
        livereload: true,
        //埠號
        port: 8001
    });
    // 在 命令工具中執行 gulp serve 就相當於是啟動了服務
    //自動開啟瀏覽器
    open('http://localhost:8001');
    //監聽 script 下邊的 js 檔案，並執行 script 方法
    gulp.watch(app.srcPath   'javascript/**/*.js', ['script']);
    gulp.watch(app.srcPath   '**/*.html', ['html']);
    gulp.watch(app.srcPath   'data/**/*.json', ['json']);
    gulp.watch(app.srcPath   'sass/**/*.sass', ['sass']);
    gulp.watch(app.srcPath   'image/**/*', ['image']);
    //這樣檔案變更了就會自動構建
});
//預設執行的任務，直接 執行 gulp 變行了。都編寫完成後再終端 執行 gulp 便可以了。
gulp.task('default', ['serve']);