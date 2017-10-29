const config = require('../config');
const copyUtil = require('../utils/copy');
const gulp = require('gulp');

/**
 * Dev build. Builds all files and copies everything to dist 
 * folder then sets watches
 */
gulp.task('devUi', ['clean', 'buildUi', 'copy'], () => {
    config.browserSync.init(config.browserSyncInit);

    gulp.watch(config.ui.js + '/**/*.js', ['buildUi']);
    gulp.watch(config.lib + '/**/*.js', ['buildUi']);
    gulp.watch(config.ui.scss + '/**/*.scss', ['buildUi']);
    gulp.watch(config.ui + '/**/*.html').on('change', copyUtil.copyHtmlAndReload);
});