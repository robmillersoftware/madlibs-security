const config   = require('../config');
const copyUtil = require('../utils/copy');
const gulp     = require('gulp');

/**
 * Copy tasks for various file types. These are separated in case further
 * logic needs to be performed on a file type
 */
gulp.task('copyHtml', () => {
    copyUtil.copy(config.ui.dir + '/**/*.html', config.dist.dir);
});

gulp.task('copyAssets', () => {
    copyUtil.copy(config.ui.images + '/*', config.dist.images);
});

gulp.task('copyLib', () => {
    copyUtil.copy(config.lib + '/*', config.dist.lib);
});

gulp.task('copy', ['copyHtml', 'copyAssets', 'copyLib'], () => {
    config.browserSync.reload();
});