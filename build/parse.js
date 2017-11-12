const args = process.argv.slice(2);
const exec = require('child_process').exec;

let mongoURI = null;

if (args.length > 0 && args[0] === '-local') {
    mongoURI = 'mongodb://localhost:27017';
} else {
    mongoURI = 'mongodb://pnc-madlibs:cfo12345@ds042607.mlab.com:42607/pnc-madlibs';
}

console.log('-Parsing chatbot scripts');
exec('parse -f --mongoURI "' + mongoURI + '" -p src/chat -o dist/data.json', (err, stdout, stderr) => {
    if (err) throw err;
});

exec('cleanup --mongoURI "' + mongoURI + '"', (err, stdout, stderr) => {
    if (err) throw err;
});

console.log('--Finished parsing');