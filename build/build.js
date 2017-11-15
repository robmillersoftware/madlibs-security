const args = process.argv.slice(2);
const exec = require('child_process').execSync;
const validCommands = ['-js','-ejs','-css','-ss','-assets'];
let commandsToRun = [];

console.log('-Running builds');

const displayUsage = () => {
    console.log('Usage: node build.js -js|-json|-ejs|-css|-ss|-assets');
    process.exit();
}

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
    exec(`npm run parse -s; cd ${process.env.PWD}/src; cp -rf plugins ../dist; cp -rf chat/tag/*.txt ../node_modules/bot-lang/data/tag; cp -rf chat/tag/tag.js ../node_modules/bot-lang/lib/tag.js`, (err, stdout, stderr) => {
        if (err) throw err;
    });
}

const runAssets = () => {
    console.log('--Copying assets');
    exec(`cd ${process.env.PWD}/src; cp -rf --parents assets/* ../dist`, (err, stdout, stderr) => {
        if (err) throw err;
    });
}

const runJson = () => {
    console.log('--Copying json');
    exec(`cd ${process.env.PWD}/src; cp -rf --parents api/*.json ../dist`, (err, stdout, stderr) => {
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