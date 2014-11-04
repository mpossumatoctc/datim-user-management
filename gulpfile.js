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

/**
 * Checks if the dhis.json file is present in the root of the project. This will be required for
 * tasks that interact with a running dhis2 instance (for example to circumvent the install process)
 */
 function checkForDHIS2ConfigFile() {
    var path = require('path');
    var dhisConfig = require(path.resolve('./dhis.json'));

    if (!dhisConfig.dhisDeployDirectory) {
        console.log('');
        console.log('Dhis 2 deploy directory not set, please add a dhis.json to your project that looks like');
        console.log(JSON.stringify({ dhisDeployDirectory: '<YOUR DHIS2 DIRECTORY>' }, undefined, 2));
        console.log('');
        throw new Error('DHIS deploy location not found');
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

    gulp.src('**/*.sass')
        .pipe(sass())
        .pipe(gulp.dest(
            [buildDirectory, 'css'].join('/')
        ));
});

gulp.task('i18n', function () {
    return gulp.src('**/i18n/**/*.json', { base: './src/' }).pipe(gulp.dest(
        buildDirectory
    ));
});

gulp.task('manifest', function () {
    return gulp.src('**/*.webapp', { base: './src/' }).pipe(gulp.dest(
        buildDirectory
    ));
});

gulp.task('images', function () {
    return gulp.src('**/icons/**/*', { base: './src/' }).pipe(gulp.dest(
        buildDirectory
    ));
});

gulp.task('package', function () {
    var zip = require('gulp-zip');
    return gulp.src('build/**/*', { base: './build/' })
        .pipe(zip('approvals.zip', { compress: false }))
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
            css: [minifyCss(), 'concat'],
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

});

gulp.task('deploy', function () {
    checkForDHIS2ConfigFile();
    return gulp.src(buildDirectory + '/**/*').pipe(gulp.dest(dhisDirectory));
});

gulp.task('build', function () {
    return runSequence('clean', 'sass', 'i18n', 'manifest', 'images', 'jshint', 'jscs', 'min', 'copy-files');
});

gulp.task('build-prod', function () {
    return runSequence('build', 'package');
});

gulp.task('clean', function () {
    return del(buildDirectory);
});

gulp.task('clean-app-dir', function (cb) {
    return del([
        dhisDirectory + '**',
        '!' + dhisDirectory + 'manifest.webapp'
    ], cb, { force: true });
});

gulp.task('build-to-dev', function () {
    var path = require('path');
    var oldManifest;

    checkForDHIS2ConfigFile();
    try{
        oldManifest = require(path.resolve(dhisDirectory + 'manifest.webapp'));
    } catch (e) {

    }

    console.log(oldManifest);
    return runSequence('clean-app-dir', 'build', 'deploy');
});
