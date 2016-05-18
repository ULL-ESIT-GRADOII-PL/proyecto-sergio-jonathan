var gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  del = require('del'),
  minifyHTML = require('gulp-minify-html'),
  minifyCSS = require('gulp-clean-css'),
  karma = require('karma').server,
  gulp = require('gulp'),
  ghPages = require('gulp-gh-pages'),
  imagemin = require('gulp-imagemin'),
  jpegtran = require('imagemin-jpegtran'),
  shell = require('gulp-shell');


gulp.task('minify', function() {
  gulp.src(['!public/js/*.min.js', 'public/js/*.js'])
    .pipe(gulp.dest('minified/js'));

  gulp.src(['!public/tests/*.min.js', 'public/tests/*.js'])
    .pipe(uglify({
      mangle: false
    }))
    .pipe(gulp.dest('minified/tests'));

  gulp.src('public/indice.html')
    .pipe(minifyHTML())
    .pipe(rename(function(path) {
      path.basename = "index";
    }))
    .pipe(gulp.dest('minified'))

  gulp.src('public/tests/index.html')
    .pipe(minifyHTML())
    .pipe(gulp.dest('minified/tests'))

  gulp.src(['!public/css/*.min.css', 'public/css/*.css'])
    .pipe(minifyCSS({
      keepBreaks: true,
      processImport: false
    }))
    .pipe(gulp.dest('minified/css'))

  gulp.src(['!public/tests/*.min.css', 'public/tests/*.css'])
    .pipe(minifyCSS({
      keepBreaks: true,
      processImport: false
    }))
    .pipe(gulp.dest('minified/tests'))

  gulp.src('public/images/*')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false
      }],
      use: [jpegtran()]
    }))
    .pipe(gulp.dest('minified/images'));
});

gulp.task('clean', function(cb) {
  del(['minified/**'], cb);
});

gulp.task('tests', function(done) {
  return karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);
});

gulp.task('deploy', function() {
  return gulp.src('./minified/**/*')
    .pipe(ghPages());
});

gulp.task('default', shell.task([
  'gulp clean && gulp minify && gulp deploy'
]));
