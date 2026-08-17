import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { pruneUnusedImageOriginals } = require("../scripts/prune-unused-image-originals.js");

function writeFile(root, relativePath, content = "image") {
    const filePath = path.join(root, relativePath);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content);
}

test("retire seulement les originaux inutilises qui possedent une variante optimisee", (t) => {
    const projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ehpad-prune-images-"));
    t.after(() => fs.rmSync(projectRoot, { recursive: true, force: true }));

    writeFile(projectRoot, "public/images/unused.png", "unused-original");
    writeFile(projectRoot, "public/images/used.jpg", "used-original");
    writeFile(projectRoot, "public/images/no-variant.png", "no-variant");
    writeFile(projectRoot, "public/images/optimized/unused.webp");
    writeFile(projectRoot, "public/images/optimized/used.webp");
    writeFile(projectRoot, "out/images/unused.png", "unused-original");
    writeFile(projectRoot, "out/images/used.jpg", "used-original");
    writeFile(projectRoot, "out/images/no-variant.png", "no-variant");
    writeFile(projectRoot, "out/index.html", '<img src="/images/used.jpg">');

    const result = pruneUnusedImageOriginals(projectRoot);

    assert.equal(result.removedFiles, 1);
    assert.equal(result.keptReferenced, 1);
    assert.equal(fs.existsSync(path.join(projectRoot, "out/images/unused.png")), false);
    assert.equal(fs.existsSync(path.join(projectRoot, "public/images/unused.png")), true);
    assert.equal(fs.existsSync(path.join(projectRoot, "out/images/used.jpg")), true);
    assert.equal(fs.existsSync(path.join(projectRoot, "out/images/no-variant.png")), true);
});

test("reconnait une URL encodee dans les fichiers generes", (t) => {
    const projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ehpad-prune-images-"));
    t.after(() => fs.rmSync(projectRoot, { recursive: true, force: true }));

    writeFile(projectRoot, "public/images/photo ete.png");
    writeFile(projectRoot, "public/images/optimized/photo ete.webp");
    writeFile(projectRoot, "out/images/photo ete.png");
    writeFile(projectRoot, "out/app.js", 'const photo = "/images/photo%20ete.png";');

    const result = pruneUnusedImageOriginals(projectRoot);

    assert.equal(result.removedFiles, 0);
    assert.equal(result.keptReferenced, 1);
    assert.equal(fs.existsSync(path.join(projectRoot, "out/images/photo ete.png")), true);
});
