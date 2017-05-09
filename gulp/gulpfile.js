var gulp = require('gulp');
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');

// minify JavaScript
gulp.task('minify', function() {
  gulp.src('js/main.js')
  //.pipe(sourcemaps.init())
  .pipe(uglify())
  //.pipe(sourcemaps.write())
  .pipe(gulp.dest('build'));
});

// autoprefix css
gulp.task('processCSS', function() {
  gulp.src('styles/main.css')
  .pipe(sourcemaps.init())
  .pipe(autoprefixer())
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('build'));
});

// build, serve & watch
gulp.task('serve', ['processCSS', 'minify'], function() {
  
  // server
  browserSync.init({
    server: '.',
    port: 3000
  });

  // Watch for file changes then proccess/minify and reload server
  gulp.watch('styles/*.css', ['processCSS']).on('change', browserSync.reload);
  gulp.watch('js/*.js', ['minify']).on('change', browserSync.reload);
  gulp.watch('*.html').on('change', browserSync.reload);
});

// Default Task
gulp.task('default', ['serve']);
