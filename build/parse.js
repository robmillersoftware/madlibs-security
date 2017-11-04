const exec = require('child_process').exec;

console.log('-Parsing chatbot scripts');
exec('parse -f -p src/chat -o dist/data.json', (err, stdout, stderr) => {
    if (err) throw err;
});
console.log('--Finished parsing');