const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const handlebars = require('gulp-compile-handlebars');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');

function css(){
  return gulp
  .src('src/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.stream())
}


function html() {
  return gulp
    .src('./src/pages/*.hbs')
    .pipe(handlebars({}, {
      ignorePartials: true,
      batch: ['./src/partials']
    }))
    .pipe(rename({
      extname: '.html'
    }))
    .pipe(gulp.dest('./src'))
    .pipe(browserSync.stream());
};


function watch() {
  browserSync.init({
    server: {
      baseDir: 'src'
    }
  });
  gulp.watch('src/scss/**/*.scss', css)
  gulp.watch('src/**/*.hbs', html)
  gulp.watch('src/**/*.html').on('change', browserSync.reload)
  gulp.watch('src/js/**/*.js').on('change', browserSync.reload)
};

// function build() {
// };


exports.css = css;
exports.watch = watch;
exports.html = html;