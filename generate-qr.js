const QRCode = require('qrcode');
const sharp = require('sharp');
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

        const qrWidth = (await sharp(qrPath).metadata()).width || 1000;
        const logoSize = Math.floor(qrWidth * 0.25);
        const { data: logo, info } = await sharp(logoPath)
            .resize({ width: logoSize, height: logoSize, fit: 'inside' })
            .png()
            .toBuffer({ resolveWithObject: true });
        const padding = 10;
        const logoPanel = await sharp({
            create: {
                width: info.width + padding * 2,
                height: info.height + padding * 2,
                channels: 4,
                background: '#FFFFFF',
            },
        }).composite([{ input: logo, left: padding, top: padding }]).png().toBuffer();

        await sharp(qrPath)
            .composite([{ input: logoPanel, gravity: 'centre' }])
            .png()
            .toFile(outPath);
        fs.unlinkSync(qrPath);
        
        console.log('Success! Saved to ' + outPath);
    } catch (err) {
        console.error(err);
    }
}

generate();
