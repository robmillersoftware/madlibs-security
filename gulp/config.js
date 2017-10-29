/**
 * This file exports the configuration object for the gulp build. Generally,
 * hard-coded strings and configuration/options objects should all go here
 */

const lib = './src/lib';

const dist = {
    get dir() { return './dist'; },
    get js() { return this.dir + '/js'; },
    get maps() { return this.js + '/maps'; },
    get assets() { return this.dir + '/assets'; },
    get images() { return this.assets + '/images'; },
    get css() { return this.assets + '/css'; },
    get lib() { return this.dir + '/lib'; }
};

const ui = {
    get dir() { return './src/ui'; },
    get assets() { return this.dir + '/assets'; },
    get images() { return this.assets + '/images'; },
    get scss() { return this.assets + '/styling'; },
    get js() { return this.dir + '/js'; }
};

const server = {
    get dir() { return './src/server'; },
    get js() { return this.dir + '/js'; }
};

module.exports = {
    lib: lib,
    ui: ui,
    dist: dist,
    server: server,
    browserSync: require('browser-sync').create(),
    browserSyncInit: {
        port: 3000,
        server: {
            baseDir: dist.dir,
            index: 'index.html'
        },
        open: false
    },
    browserifyApp: {
        outfile: 'index.js',
        mapsDir: './maps',
        entries: ui.js + '/main.js', 
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