var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('gulp-buffer');
var uglify = require('gulp-uglify');
var _if = require('gulp-if');
var plumber = require('gulp-plumber');
var browserify = require('browserify');
var reactify = require("reactify");
var template = require('gulp-template');

var isProduction = process.env.NODE_ENV === 'production' || false;

var path = {
	scriptsPath: './js/**/*.js',
	scripts: './js/app.js'
}

var output = {
	app: './public/bundle/js'
}

var errorHandler = function(error) {
    console.log('Error!');
    throw error;
}

gulp.task('js', function () {
    var options = {
        debug: !isProduction
    };

    var b = browserify(options);
    b.transform("reactify");
    b.add(path.scripts);

    b.bundle()
    .on('error', errorHandler)
    .pipe(source('app.bundle.js'))

    .pipe(_if(isProduction, buffer()))
    .pipe(_if(isProduction, uglify()))

    .pipe(gulp.dest(output.app))
});

gulp.task('watch', ['default'], function() {
  gulp.watch(path.scriptsPath, ['js']);
  gulp.watch('templates/**/*.html', ['templates']);
});

gulp.task('templates', function () {
  gulp.src('templates/**/*.html')
    .pipe(template({ GOOGLE_MAPS_APIKEY: process.env.GOOGLE_MAPS_APIKEY }))
    .pipe(gulp.dest('public/'));
});

gulp.task('default', ['js', 'templates']);
