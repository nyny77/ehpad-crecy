import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { deduplicateStaticMedia } = require("../scripts/deduplicate-static-media.js");

function writeFile(root, relativePath, content) {
    const filePath = path.join(root, relativePath);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content);
}

test("conserve une copie, reecrit les references et maintient les anciennes URL", (t) => {
    const projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ehpad-deduplicate-"));
    t.after(() => fs.rmSync(projectRoot, { recursive: true, force: true }));

    writeFile(projectRoot, "out/images/canonical.png", "same-image");
    writeFile(projectRoot, "out/images/copy one.png", "same-image");
    writeFile(projectRoot, "out/images/unique.png", "unique-image");
    writeFile(
        projectRoot,
        "out/index.html",
        '<img src="/images/canonical.png"><img src="/images/copy%20one.png">'
    );
    writeFile(projectRoot, "out/_redirects", "/ancienne /nouvelle 301\n");

    const result = deduplicateStaticMedia(projectRoot);
    const html = fs.readFileSync(path.join(projectRoot, "out/index.html"), "utf8");
    const redirects = fs.readFileSync(path.join(projectRoot, "out/_redirects"), "utf8");

    assert.equal(result.duplicateGroups, 1);
    assert.equal(result.removedFiles, 1);
    assert.equal(fs.existsSync(path.join(projectRoot, "out/images/canonical.png")), true);
    assert.equal(fs.existsSync(path.join(projectRoot, "out/images/copy one.png")), false);
    assert.match(html, /\/images\/canonical\.png/g);
    assert.doesNotMatch(html, /copy%20one/);
    assert.match(redirects, /\/ancienne \/nouvelle 301/);
    assert.match(redirects, /\/images\/copy%20one\.png \/images\/canonical\.png 301!/);
    assert.equal(fs.existsSync(path.join(projectRoot, "out/images/unique.png")), true);
});

test("choisit comme canonique le chemin le plus reference", (t) => {
    const projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ehpad-deduplicate-"));
    t.after(() => fs.rmSync(projectRoot, { recursive: true, force: true }));

    writeFile(projectRoot, "out/a.png", "same-image");
    writeFile(projectRoot, "out/longer-name.png", "same-image");
    writeFile(
        projectRoot,
        "out/app.js",
        'const first = "/longer-name.png"; const second = "/longer-name.png";'
    );

    deduplicateStaticMedia(projectRoot);

    assert.equal(fs.existsSync(path.join(projectRoot, "out/a.png")), false);
    assert.equal(fs.existsSync(path.join(projectRoot, "out/longer-name.png")), true);
});
