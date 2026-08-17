const fs = require("fs");
const path = require("path");

const projectRoot = process.cwd();
const outputDirectory = path.join(projectRoot, "out");
const budget = JSON.parse(
    fs.readFileSync(path.join(projectRoot, "performance-budget.json"), "utf8")
);

function collectFiles(directory, extension) {
    if (!fs.existsSync(directory)) return [];
    return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
        const absolutePath = path.join(directory, entry.name);
        if (entry.isDirectory()) return collectFiles(absolutePath, extension);
        return !extension || path.extname(entry.name) === extension ? [absolutePath] : [];
    });
}

function totalBytes(files) {
    return files.reduce((total, filePath) => total + fs.statSync(filePath).size, 0);
}

function format(bytes) {
    return `${(bytes / 1024).toFixed(1)} Ko`;
}

function check(label, actual, maximum, failures) {
    const passed = actual <= maximum;
    console.log(`${passed ? "PASS" : "FAIL"} ${label}: ${format(actual)} / ${format(maximum)}`);
    if (!passed) failures.push(`${label}: ${actual} > ${maximum}`);
}

if (!fs.existsSync(outputDirectory)) {
    throw new Error("Le dossier out est absent. Exécutez npm run build avant le budget.");
}

const jsFiles = collectFiles(path.join(outputDirectory, "_next", "static"), ".js");
const cssFiles = collectFiles(path.join(outputDirectory, "_next", "static"), ".css");
const allFiles = collectFiles(outputDirectory);
const failures = [];

check("Export statique", totalBytes(allFiles), budget.maxStaticExportBytes, failures);
check("JavaScript total", totalBytes(jsFiles), budget.maxTotalJavaScriptBytes, failures);
check(
    "Plus gros fragment JavaScript",
    Math.max(0, ...jsFiles.map(filePath => fs.statSync(filePath).size)),
    budget.maxJavaScriptChunkBytes,
    failures
);
check("CSS total", totalBytes(cssFiles), budget.maxTotalCssBytes, failures);
check(
    "Vidéo mobile",
    fs.statSync(path.join(outputDirectory, "videos", "balade-crecy-mobile.mp4")).size,
    budget.maxMobileVideoBytes,
    failures
);
check(
    "Aperçu du panorama",
    fs.statSync(path.join(outputDirectory, "images", "optimized", "jardin-360-preview.webp")).size,
    budget.maxPanoramaPreviewBytes,
    failures
);

if (failures.length > 0) {
    console.error("Budget de performance dépassé :\n- " + failures.join("\n- "));
    process.exit(1);
}
