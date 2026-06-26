const fs = require('fs');

const localData = JSON.parse(fs.readFileSync('src/lib/data/gallery.json.bak', 'utf8'));

// The conflict file has markers, so we read the remote file from git using execSync
const { execSync } = require('child_process');
const remoteFileContent = execSync('git show HEAD:src/lib/data/gallery.json').toString();
const remoteData = JSON.parse(remoteFileContent);

// The remote data has original photos + any new CMS photos
// My local data has my 104 merged photos. 
// I just need to find photos in remoteData that are NOT in localData.
const localIds = new Set(localData.photos.map(p => p.id));
const newRemotePhotos = remoteData.photos.filter(p => !localIds.has(p.id));

// Combine them. Let's put the new remote photos at the end of the array (since we reverse it on the frontend)
localData.photos = [...localData.photos, ...newRemotePhotos];

fs.writeFileSync('src/lib/data/gallery.json', JSON.stringify(localData, null, 2), 'utf8');

console.log(`Resolved conflict. Added ${newRemotePhotos.length} new photos from remote.`);
