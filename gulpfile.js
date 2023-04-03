const gulp = require('gulp')
const less = require('gulp-less')
const sass = require('gulp-sass')(require('sass'))
const rename = require('gulp-rename')
const cleanCSS = require('gulp-clean-css')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat') 
const sourcemaps = require('gulp-sourcemaps')
const autoprefixer = require('gulp-autoprefixer')
const imagemin = require('gulp-imagemin')
const htmlmin =require('gulp-htmlmin')
const newer = require('gulp-newer')
const browserSync = require('browser-sync').create();
const del = require('del')

const paths = {
    styles: {
      src: ['src/styles/**/*.sass', 'src/styles/**/*.scss', 'src/styles/**/*.less'],
      dest: 'dist/css/'
    },
    scripts: {
        src: 'src/scripts/**/*.js',
        dest: 'dist/js/'
    },
    images: {
        src: 'src/img/**',
        dest: 'dist/img'
    },
    html: {
        src: 'src/*.html',
        dest: 'dist'
    }

}

// Очистить каталог dist, удалить все кроме изображений
function clean() {
    return del(['dist/*', '!dist/img'])
}

// Обработка html и pug
function html() {
    return gulp.src(paths.html.src)
    .pipe(htmlmin({
        collapseWhitespace: true
    }))
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browserSync.stream());
}

// Обработка препроцессоров стилей
function styles() {
    return gulp.src(paths.styles.src)
    .pipe(sourcemaps.init())

    //.pipe(less())
    .pipe(sass().on('error', sass.logError))

    .pipe(autoprefixer({
        cascade: false
    }))
    .pipe(cleanCSS({
        level: 2
    }))  //+ минификация
    .pipe(rename({
        basename: 'style',
        suffix: '.min'
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

// Обработка Java Script
function scripts() {
    return gulp.src(paths.scripts.src)
    .pipe(sourcemaps.init())
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browserSync.stream());
}

// Сжатие изображений
function img() {
    return gulp.src(paths.images.src)
    .pipe(newer(paths.images.dest))
    .pipe(imagemin({
        progressive: true
    }))
    .pipe(gulp.dest(paths.images.dest))
}

// Отслеживание изменений в файлах и запуск лайв сервера
function watch() {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    })
    gulp.watch(paths.html.dest).on('change', browserSync.reload)
    gulp.watch(paths.html.src, html)
    gulp.watch(paths.styles.src, styles)
    gulp.watch(paths.scripts.src, scripts)
    gulp.watch(paths.images.src, img)
    
}

// Таск, который выполняется по команде gulp
const build = gulp.series(clean, html, gulp.parallel(styles, scripts, img), watch)


// Таски для ручного запуска с помощью gulp clean, gulp html и т.д.
exports.clean = clean
exports.img = img
exports.html = html
exports.styles = styles
exports.scripts = scripts
exports.watch = watch
exports.build = build
exports.default = build

