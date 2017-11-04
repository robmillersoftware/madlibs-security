const fs = require('fs');
const path = require('path');

console.log('-Cleaning distribution directory');

const deleteDir = dirPath => {
    var files = fs.readdirSync(dirPath);
       
    for (const file of files) {
        var filePath = path.join(dirPath, file);
        var stats = fs.statSync(filePath);

        if (stats.isFile()) {
            fs.unlinkSync(filePath);
        } else if (stats.isDirectory()) {
            try {
                deleteDir(filePath);
            } catch (err) {
                throw err;
            }
        }
    }

    fs.rmdirSync(dirPath);
}

var dirName = path.join(process.env.PWD, '/dist');

try { deleteDir(dirName); }
catch(err) { if (err.code !== 'ENOENT') throw err; }

if (!fs.existsSync(dirName)) fs.mkdirSync(dirName);    

console.log('--Finished clean');