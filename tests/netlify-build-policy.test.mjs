import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);
const { shouldIgnoreBuild } = require("../scripts/ignore-netlify-build.js");

test("Netlify ignore les changements purement opérationnels", () => {
    assert.equal(shouldIgnoreBuild([
        "src/lib/data/messages.json",
        "src/lib/data/residents.json",
    ]), true);
});

test("Netlify construit dès qu’un contenu public change", () => {
    assert.equal(shouldIgnoreBuild(["src/lib/data/gallery.json"]), false);
    assert.equal(shouldIgnoreBuild([
        "src/lib/data/messages.json",
        "public/images/messages/courrier.webp",
    ]), false);
    assert.equal(shouldIgnoreBuild([
        "src/lib/data/messages.json",
        "content/articles/nouvel-article.md",
    ]), false);
});

test("Netlify ignore un diff vide", () => {
    assert.equal(shouldIgnoreBuild([]), true);
});
