const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const handlebars = require('gulp-compile-handlebars');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const autoprefixer = require('gulp-autoprefixer');


// Compile SCSS to CSS
function css(){
  return gulp
  .src('src/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream())
};

// Compile Handlebars to HTML
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
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream());
};


// Optimize Images
function images() {
  return gulp
    .src("./src/images/**/*")
    // .pipe(newer(".dist/images"))
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.jpegtran({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [
            {
              removeViewBox: false,
              collapseGroups: true
            }
          ]
        })
      ])
    )
    .pipe(gulp.dest("./dist/images"));
};


// Watch files for changes
function watch() {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  });
  gulp.watch('src/scss/**/*.scss', css)
  gulp.watch('src/**/*.hbs', html)
  gulp.watch('src/**/*.html').on('change', browserSync.reload)
  gulp.watch('src/js/**/*.js').on('change', browserSync.reload)
  gulp.watch("src/images/**/*", images)

};

// function build() {
// };


exports.css = css;
exports.watch = watch;
exports.html = html;
exports.images = images;