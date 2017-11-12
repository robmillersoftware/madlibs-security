const args = process.argv.slice(2);
const exec = require('child_process').exec;

let mongoURI = null;

if (args.length > 0 && args[0] === '-local') {
    mongoURI = 'mongodb://localhost:27017';
} else {
    mongoURI = 'mongodb://pnc-madlibs:cfo12345@ds157475.mlab.com:57475/heroku_lf1gc35j';
}

console.log('-Parsing chatbot scripts');
exec('cd src; parse -f --mongoURI "' + mongoURI + '" -p chat -o ../dist/data.json', (err, stdout, stderr) => {
    if (err) throw err;
});

exec('cd src; cleanup --mongoURI "' + mongoURI + '" --importFile ../dist/data.json', (err, stdout, stderr) => {
    if (err) throw err;
});

console.log('--Finished parsing');