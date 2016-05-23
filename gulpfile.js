const gulp = require('gulp'),
    webserver = require('gulp-webserver'),
    watch = require('gulp-watch'),
    concat = require('gulp-concat'),
    livereload = require('gulp-livereload'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass')
//uglify = require('gulp-uglify'),
//ngAnnotate = require('gulp-ng-annotate')//,
//babel = require('gulp-babel')
    ;

app_src = [
    'app/src/main-routes.js',
    'app/src/app/*.js',
    'app/src/common/**/*.js',
    '!app/src/common/**/*.spec.js',
    '!app/src/app/*.spec.js',
    '!app/src/common/tests/*.js'
];
app_src_html = [
    'app/*.html',
    'app/src/app/*.html',
    'app/src/app/**/*.html',
    'app/css/*.css',
    'app/css/**/*.css'
];
app_sass = ['app/sass/*.sass', 'app/sass/**/*.sass'];

gulp.task('concat-appJS', function () {
    gulp.src(app_src)
        .pipe(sourcemaps.init())
        //.pipe(babel({presets: ['es2015']}))
        .pipe(concat('app.js'))
        .pipe(sourcemaps.write())
        //.pipe(ngAnnotate())
        //.pipe(uglify())// 
        .pipe(gulp.dest('app/src'))
        .pipe(livereload());//need plugin for browser
});
gulp.task('watch-app', function () {
    gulp.watch([app_src], ['concat-appJS']);
    gulp.watch([app_src_html], ['reloadAppHTML']);
    gulp.watch([app_sass], ['sass']);
    livereload.listen();//need plugin for browser
});

gulp.task('reloadAppHTML', function () {
    gulp.src(app_src_html)
        .pipe(livereload());
});

gulp.task('sass', function () {
    return gulp.src(app_sass, {base: 'app/sass'})
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('app/css'));
});


gulp.task('webserver', function () {
    gulp.src('app')
        .pipe(webserver({
            directoryListing: false,
            open: true,
            proxies: [{source: '/app', target: 'http://localhost:8080/'}
            ]
        }));
});

