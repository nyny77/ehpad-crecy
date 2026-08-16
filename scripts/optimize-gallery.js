const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');

const JSON_FILE_PATH = path.join(process.cwd(), 'src', 'lib', 'data', 'gallery.json');
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const THUMBNAILS_DIR = path.join(PUBLIC_DIR, 'images', 'thumbnails');

// Ensure thumbnails directory exists
if (!fs.existsSync(THUMBNAILS_DIR)) {
    fs.mkdirSync(THUMBNAILS_DIR, { recursive: true });
}

async function optimizeGallery() {
    console.log("Starting gallery optimization...");

    if (!fs.existsSync(JSON_FILE_PATH)) {
        console.error(`Gallery JSON not found at ${JSON_FILE_PATH}`);
        process.exit(1);
    }

    const rawData = fs.readFileSync(JSON_FILE_PATH, 'utf8');
    const data = JSON.parse(rawData);

    let processedCount = 0;
    let createdCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < data.photos.length; i++) {
        const photo = data.photos[i];
        
        // Skip external images or already processed ones
        if (!photo.src.startsWith('/images/')) {
            continue;
        }

        const fileName = path.basename(photo.src);
        const originalPath = path.join(PUBLIC_DIR, photo.src);
        
        // Les nouveaux albums possèdent déjà leur miniature dans leur propre
        // dossier. Ne pas la remplacer par l'ancien chemin global au build.
        const thumbRelativePath = photo.albumId
            ? `/images/gallery/${photo.albumId}/thumbnails/${fileName}`
            : (photo.thumbSrc || `/images/thumbnails/${fileName}`);
        const thumbAbsolutePath = path.join(PUBLIC_DIR, thumbRelativePath);

        // Add thumbSrc to JSON if it doesn't exist yet
        if (photo.thumbSrc !== thumbRelativePath) {
            photo.thumbSrc = thumbRelativePath;
        }

        if (fs.existsSync(thumbAbsolutePath)) {
            skippedCount++;
        } else {
            if (fs.existsSync(originalPath)) {
                try {
                    console.log(`Processing ${fileName}...`);
                    const image = await Jimp.read(originalPath);
                    // Resize to 600px width (auto height) and 80% quality
                    await image
                        .resize(600, Jimp.AUTO)
                        .quality(80)
                        .writeAsync(thumbAbsolutePath);
                    createdCount++;
                } catch (error) {
                    console.error(`Error processing ${originalPath}:`, error);
                }
            } else {
                console.warn(`Original file not found: ${originalPath}`);
            }
        }
        processedCount++;
    }

    // Save updated JSON
    fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(data, null, 2), 'utf8');

    console.log("\nOptimization Summary:");
    console.log(`- Total Photos Processed: ${processedCount}`);
    console.log(`- New Thumbnails Created: ${createdCount}`);
    console.log(`- Skipped (already exist): ${skippedCount}`);
    console.log("- JSON file updated successfully.");
}

optimizeGallery().catch(console.error);
