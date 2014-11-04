'use strict';
var gulp = require('gulp');
var runSequence = require('run-sequence');
var del = require('del');

var dhisDirectory;
var buildDirectory = 'build';

var files = [
    //Vendor dependency files
    'vendor/angular/angular.js',
    'vendor/ui-router/release/angular-ui-router.js',
    'vendor/lodash/dist/lodash.js',
    'vendor/restangular/dist/restangular.js',

    //Test specific includes
    'test/utils/*.js',
    'test/matchers/*.js',
    'test/mocks/*_mock.js',
    'vendor/angular-mocks/angular-mocks.js',

    //Source files
    'src/**/*.js',
    //Jasmine spec files
    'test/specs/**/*_spec.js'
];

/**************************************************************************************************
 * Utility functions
 */

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
        jshint: 'Run jshint on the sourcecode',
        jscs: 'Run jscs on the sourcecode',
        sass: 'Run sass on the sass files and save the output to temp directory',
        i18n: 'Copy the language files to the build directory',
        manifest: 'Copy the manifest to the build directory',
        images: 'Copy the images to the build directory',
        package: 'Package the build directory in a zip file',
        min: 'Minify and concat the html and javascript files'
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

gulp.task('test', function () {
    return gulp.src(files).pipe(runKarma());
});

gulp.task('watch', function () {
    return gulp.src(files).pipe(runKarma(true));
});

gulp.task('jshint', function () {
    var jshint = require('gulp-jshint');
    return gulp.src([
            'test/specs/**/*.js',
            'src/**/*.js'
        ])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('jscs', function () {
    var jscs = require('gulp-jscs');
    return gulp.src([
        'test/specs/**/*.js',
        'src/**/*.js'
    ]).pipe(jscs('./.jscsrc'));
});

gulp.task('sass', function () {
    var sass = require('gulp-ruby-sass');

    gulp.src('app/app.sass', { base: './src/' })
        .pipe(sass())
        .pipe(gulp.dest(
            ['temp', 'css'].join('/')
        ));
});

gulp.task('i18n', function () {
    return gulp.src('src/i18n/**/*.json', { base: './src/' }).pipe(gulp.dest(
        buildDirectory
    ));
});

gulp.task('manifest', function () {
    return gulp.src('src/**/*.webapp', { base: './src/' }).pipe(gulp.dest(
        buildDirectory
    ));
});

gulp.task('images', function () {
    return gulp.src('src/**/icons/**/*', { base: './src/' }).pipe(gulp.dest(
        buildDirectory
    ));
});

gulp.task('package', function () {
    var zip = require('gulp-zip');
    return gulp.src('build/**/*', { base: './build/' })
        .pipe(zip('user-management.zip', { compress: false }))
        .pipe(gulp.dest('.'));
});

gulp.task('min', function () {
    var usemin = require('gulp-usemin');
    var minifyCss = require('gulp-minify-css');
    var minifyHtml = require('gulp-minify-html');
    var ngAnnotate = require('gulp-ng-annotate');
    var uglify = require('gulp-uglify');
    var rev = require('gulp-rev');

    return gulp.src([
            'src/*.html'
        ])
        .pipe(usemin({
            html: [minifyHtml({empty: true, quotes: true })],
            js: [ngAnnotate({
                add: true,
                remove: true,
                single_quotes: true,
                stats: true
            }), uglify(), rev()]
        }))
        .pipe(gulp.dest(buildDirectory));
});

gulp.task('copy-files', function () {
    //TODO: Copy templates
});

gulp.task('build', function () {
    return runSequence('clean', 'sass', 'i18n', 'manifest', 'images', 'jshint', 'jscs', 'min', 'copy-files');
});

gulp.task('build-prod', function () {
    return runSequence('clean', 'sass', 'i18n', 'manifest', 'images', 'jshint', 'jscs', 'min', 'copy-files', 'package');
});

gulp.task('clean', function () {
    return del(buildDirectory);
});
