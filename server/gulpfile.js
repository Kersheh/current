const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const eslint = require('gulp-eslint');

gulp.task('lint', () => {
  gulp.src('./**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('nodemon', () => {
  nodemon({
    script: 'app.js',
    ext: 'js',
    env: { 'NODE_ENV': 'development' },
    ignore: ['test/*', 'node_modules/*']
  });
});

gulp.task('nodemon-debug', () => {
  nodemon({
    exec: 'node --inspect',
    ext: 'js',
    script: 'app.js',
    verbose: true,
    ignore: ['test/*', 'node_modules/*']
  });
});

gulp.task('dev', ['lint', 'nodemon']);

gulp.task('debug', ['lint', 'nodemon-debug']);
