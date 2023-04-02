const gulp = require('gulp')
const less = require('gulp-less')
const rename = require('gulp-rename')
const cleanCSS = require('gulp-clean-css')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat') 
const del = require('del')

const paths = {
    styles: {
      src: 'src/styles/**/*.less',
      dest: 'dist/css/'
    },
    scripts: {
        src: 'src/scripts/**/*.js',
        dest: 'dist/js/'
    }
}

function clean() {
    return del(['dist'])
}
function styles() {
    return gulp.src(paths.styles.src, {
        soursemap: true
    })
    .pipe(less())
    .pipe(cleanCSS())  //+ минификация
    .pipe(rename({
        basename: 'main',
        suffix: '.min'
    }))
    .pipe(gulp.dest(paths.styles.dest))
}

function scripts() {
    return gulp.src(paths.scripts.src, {
        soursemaps: true
    })
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(paths.scripts.dest))
}

function whatch() {
    gulp.watch(paths.styles.src, styles)
    gulp.watch(paths.scripts.src, scripts)
}

const build = gulp.series(clean, gulp.parallel(styles, scripts), whatch)

exports.clean = clean
exports.styles = styles
exports.scripts = scripts
exports.whatch = whatch
exports.build = build
exports.default = build

