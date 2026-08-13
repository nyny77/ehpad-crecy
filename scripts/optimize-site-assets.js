const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const SOURCE_DIR = path.join(process.cwd(), "public", "images");
const EVENTS_DIR = path.join(process.cwd(), "public", "evenements");
const OUTPUT_DIR = path.join(SOURCE_DIR, "optimized");
const EXCLUDED_DIRS = new Set(["optimized", "private", "thumbnails"]);
const SUPPORTED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png"]);

function collectImages(directory) {
    return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const absolutePath = path.join(directory, entry.name);

        if (entry.isDirectory()) {
            if (directory === SOURCE_DIR && EXCLUDED_DIRS.has(entry.name)) return [];
            return collectImages(absolutePath);
        }

        return SUPPORTED_EXTENSIONS.has(path.extname(entry.name).toLowerCase())
            ? [absolutePath]
            : [];
    });
}

async function optimizeImage(sourcePath, relativePath = path.relative(SOURCE_DIR, sourcePath)) {
    const destinationPath = path.join(
        OUTPUT_DIR,
        relativePath.replace(/\.(jpe?g|png)$/i, ".webp")
    );

    const sourceStats = fs.statSync(sourcePath);
    if (fs.existsSync(destinationPath)) {
        const destinationStats = fs.statSync(destinationPath);
        if (destinationStats.mtimeMs >= sourceStats.mtimeMs && destinationStats.size > 0) {
            return { status: "skipped", sourceBytes: sourceStats.size, outputBytes: destinationStats.size };
        }
    }

    fs.mkdirSync(path.dirname(destinationPath), { recursive: true });

    const fileName = path.basename(sourcePath).toLowerCase();
    const isPanorama = fileName.includes("360") || relativePath.toLowerCase().includes("panorama");
    const isLogo = fileName.startsWith("logo.");
    const maxWidth = isPanorama ? 4096 : isLogo ? 512 : 1600;
    const quality = isPanorama ? 76 : isLogo ? 86 : 80;

    await sharp(sourcePath)
        .rotate()
        .resize({ width: maxWidth, withoutEnlargement: true })
        .webp({ quality, effort: 4, smartSubsample: true })
        .toFile(destinationPath);

    return {
        status: "created",
        sourceBytes: sourceStats.size,
        outputBytes: fs.statSync(destinationPath).size,
    };
}

async function main() {
    if (!fs.existsSync(SOURCE_DIR)) return;

    const images = collectImages(SOURCE_DIR).map((sourcePath) => ({ sourcePath }));
    if (fs.existsSync(EVENTS_DIR)) {
        images.push(
            ...collectImages(EVENTS_DIR).map((sourcePath) => ({
                sourcePath,
                relativePath: path.join("evenements", path.relative(EVENTS_DIR, sourcePath)),
            }))
        );
    }
    let created = 0;
    let skipped = 0;
    let sourceBytes = 0;
    let outputBytes = 0;

    for (const { sourcePath, relativePath } of images) {
        try {
            const result = await optimizeImage(sourcePath, relativePath);
            sourceBytes += result.sourceBytes;
            outputBytes += result.outputBytes;
            if (result.status === "created") created += 1;
            else skipped += 1;
        } catch (error) {
            console.error(`Unable to optimize ${sourcePath}:`, error.message);
        }
    }

    const savedPercent = sourceBytes > 0
        ? Math.round((1 - outputBytes / sourceBytes) * 100)
        : 0;

    console.log("Site image optimization complete:");
    console.log(`- Created: ${created}`);
    console.log(`- Reused: ${skipped}`);
    console.log(`- Estimated size reduction: ${savedPercent}%`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
