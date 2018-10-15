var gulp = require('gulp'),
    webserver = require('gulp-webserver'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('gulp-cssnano'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    //concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del');

// css 編譯 Sass、Autoprefix 及縮小化
gulp.task('styles', function () {
    return sass('src/styles/main.sass', { style: 'expanded' })
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cssnano())
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(notify({ message: 'Styles task complete' }));
});

// javasript JSHint、拼接及縮小化 JavaScript
gulp.task('scripts', function () {
    return gulp.src('src/scripts/**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(notify({ message: 'Scripts task complete' }));
});

// image壓縮 圖片壓縮
gulp.task('images', function () {
    return gulp.src('src/images/**/*')
        .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
        .pipe(gulp.dest('dist/assets/img'))
        .pipe(notify({ message: 'Images task complete' }));
});

// cleaning
gulp.task('clean', function () {
    return del(['dist/assets/css', 'dist/assets/js', 'dist/assets/img']);
});

gulp.task('default', ['clean'], function () {
    gulp.start('styles', 'scripts', 'images');
});


gulp.task('watch', function () {

    // 看守 .scss 檔
    gulp.watch('src/styles/**/*.scss', ['styles']);

    // 看守 .js 檔
    gulp.watch('src/scripts/**/*.js', ['scripts']);

    // 看守圖片檔
    gulp.watch('src/images/**/*', ['images']);

    // 建立即時重整伺服器
    livereload.listen();

    // 看守所有位在 dist/  目錄下的檔案，一旦有更動，便進行重整
    gulp.watch(['dist/**']).on('change', livereload.changed);

});

// gulp.task('webserver', function () {
//     gulp.src('./app/')
//         .pipe(webserver({
//             port: 1234,
//             livereload: true,
//             directoryListing: false,
//             open: true,
//             fallback: 'index.html'
//         }));
// });
// gulp.task('default', ['webserver']);