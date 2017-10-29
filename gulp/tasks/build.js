const browserify  = require('browserify');
const babelify    = require('babelify');
const source      = require('vinyl-source-stream');
const buffer      = require('vinyl-buffer');
const uglify      = require('gulp-uglify');
const sourcemaps  = require('gulp-sourcemaps');
const sass        = require('gulp-sass');
const gulp        = require('gulp');

const config      = require('../config');

/**
 * Task to build javascript files. Outputs source maps and 
 * browser-ready javascript
 */
gulp.task('buildApp', () => {
    return browserify(config.browserifyApp)
        .transform('babelify', config.babelify)
        .bundle()
        .pipe(source(config.browserifyApp.outfile))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(sourcemaps.write(config.browserifyApp.mapsDir))
        .pipe(gulp.dest(config.dist.js))
});

/**
 * Compiles sass to css
 */
gulp.task('buildSass', () => {
    return gulp.src(config.ui.scss + '/*.scss')
        .pipe(sass())
        .pipe(gulp.dest(config.dist.css));
});

/**
 * Runs both the JS build and the Sass build
 */
gulp.task('buildUi', ['buildApp', 'buildSass'], (done) => {
    config.browserSync.reload({stream: true});
    done();
});