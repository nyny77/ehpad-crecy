const fs = require('fs');
const path = require('path');

const publicFile = path.join(process.cwd(), 'src', 'lib', 'data', 'gallery.json');
const privateFile = path.join(process.cwd(), 'src', 'lib', 'data', 'private-gallery.json');

const publicData = JSON.parse(fs.readFileSync(publicFile, 'utf8'));
const privateData = JSON.parse(fs.readFileSync(privateFile, 'utf8'));

// We want to combine them. We will append private photos to public photos.
publicData.photos = [...publicData.photos, ...privateData.photos];

fs.writeFileSync(publicFile, JSON.stringify(publicData, null, 2), 'utf8');

// We can now delete private-gallery.json
fs.unlinkSync(privateFile);

console.log(`Merged ${privateData.photos.length} photos into gallery.json and deleted private-gallery.json.`);
