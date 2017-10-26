/**
 * Runs require for every file in utils and tasks directories. This makes it easy to add and remove gulp tasks
 */
const fs = require('fs');

var utilsPath = require('path').join(__dirname, 'utils');
fs.readdirSync(utilsPath).forEach(file => {
    require('./utils/' + file);
});

var tasksPath = require('path').join(__dirname, 'tasks');
fs.readdirSync(tasksPath).forEach(file => {
    require('./tasks/' + file);
});