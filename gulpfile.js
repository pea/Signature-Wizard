var gulp = require('gulp'),
    runSequence = require('run-sequence'),
    watch = require('gulp-watch'),
    zip = require('gulp-zip'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    htmlmin = require('gulp-htmlmin');

gulp.task('watch', function() {
    gulp.watch('src/**/*.*', ['serve']);
});

gulp.task('sass', function() {
    return gulp.src('src/scss/*.scss').
    pipe(sass.sync().on('error', sass.logError)).
    pipe(sass({
        outputStyle: 'compressed'
    }).on('error', sass.logError)).
    pipe(gulp.dest('dist/css'));
});

gulp.task('compress', function() {
    return gulp.src('src/js/*.js').
    pipe(uglify()).
    pipe(gulp.dest('dist/js'));
});

gulp.task('htmlmin', function() {
    return gulp.src('src/*.html').
    pipe(htmlmin({
        collapseWhitespace: true
    })).
    pipe(gulp.dest('dist'));
});

gulp.task('copyimages', function() {
    return gulp.src('src/images/**/*.{png,gif,jpeg,jpg,svg}').
    pipe(gulp.dest('dist/images'));
});

gulp.task('copymanifest', function() {
    return gulp.src('src/manifest.json').
    pipe(gulp.dest('dist'));
});

gulp.task('copylocales', function() {
    return gulp.src('src/_locales/**/*.*').
    pipe(gulp.dest('dist/_locales'));
});

gulp.task('zip', function() {
    return gulp.src('src/**/*.*').
    pipe(zip('dist.zip')).
    pipe(gulp.dest('dist'));
});

gulp.task('dist', function(callback) {
    runSequence(
        'sass',
        'compress',
        'htmlmin',
        'copyimages',
        'copymanifest',
        'copylocales',
        'zip',
        callback);
});

gulp.task('serve', function(callback) {
    runSequence(
        'sass',
        'compress',
        'htmlmin',
        'copyimages',
        'copymanifest',
        'copylocales',
        callback);
});