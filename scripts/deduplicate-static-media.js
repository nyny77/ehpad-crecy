const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const MEDIA_EXTENSIONS = new Set([
    ".gif",
    ".jpeg",
    ".jpg",
    ".mp3",
    ".mp4",
    ".pdf",
    ".png",
    ".webm",
    ".webp",
]);
const TEXT_EXTENSIONS = new Set([
    ".css",
    ".html",
    ".js",
    ".json",
    ".svg",
    ".txt",
    ".webmanifest",
    ".xml",
]);
const REDIRECTS_START = "# BEGIN GENERATED MEDIA DEDUPLICATION";
const REDIRECTS_END = "# END GENERATED MEDIA DEDUPLICATION";

function collectFiles(directory, filter = () => true) {
    if (!fs.existsSync(directory)) return [];

    return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const absolutePath = path.join(directory, entry.name);
        if (entry.isDirectory()) return collectFiles(absolutePath, filter);
        return filter(absolutePath) ? [absolutePath] : [];
    });
}

function hashFile(filePath) {
    return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function publicPath(outputDirectory, filePath) {
    return `/${path.relative(outputDirectory, filePath).split(path.sep).join("/")}`;
}

function urlVariants(urlPath) {
    return [urlPath, encodeURI(urlPath), urlPath.replaceAll("/", "\\/")];
}

function occurrenceCount(text, value) {
    if (!value) return 0;
    return text.split(value).length - 1;
}

function referenceCount(text, urlPath) {
    return urlVariants(urlPath).reduce(
        (total, variant) => total + occurrenceCount(text, variant),
        0
    );
}

function replaceUrl(text, oldPath, newPath) {
    const oldVariants = urlVariants(oldPath);
    const newVariants = urlVariants(newPath);
    return oldVariants.reduce(
        (result, variant, index) => result.replaceAll(variant, newVariants[index]),
        text
    );
}

function updateRedirects(outputDirectory, redirects) {
    if (redirects.length === 0) return;

    const redirectsPath = path.join(outputDirectory, "_redirects");
    const current = fs.existsSync(redirectsPath)
        ? fs.readFileSync(redirectsPath, "utf8")
        : "";
    const generatedPattern = new RegExp(
        `\\n?${REDIRECTS_START}[\\s\\S]*?${REDIRECTS_END}\\n?`,
        "g"
    );
    const preserved = current.replace(generatedPattern, "").trimEnd();
    const rules = redirects
        .sort((left, right) => left.from.localeCompare(right.from))
        .map(({ from, to }) => `${encodeURI(from)} ${encodeURI(to)} 301!`)
        .join("\n");
    const prefix = preserved ? `${preserved}\n\n` : "";

    fs.writeFileSync(
        redirectsPath,
        `${prefix}${REDIRECTS_START}\n${rules}\n${REDIRECTS_END}\n`,
        "utf8"
    );
}

function deduplicateStaticMedia(projectRoot = process.cwd()) {
    const outputDirectory = path.join(projectRoot, "out");
    if (!fs.existsSync(outputDirectory)) {
        throw new Error(`Static export not found: ${outputDirectory}`);
    }

    const textFiles = collectFiles(outputDirectory, (filePath) =>
        TEXT_EXTENSIONS.has(path.extname(filePath).toLowerCase()) &&
        path.basename(filePath) !== "_redirects"
    );
    const textByFile = new Map(
        textFiles.map((filePath) => [filePath, fs.readFileSync(filePath, "utf8")])
    );
    const generatedText = [...textByFile.values()].join("\n");
    const mediaFiles = collectFiles(outputDirectory, (filePath) =>
        MEDIA_EXTENSIONS.has(path.extname(filePath).toLowerCase())
    );
    const groups = new Map();

    for (const filePath of mediaFiles) {
        const key = `${fs.statSync(filePath).size}:${hashFile(filePath)}`;
        const group = groups.get(key) || [];
        group.push(filePath);
        groups.set(key, group);
    }

    let removedBytes = 0;
    let removedFiles = 0;
    let duplicateGroups = 0;
    const redirects = [];

    for (const group of groups.values()) {
        if (group.length < 2) continue;
        duplicateGroups += 1;

        const ranked = group
            .map((filePath) => {
                const urlPath = publicPath(outputDirectory, filePath);
                return {
                    filePath,
                    references: referenceCount(generatedText, urlPath),
                    urlPath,
                };
            })
            .sort((left, right) =>
                right.references - left.references ||
                left.urlPath.length - right.urlPath.length ||
                left.urlPath.localeCompare(right.urlPath)
            );
        const canonical = ranked[0];

        for (const duplicate of ranked.slice(1)) {
            for (const [textFile, content] of textByFile) {
                textByFile.set(
                    textFile,
                    replaceUrl(content, duplicate.urlPath, canonical.urlPath)
                );
            }

            removedBytes += fs.statSync(duplicate.filePath).size;
            fs.unlinkSync(duplicate.filePath);
            removedFiles += 1;
            redirects.push({ from: duplicate.urlPath, to: canonical.urlPath });
        }
    }

    for (const [textFile, originalContent] of textByFile) {
        const currentContent = fs.readFileSync(textFile, "utf8");
        if (originalContent !== currentContent) {
            fs.writeFileSync(textFile, originalContent, "utf8");
        }
    }
    updateRedirects(outputDirectory, redirects);

    return { duplicateGroups, redirects, removedBytes, removedFiles };
}

if (require.main === module) {
    const result = deduplicateStaticMedia();
    console.log("Strict duplicate media removed from the static export:");
    console.log(`- Duplicate groups: ${result.duplicateGroups}`);
    console.log(`- Removed copies: ${result.removedFiles}`);
    console.log(`- Deployment reduction: ${(result.removedBytes / 1024 / 1024).toFixed(1)} MB`);
    console.log(`- Compatibility redirects: ${result.redirects.length}`);
}

module.exports = { deduplicateStaticMedia };
