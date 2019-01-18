var fs = require('fs');
var fse = require('fs-extra');

var sourceDirectory = "./production/dist/";
var targetDirectory = "./production/gzip/";

fs.readdirSync(targetDirectory).forEach(item => {
    if (fs.lstatSync(targetDirectory + item).isDirectory()) {
        fse.removeSync(targetDirectory + item);
    }
    else if (!item.endsWith('.config')) {
        fs.unlinkSync(targetDirectory + item);
    }
});

fse.copy(sourceDirectory, targetDirectory)
    .then(() => console.log('success!'))
    .catch(err => console.error(err));