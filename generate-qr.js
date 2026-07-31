const QRCode = require('qrcode');
const Jimp = require('jimp');
const fs = require('fs');

async function generate() {
    try {
        // 1. Generate standard QR code
        const url = 'https://ehpadcrecy.netlify.app/livret-accueil';
        const qrPath = 'Livret/qr-temp.png';
        const outPath = 'Livret/QR_Code_Livret_Logo.png';
        const logoPath = 'public/images/logo.png';
        
        await QRCode.toFile(qrPath, url, {
            width: 1000,
            margin: 2,
            errorCorrectionLevel: 'H',
            color: {
                dark: '#1C2127',
                light: '#FFFFFF'
            }
        });

        // 2. Read images with Jimp
        const qrImage = await Jimp.read(qrPath);
        const logoImage = await Jimp.read(logoPath);

        // 3. Resize logo (about 25% of the QR code)
        const logoSize = Math.floor(qrImage.bitmap.width * 0.25);
        logoImage.resize(logoSize, Jimp.AUTO);

        // 4. Calculate position (center)
        const x = Math.floor((qrImage.bitmap.width - logoImage.bitmap.width) / 2);
        const y = Math.floor((qrImage.bitmap.height - logoImage.bitmap.height) / 2);

        // 5. Create a white background for the logo to stand out
        const bg = new Jimp(logoImage.bitmap.width + 20, logoImage.bitmap.height + 20, '#FFFFFF');
        
        // 6. Composite everything
        qrImage.composite(bg, x - 10, y - 10);
        qrImage.composite(logoImage, x, y);

        // 7. Save and cleanup
        await qrImage.writeAsync(outPath);
        fs.unlinkSync(qrPath);
        
        console.log('Success! Saved to ' + outPath);
    } catch (err) {
        console.error(err);
    }
}

generate();
