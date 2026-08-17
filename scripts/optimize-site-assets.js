const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const SOURCE_DIR = path.join(process.cwd(), "public", "images");
const EVENTS_DIR = path.join(process.cwd(), "public", "evenements");
const OUTPUT_DIR = path.join(SOURCE_DIR, "optimized");
const EXCLUDED_DIRS = new Set(["optimized", "private", "thumbnails"]);
const SUPPORTED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png"]);
const PANORAMA_SOURCE = path.join(SOURCE_DIR, "jardin-360.jpg");
const PANORAMA_PREVIEW = path.join(OUTPUT_DIR, "jardin-360-preview.webp");
const RESPONSIVE_DIR = path.join(SOURCE_DIR, "responsive");
const RESPONSIVE_WIDTHS = [480, 960, 1600];

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

async function generatePanoramaPreview() {
    if (!fs.existsSync(PANORAMA_SOURCE)) return "missing";

    const sourceStats = fs.statSync(PANORAMA_SOURCE);
    if (fs.existsSync(PANORAMA_PREVIEW)) {
        const previewStats = fs.statSync(PANORAMA_PREVIEW);
        if (previewStats.mtimeMs >= sourceStats.mtimeMs && previewStats.size > 0) {
            return "skipped";
        }
    }

    await sharp(PANORAMA_SOURCE)
        .rotate()
        .resize({ width: 1024, withoutEnlargement: true })
        .webp({ quality: 65, effort: 4, smartSubsample: true })
        .toFile(PANORAMA_PREVIEW);
    return "created";
}

function collectResponsiveSources(directory = SOURCE_DIR) {
    if (!fs.existsSync(directory)) return [];

    return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const absolutePath = path.join(directory, entry.name);
        const relativeParts = path.relative(SOURCE_DIR, absolutePath).split(path.sep);

        if (entry.isDirectory()) {
            if (["private", "messages", "responsive", "thumbnails"].includes(entry.name)) return [];
            return collectResponsiveSources(absolutePath);
        }

        const isWebp = path.extname(entry.name).toLowerCase() === ".webp";
        const isExcluded = relativeParts.includes("thumbnails") || /(?:360|panorama-preview)/i.test(entry.name);
        return isWebp && !isExcluded ? [absolutePath] : [];
    });
}

async function generateResponsiveImages() {
    let created = 0;
    let removed = 0;
    let skipped = 0;
    const expectedFiles = new Set();

    for (const sourcePath of collectResponsiveSources()) {
        const relativeBase = path.relative(SOURCE_DIR, sourcePath).replace(/\.webp$/i, "");
        const sourceStats = fs.statSync(sourcePath);

        for (const width of RESPONSIVE_WIDTHS) {
            for (const format of ["webp", "avif"]) {
                if (format === "webp" && width === 1600) continue;
                const destinationPath = path.join(RESPONSIVE_DIR, `${relativeBase}-${width}.${format}`);
                expectedFiles.add(path.resolve(destinationPath));
                if (fs.existsSync(destinationPath)) {
                    const destinationStats = fs.statSync(destinationPath);
                    if (destinationStats.mtimeMs >= sourceStats.mtimeMs && destinationStats.size > 0) {
                        skipped += 1;
                        continue;
                    }
                }

                fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
                let pipeline = sharp(sourcePath)
                    .resize({ width, withoutEnlargement: true });
                pipeline = format === "avif"
                    ? pipeline.avif({ quality: 52, effort: 2 })
                    : pipeline.webp({ quality: 78, effort: 3, smartSubsample: true });
                await pipeline.toFile(destinationPath);
                created += 1;
            }
        }
    }

    for (const generatedFile of collectGeneratedResponsiveFiles()) {
        if (!expectedFiles.has(path.resolve(generatedFile))) {
            fs.unlinkSync(generatedFile);
            removed += 1;
        }
    }

    return { created, removed, skipped };
}

function collectGeneratedResponsiveFiles(directory = RESPONSIVE_DIR) {
    if (!fs.existsSync(directory)) return [];
    return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
        const absolutePath = path.join(directory, entry.name);
        return entry.isDirectory() ? collectGeneratedResponsiveFiles(absolutePath) : [absolutePath];
    });
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

    const panoramaPreviewStatus = await generatePanoramaPreview();
    const responsiveImages = await generateResponsiveImages();

    const savedPercent = sourceBytes > 0
        ? Math.round((1 - outputBytes / sourceBytes) * 100)
        : 0;

    console.log("Site image optimization complete:");
    console.log(`- Created: ${created}`);
    console.log(`- Reused: ${skipped}`);
    console.log(`- Estimated size reduction: ${savedPercent}%`);
    console.log(`- Panorama preview: ${panoramaPreviewStatus}`);
    console.log(`- Responsive variants created: ${responsiveImages.created}`);
    console.log(`- Responsive variants reused: ${responsiveImages.skipped}`);
    console.log(`- Obsolete responsive variants removed: ${responsiveImages.removed}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
