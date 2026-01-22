const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const output = fs.createWriteStream('ehpad-crecy-site.zip');
const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
});

output.on('close', function () {
    console.log(archive.pointer() + ' total bytes');
    console.log('Archiver has been finalized and the output file descriptor has closed.');
});

archive.on('error', function (err) {
    throw err;
});

archive.pipe(output);

// Append files from an input directory, putting its contents at the root of archive
archive.directory('out/', false);

archive.finalize();
