/**
 * This file exports the configuration object for the gulp build. Generally,
 * hard-coded strings and configuration/options objects should all go here
 */
const dest = './dist';
const src = './src';

module.exports = {
    dest: dest,
    src: src,
    browserSync: require('browser-sync').create(),
    browserSyncInit: {
        port: 3000,
        server: {
            baseDir: dest,
            index: 'index.html'
        },
        open: false
    },
    browserifyApp: {
        entries: src + '/js/main.js', 
        debug: true
    },
    browserifyLib: {
        debug: true
    },
    babelify: {
        presets: ['env'],
        sourceMaps: true 
    }
};