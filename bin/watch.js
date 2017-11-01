/**
 * This script sets up watches on all js, css, and ejs files in the src directory.
 * If there are changes made to any of them it executes the appropriate npm script
 */
var watch = require('node-watch');

spawn = require('child_process').spawn;

watch('src', { recursive: true }, (e, file) => {
    // Use the extension of the file as the npm script name
    const script = 'build:' + file.split('.').pop();

    if (['build:js', 'build:css', 'build:ejs'].includes(script)) {
        // Spawn the process
        const p = spawn('npm', ['run', script], {
            stdio: 'inherit' // pipe output to the console
        });
        // Print something when the process completes
        p.on('close', code => {
            if (code === 1) {
                console.error(`✖ "npm run build:${script}" failed.`);
            } else {
                console.log( '*****                             *****\n' +
                             '*        Watching for changes...      *\n' +
                             '*****                             *****');
            }
        });
    }
});

console.log( '*****                             *****\n' +
             '*        Watching for changes...      *\n' +
             '*****                             *****');