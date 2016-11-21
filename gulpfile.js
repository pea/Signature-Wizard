var gulp = require('gulp'),
    runSequence = require('run-sequence'),
    watch = require('gulp-watch'),
    zip = require('gulp-zip'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    htmlmin = require('gulp-htmlmin')
    del = require('del'),
    argv = require('yargs').argv,
    bump = require('gulp-bump'),
    fs = require('fs');

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
    var packageJson = JSON.parse(fs.readFileSync('./package.json'));
    return gulp.src('dist/**/*.*').
    pipe(zip('dist_' + packageJson.version + '.zip')).
    pipe(gulp.dest('./'));
});

gulp.task('clean', function () {
    return del([
        'dist',
        'dist_*.*.*.zip'
    ]);
});

gulp.task('bump', function(){
    //if(argv.bump === undefined) { return; }
    var options = {};
    switch(argv.bump) {
        case 'minor': options = {type:'minor'}; break;
        case 'major': options = {type:'major'}; break;
        default: options = {};
    }
    gulp.src('./package.json')
        .pipe(bump(options))
        .pipe(gulp.dest('./'));

    gulp.src('./src/manifest.json')
        .pipe(bump(options))
        .pipe(gulp.dest('./src'));
});

gulp.task('dist', function(callback) {
    runSequence(
        'bump',
        'clean',
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
        //'copylocales',
        callback);
});