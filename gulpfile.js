'use strict';

var gulp          = require('gulp'),
    autoprefixer  = require('autoprefixer-core'),
    sass          = require('gulp-ruby-sass'),
    babel         = require('gulp-babel'),
    uglify        = require('gulp-uglify'),
    browserSync   = require('browser-sync'),
    reload        = browserSync.reload,
    plumber       = require('gulp-plumber'),
    del           = require('del'),
    rename        = require('gulp-rename');

//sass to css conversion and compression
gulp.task('sass', function() {
  var processors = [
      autoprefixer({browsers: ['last 3 versions']}),
  ];
  return sass('sass/style.sass', {
  style: 'compressed', })
  .pipe(plumber())
  .pipe(gulp.dest('css/'))
  .pipe(reload({stream:true}));
});

//javascript compression / transpile
gulp.task('js', function() {
  gulp.src('js/app.js')
  .pipe(babel())
  .pipe(plumber())
  .pipe(rename({suffix:'.min'}))
  .pipe(uglify())
  .pipe(gulp.dest('js-min/'))
  .pipe(reload({stream:true}));
});

//html tasks
gulp.task('html', function() {
  gulp.src('*.html')
  .pipe(reload({stream:true}));
});

//final production build
gulp.task('build:copy', function() {
  return gulp.src('./**/*/')
  .pipe(gulp.dest('build/'));
});

gulp.task('build:delete', ['build:copy'], function(cb) {
  del([
    'build/sass',
    'build/js',
    'build/node_modules',
    'build/gulpfile.js',
    'build/package.json',
  ], cb);
});

gulp.task('build', ['build:copy', 'build:delete']);

//browserSync
gulp.task('browser-sync', function() {
  browserSync({
    browser: "google chrome",
    server:{
      baseDir: './',
    },
  });
});

// watch
gulp.task('watch', function() {
  gulp.watch('sass/*.sass', ['sass']);
  gulp.watch('js/*.js', ['js']);
  gulp.watch('*.html', ['html']);
});

//default tasks
gulp.task('default', ['sass', 'js', 'html', 'browser-sync', 'watch']);
