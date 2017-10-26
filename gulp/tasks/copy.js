const config   = require('../config');
const copyUtil = require('../utils/copy');
const gulp     = require('gulp');

/**
 * Copy tasks for various file types. These are separated in case further
 * logic needs to be performed on a file type
 */
gulp.task('copyHtml', () => {
    copyUtil.copy('./src/**/*.html', './dist');
});

gulp.task('copyAssets', () => {
    copyUtil.copy('./src/assets/images/*', './dist/assets/images');
});

gulp.task('copyLib', () => {
    copyUtil.copy('./src/lib/*', './dist/lib');
});

gulp.task('copy', ['copyHtml', 'copyAssets', 'copyLib'], () => {
    config.browserSync.reload();
});