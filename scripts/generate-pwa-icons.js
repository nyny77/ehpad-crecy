const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputImagePath = path.join(__dirname, '../public/images/logo.png');
const publicDir = path.join(__dirname, '../public');

async function generateIcons() {
    try {
        if (!fs.existsSync(inputImagePath)) {
            console.error('Error: logo.png not found at', inputImagePath);
            return;
        }

        console.log('Generating PWA icons from logo...');

        // Apple Touch Icon (180x180) - Requires white background for iOS usually, but transparent works if logo is good
        await sharp(inputImagePath)
            .resize(180, 180, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
            .toFile(path.join(publicDir, 'apple-touch-icon.png'));
        console.log('✅ apple-touch-icon.png generated');

        // Android 192x192
        await sharp(inputImagePath)
            .resize(192, 192, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
            .toFile(path.join(publicDir, 'icon-192x192.png'));
        console.log('✅ icon-192x192.png generated');

        // Android 512x512
        await sharp(inputImagePath)
            .resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
            .toFile(path.join(publicDir, 'icon-512x512.png'));
        console.log('✅ icon-512x512.png generated');

        console.log('🎉 All PWA icons generated successfully!');
    } catch (error) {
        console.error('Error generating icons:', error);
    }
}

generateIcons();
