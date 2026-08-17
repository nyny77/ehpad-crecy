const fs = require("fs");
const path = require("path");

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png"]);
const TEXT_EXTENSIONS = new Set([
    ".css",
    ".html",
    ".js",
    ".json",
    ".map",
    ".svg",
    ".txt",
    ".webmanifest",
    ".xml",
]);
const EXCLUDED_IMAGE_DIRECTORIES = new Set([
    "gallery",
    "optimized",
    "private",
    "thumbnails",
]);

function collectFiles(directory, filter = () => true) {
    if (!fs.existsSync(directory)) return [];

    return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const absolutePath = path.join(directory, entry.name);
        if (entry.isDirectory()) return collectFiles(absolutePath, filter);
        return filter(absolutePath) ? [absolutePath] : [];
    });
}

function collectGeneratedText(outputDirectory) {
    return collectFiles(outputDirectory, (filePath) =>
        TEXT_EXTENSIONS.has(path.extname(filePath).toLowerCase())
    )
        .map((filePath) => fs.readFileSync(filePath, "utf8"))
        .join("\n");
}

function isReferenced(generatedText, publicPath) {
    const encodedPath = encodeURI(publicPath);
    const escapedPath = publicPath.replaceAll("/", "\\/");
    return (
        generatedText.includes(publicPath) ||
        generatedText.includes(encodedPath) ||
        generatedText.includes(escapedPath)
    );
}

function optimizedCounterpart(publicDirectory, sourcePath) {
    const imagesDirectory = path.join(publicDirectory, "images");
    const eventsDirectory = path.join(publicDirectory, "evenements");
    let relativePath;

    if (sourcePath.startsWith(`${imagesDirectory}${path.sep}`)) {
        relativePath = path.relative(imagesDirectory, sourcePath);
    } else if (sourcePath.startsWith(`${eventsDirectory}${path.sep}`)) {
        relativePath = path.join("evenements", path.relative(eventsDirectory, sourcePath));
    } else {
        return null;
    }

    return path.join(
        imagesDirectory,
        "optimized",
        relativePath.replace(/\.(?:jpe?g|png)$/i, ".webp")
    );
}

function collectCandidates(publicDirectory) {
    const imagesDirectory = path.join(publicDirectory, "images");
    const eventsDirectory = path.join(publicDirectory, "evenements");
    const imageCandidates = collectFiles(imagesDirectory, (filePath) => {
        const relativeParts = path.relative(imagesDirectory, filePath).split(path.sep);
        return (
            IMAGE_EXTENSIONS.has(path.extname(filePath).toLowerCase()) &&
            !EXCLUDED_IMAGE_DIRECTORIES.has(relativeParts[0])
        );
    });
    const eventCandidates = collectFiles(eventsDirectory, (filePath) =>
        IMAGE_EXTENSIONS.has(path.extname(filePath).toLowerCase())
    );

    return [...imageCandidates, ...eventCandidates];
}

function pruneUnusedImageOriginals(projectRoot = process.cwd()) {
    const publicDirectory = path.join(projectRoot, "public");
    const outputDirectory = path.join(projectRoot, "out");

    if (!fs.existsSync(outputDirectory)) {
        throw new Error(`Static export not found: ${outputDirectory}`);
    }

    const generatedText = collectGeneratedText(outputDirectory);
    let removedFiles = 0;
    let removedBytes = 0;
    let keptReferenced = 0;

    for (const sourcePath of collectCandidates(publicDirectory)) {
        const counterpart = optimizedCounterpart(publicDirectory, sourcePath);
        if (!counterpart || !fs.existsSync(counterpart)) continue;

        const relativePath = path.relative(publicDirectory, sourcePath);
        const publicPath = `/${relativePath.split(path.sep).join("/")}`;
        if (isReferenced(generatedText, publicPath)) {
            keptReferenced += 1;
            continue;
        }

        const exportedOriginal = path.join(outputDirectory, relativePath);
        if (!fs.existsSync(exportedOriginal)) continue;

        removedBytes += fs.statSync(exportedOriginal).size;
        fs.unlinkSync(exportedOriginal);
        removedFiles += 1;
    }

    return { keptReferenced, removedBytes, removedFiles };
}

if (require.main === module) {
    const result = pruneUnusedImageOriginals();
    console.log("Unused image originals pruned from the static export:");
    console.log(`- Removed: ${result.removedFiles}`);
    console.log(`- Preserved because referenced: ${result.keptReferenced}`);
    console.log(`- Deployment reduction: ${(result.removedBytes / 1024 / 1024).toFixed(1)} MB`);
}

module.exports = { pruneUnusedImageOriginals };
