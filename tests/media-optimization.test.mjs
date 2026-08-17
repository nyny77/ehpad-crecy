import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const originalVideo = path.join(projectRoot, "public", "videos", "balade-crecy.mp4");
const mobileVideo = path.join(projectRoot, "public", "videos", "balade-crecy-mobile.mp4");

test("la version mobile de la video est disponible et sensiblement plus legere", () => {
    assert.equal(fs.existsSync(originalVideo), true);
    assert.equal(fs.existsSync(mobileVideo), true);

    const originalBytes = fs.statSync(originalVideo).size;
    const mobileBytes = fs.statSync(mobileVideo).size;
    assert.ok(mobileBytes < originalBytes * 0.7);
});

test("les lecteurs utilisent la version mobile adaptee", () => {
    const lazyVideo = fs.readFileSync(
        path.join(projectRoot, "src", "components", "ui", "LazyVideo.tsx"),
        "utf8"
    );
    const eventWidget = fs.readFileSync(
        path.join(projectRoot, "src", "components", "home", "EventWidget.tsx"),
        "utf8"
    );
    const historyPage = fs.readFileSync(
        path.join(projectRoot, "src", "app", "histoire", "page.tsx"),
        "utf8"
    );

    assert.match(lazyVideo, /media="\(max-width: 767px\)"/);
    assert.match(eventWidget, /balade-crecy-mobile\.mp4/);
    assert.match(historyPage, /mobileSrc="\/videos\/balade-crecy-mobile\.mp4"/);
});
