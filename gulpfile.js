/* jshint globalstrict: true*/
/* global console, require */
'use strict';
var gulp = require('gulp');
var path = require('path');

var dhisDirectory;
var buildDirectory = 'build';

var files = [
    //Vendor dependency files
    'vendor/angular/angular.js',

    //Source files
    'src/**/*.js',
    //Jasmine spec files
    'test/specs/**/*_spec.js'
];

/**************************************************************************************************
 * Utility functions
 */

/**
 * Checks if the dhis.json file is present in the root of the project. This will be required for
 * tasks that interact with a running dhis2 instance (for example to circumvent the install process)
 */
 function checkForDHIS2ConfigFile() {
    var dhisConfig = require(path.resolve('./dhis.json'));

    if (dhisConfig.dhisDeployDirectory) {
        console.log('');
        console.log('Dhis 2 deploy directory not set, please add a dhis.json to your project that looks like');
        console.log(JSON.stringify({ dhisDeployDirectory: '<YOUR DHIS2 DIRECTORY>' }, undefined, 2));
        console.log('');
        return;
    }
    dhisDirectory = dhisConfig.dhisDeployDirectory;
}

function runKarma(watch) {
    var karma = require('gulp-karma');
    var config = {
        configFile: 'test/karma.conf.js'
    };

    if (!watch) {
        watch = false;
    }

    if (watch === true) {
        config.action = 'watch';
    }

    return karma(config);
}

function printHelp() {
    var task;
    var taskDescriptions = {
        default: 'Display this help',
        test: 'Run the unit tests once',
        watch: 'Run the unit tests on change detection',
        jslint: 'Run jshint on the sourcecode',
        jscs: 'Run jscs on the sourcecode',
        js: 'Run jslint and jscs tasks on the sourcecode'
    };

    console.log('\nGulp has the following available tasks.');
    for (task in gulp.tasks) {
        if (gulp.tasks.hasOwnProperty(task)) {
            console.log('  ' + gulp.tasks[task].name + (taskDescriptions[task] ? ' -- ' + taskDescriptions[task] : ''));
        }
    }
    console.log('');
}

/**************************************************************************************************
 * Gulp tasks
 */
gulp.task('default', function () {
    printHelp();
});

gulp.task('clean', function(cb){
    var rimraf = require('rimraf');
    rimraf('./build', cb);
});

gulp.task('test', function () {
    gulp.src(files).pipe(runKarma());
});

gulp.task('watch', function () {
    gulp.src(files).pipe(runKarma(true));
});

gulp.task('jshint', function () {
    var jshint = require('gulp-jshint');
    return gulp.src(
            './test/specs/**/*.js',
            './src/**/*.js'
        )
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('jscs', function () {
    var jscs = require('gulp-jscs');
    return gulp.src('src/main/**/*.js').pipe(jscs('./.jscsrc'));
});

gulp.task('sass', function () {
    var sass = require('gulp-ruby-sass');
    var minifyCss = require('gulp-minify-css');

    return gulp.src('src/main/**.sass')
        .pipe(sass())
        .pipe(minifyCss())
        .pipe(gulp.dest(
            [buildDirectory, 'css'].join('/')
        ));
});

gulp.task('html', function () {
    var minifyHTML = require('gulp-minify-html');

    gulp.src('src/main/**/*.html').pipe(minifyHTML({ empty: true, quotes: true })).pipe(gulp.dest(
        buildDirectory
    ));
});

gulp.task('i18n', function () {
    gulp.src('**/i18n/**/*.json', { base: './src/main/' }).pipe(gulp.dest(
        buildDirectory
    ));
});

gulp.task('manifest', function () {
    gulp.src('**/*.webapp', { base: './src/main/' }).pipe(gulp.dest(
        buildDirectory
    ));
});

gulp.task('package', function () {
    var zip = require('gulp-zip');
    gulp.src('build/**/*', { base: './build/' })
        .pipe(zip('approvals.zip', { compress: false }))
        .pipe(gulp.dest('.'));
});

gulp.task('build', function () {
    var runSequence = require('run-sequence');
    runSequence('clean', 'js', 'sass', 'html', 'dependencies', 'i18n', 'images', 'manifest');
});

gulp.task('live', function () {
    checkForDHIS2ConfigFile();
});
// jscs:disable
gulp.task('min', ['jshint', 'jscs', 'sass'], function () {
    var usemin = require('gulp-usemin');
    var minifyCss = require('gulp-minify-css');
    var minifyHtml = require('gulp-minify-html');
    var ngAnnotate = require('gulp-ng-annotate');
    var uglify = require('gulp-uglify');
    var rev = require('gulp-rev');

    // jscs:disable
    gulp.src([
            'src/*.html',
            'src/app/**/*.js',
            'src/css/**/*.css'
        ])
        // jscs:disable
        .pipe(usemin({
            css: [minifyCss(), 'concat'],
            html: [minifyHtml({empty: true, quotes: true })],
            // jscs:disable
            js: [ngAnnotate({
                add: true,
                remove: true,
                // jscs:disable
                single_quotes: true,
                stats: true
            }), uglify(), rev()]
        }))
        .pipe(gulp.dest(buildDirectory));
});

