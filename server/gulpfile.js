const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const eslint = require('gulp-eslint');
const clean = require('gulp-clean');
const prompt = require('gulp-prompt');
const spawn = require('child_process').spawn;
const config = require('config');

const DB_PATH = config.get('DATABASE.PATH');

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

gulp.task('mongod', () => {
  spawn('mongod', ['--dbpath', DB_PATH]);
});

gulp.task('mongo-shutdown', () => {
  spawn('mongo', ['--eval', "db.getSiblingDB('admin').shutdownServer()"]);
});

gulp.task('clean-temp', () => {
  return gulp.src('temp/*.png', {read: false})
    .pipe(clean({force: true}));
});

gulp.task('clean-log', () => {
  return gulp.src('log/*.log', {read: false})
    .pipe(clean({force: true}));
});

gulp.task('clean-db', () => {
  return gulp.src([
    '!data/.gitkeep',
    'data/*'
  ], {read: false})
    .pipe(prompt.confirm('Are you sure you want to delete the database contents?'))
    .pipe(clean({force: true}));
});

gulp.task('dev', ['lint', 'mongod', 'nodemon']);
gulp.task('debug', ['lint', 'mongod', 'nodemon-debug']);
gulp.task('clean', ['clean-temp', 'clean-log']);
gulp.task('clean-all', ['clean-temp', 'clean-log', 'clean-db']);
