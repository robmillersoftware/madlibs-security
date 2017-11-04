const args = process.argv.slice(2);
const exec = require('child_process').exec;
const validCommands = ['-js','-ejs','-css','-ss','-assets'];
let commandsToRun = [];

console.log('-Running builds');

args.forEach(arg => {
    if (!validCommands.includes(arg)) {
        displayUsage();
        throw new Error("Invalid argument " + arg + " passed to build");
    }

    commandsToRun.push(arg);
});

const runJs = () => {
    console.log('--Building with Babel');
    exec(`babel -d ${process.env.PWD}/dist ${process.env.PWD}/src -s`, (err, stdout, stderr) => {
        if (err) throw err;
    });
}

const runEjs = () => {
    console.log('--Copying .ejs files');
    exec(`cd ${process.env.PWD}/src; cp -f --parents pages/**/*.ejs ../dist`, (err, stdout, stderr) => {
        if (err) throw err;
    });
}

const runCss = () => {
    console.log('--Copying .css files');
    exec(`cd ${process.env.PWD}/src; cp -f --parents pages/**/*.css ../dist`, (err, stdout, stderr) => {
        if (err) throw err;
    });
}

const runSs = () => {
    console.log('--Compiling bot scripts and copying plugins');
    exec(`npm run parse -s; cd ${process.env.PWD}/src; cp -rf plugins ../dist`, (err, stdout, stderr) => {
        if (err) throw err;
    });
}

const runAssets = () => {
    console.log('--Copying assets');
    exec(`cd ${process.env.PWD}/src; cp -rf --parents assets/* ../dist`, (err, stdout, stderr) => {
        if (err) throw err;
    });
}

commandsToRun.forEach(cmd => {
    switch(cmd) {
        case '-js':
            runJs();
            break;
        case '-ejs':
            runEjs();
            break;
        case '-css':
            runCss();
            break;
        case '-ss':
            runSs();
            break;
        case '-assets':
            runAssets();
            break;
    }
});

console.log('-Finished builds');