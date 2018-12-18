'use strict';

const gulp = require('gulp');
const browserSync = require('browser-sync').create();
// const del = require('del');
const env = require('gulp-util').env;
const handlebars = require('gulp-compile-handlebars');
const rename = require('gulp-rename');
// var gulp          = require('gulp');
// const browserSync   = require('browser-sync').create();
const $             = require('gulp-load-plugins')();
const autoprefixer  = require('autoprefixer');

const config = {
  src: './src',
  dest: './dist',
  watchers: [
    {
      match: ['./src/**/*.hbs'],
      tasks: ['html']
    }
  ]
};

var sassPaths = [
  'node_modules/foundation-sites/scss',
  'node_modules/motion-ui/src'
];

gulp.task('clean', () => del(config.dest));

gulp.task('html', ['clean'], () => {
  return gulp.src(`${config.src}/pages/*.hbs`)
    .pipe(handlebars({}, {
      ignorePartials: true,
      batch: [`${config.src}/partials`]
    }))
    .pipe(rename({
      extname: '.html'
    }))
    .pipe(gulp.dest(config.dest));
});

function sass() {
  return gulp.src('scss/app.scss')
    .pipe($.sass({
      // includePaths: sassPaths,
      outputStyle: 'compressed' // if css compressed **file size**
    })
      .on('error', $.sass.logError))
    .pipe($.postcss([
      autoprefixer({ browsers: ['last 2 versions', 'ie >= 9'] })
    ]))
    .pipe(gulp.dest('css'))
    .pipe(browserSync.stream());
};

function serve() {
  browserSync.init({
    server: "./"
  });

  gulp.watch("scss/*.scss", sass);
  gulp.watch("*.html").on('change', browserSync.reload);
}

gulp.task('serve', () => {
  browserSync.init({
    open: false,
    notify: false,
    files: [`${config.dest}/**/*`],
    server: config.dest
  });
});

gulp.task('watch', () => {
  config.watchers.forEach(item => {
    gulp.watch(item.match, item.tasks);
  });
});

gulp.task('default', ['html'], done => {
  if (env.dev) {
    gulp.start('serve');
    gulp.start('watch');
  }
  done();
});


gulp.task('sass', sass);
gulp.task('serve', gulp.series('sass', serve));
gulp.task('default', gulp.series('sass', serve));












