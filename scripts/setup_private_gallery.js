const fs = require('fs');
const path = require('path');

const sourceDir = path.join(process.cwd(), 'photos');
const targetDir = path.join(process.cwd(), 'public', 'images', 'private');
const dataFile = path.join(process.cwd(), 'src', 'lib', 'data', 'private-gallery.json');

// Ensure target directory exists
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    console.log(`Created directory: ${targetDir}`);
}

// Read source files
if (!fs.existsSync(sourceDir)) {
    console.error(`Source directory not found: ${sourceDir}`);
    process.exit(1);
}

const files = fs.readdirSync(sourceDir).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
});

console.log(`Found ${files.length} images to process.`);

const galleryData = {
    photos: []
};

let copiedCount = 0;

files.forEach((file, index) => {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);

    // Copy file
    try {
        fs.copyFileSync(sourcePath, targetPath);
        copiedCount++;
    } catch (err) {
        console.error(`Error copying ${file}:`, err.message);
    }

    // Add to data
    galleryData.photos.push({
        id: `private-${index}`,
        src: `/images/private/${file}`,
        title: `Photo ${index + 1}`,
        category: 'event', // Default category
        alt: `Photo privée ${index + 1}`
    });
});

// Write JSON data
fs.writeFileSync(dataFile, JSON.stringify(galleryData, null, 2));

console.log(`Successfully copied ${copiedCount} images.`);
console.log(`Generated data file at: ${dataFile}`);
