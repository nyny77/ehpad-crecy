const fs = require('fs');
const path = require('path');

const galleryFile = path.join(process.cwd(), 'src', 'lib', 'data', 'gallery.json');
const visiteFile = path.join(process.cwd(), 'src', 'lib', 'data', 'visite-gallery.json');

const galleryData = JSON.parse(fs.readFileSync(galleryFile, 'utf8'));

// The first 21 photos were the original ones.
const visitePhotos = galleryData.photos.slice(0, 21);
const remainingGalleryPhotos = galleryData.photos.slice(21);

// Write visite-gallery.json
fs.writeFileSync(visiteFile, JSON.stringify({ photos: visitePhotos }, null, 2), 'utf8');

// Update gallery.json
galleryData.photos = remainingGalleryPhotos;
fs.writeFileSync(galleryFile, JSON.stringify(galleryData, null, 2), 'utf8');

console.log(`Moved 21 photos to visite-gallery.json. gallery.json now has ${remainingGalleryPhotos.length} photos.`);
