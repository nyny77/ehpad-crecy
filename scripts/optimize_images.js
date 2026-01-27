const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, '..', 'photos');
const outputDir = path.join(inputDir, 'optimized');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function optimizeImages() {
    console.log('Starting image optimization...');

    try {
        const files = fs.readdirSync(inputDir);
        let count = 0;

        for (const file of files) {
            const ext = path.extname(file).toLowerCase();
            // Basic filtering for image extensions
            if (!['.jpg', '.jpeg', '.png', '.webp', '.heic'].includes(ext)) {
                continue;
            }

            const inputPath = path.join(inputDir, file);
            // Change extension to .jpg for all outputs
            const outputFilename = path.basename(file, ext) + '.jpg';
            const outputPath = path.join(outputDir, outputFilename);

            console.log(`Optimizing: ${file}`);

            try {
                await sharp(inputPath)
                    .resize(1920, 1920, {
                        fit: 'inside',
                        withoutEnlargement: true
                    })
                    .jpeg({
                        quality: 80,
                        mozjpeg: true
                    })
                    .toFile(outputPath);

                count++;
                console.log(`✓ Saved to: ${outputFilename}`);
            } catch (err) {
                console.error(`❌ Error optimizing ${file}:`, err.message);
            }
        }

        console.log(`\nTransformation complete. ${count} images optimized.`);

    } catch (err) {
        console.error('Fatal error:', err);
    }
}

optimizeImages();
