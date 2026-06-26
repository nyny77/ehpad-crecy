const fs = require('fs');
const path = require('path');

const sourceDir = 'C:\\Users\\atoda\\Desktop\\wetransfer_20260624_153314-jpg_2026-06-26_1559';
const destDir = path.join(process.cwd(), 'public', 'images', 'private');
const jsonFile = path.join(process.cwd(), 'src', 'lib', 'data', 'private-gallery.json');

// Make sure destDir exists
if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

// Read JSON
let data = { photos: [] };
if (fs.existsSync(jsonFile)) {
    const rawData = fs.readFileSync(jsonFile, 'utf8');
    data = JSON.parse(rawData);
}

// Read source directory
const files = fs.readdirSync(sourceDir);
let addedCount = 0;

files.forEach(file => {
    if (file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.png')) {
        const sourceFile = path.join(sourceDir, file);
        const destFile = path.join(destDir, file);

        // Copy file
        fs.copyFileSync(sourceFile, destFile);

        // Check if already in JSON
        const srcPath = `/images/private/${file}`;
        const exists = data.photos.some(p => p.src === srcPath);

        if (!exists) {
            data.photos.push({
                id: `private-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                src: srcPath,
                title: `Photo ajoutée ${addedCount + 1}`,
                category: "autre",
                alt: `Nouvelle photo ${file}`
            });
            addedCount++;
        }
    }
});

// Save JSON
fs.writeFileSync(jsonFile, JSON.stringify(data, null, 2), 'utf8');

console.log(`Successfully imported ${addedCount} new photos!`);
