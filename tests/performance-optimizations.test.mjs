import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = relativePath => fs.readFileSync(path.join(projectRoot, relativePath), "utf8");

test("les images locales disposent de variantes WebP et AVIF responsives", () => {
    for (const width of [480, 960]) {
        assert.equal(fs.existsSync(path.join(projectRoot, "public", "images", "responsive", "optimized", `global-hero-${width}.webp`)), true);
        assert.equal(fs.existsSync(path.join(projectRoot, "public", "images", "responsive", "optimized", `global-hero-${width}.avif`)), true);
    }
    assert.equal(fs.existsSync(path.join(projectRoot, "public", "images", "responsive", "optimized", "global-hero-1600.avif")), true);
    const component = source("src/components/ui/OptimizedImage.tsx");
    assert.match(component, /type="image\/avif"/);
    assert.match(component, /type="image\/webp"/);
});

test("le chatbot complet attend la première interaction", () => {
    const wrapper = source("src/components/ui/ChatBotWrapper.tsx");
    assert.match(wrapper, /if \(isActivated\) return <ChatBot initiallyOpen/);
    assert.match(wrapper, /setIsActivated\(true\)/);
});

test("Netlify Identity est limité aux routes qui l’utilisent", () => {
    const layout = source("src/app/layout.tsx");
    const loader = source("src/components/providers/NetlifyIdentityLoader.tsx");
    assert.doesNotMatch(layout, /identity\.netlify\.com/);
    assert.match(loader, /IDENTITY_ROUTES/);
    assert.match(loader, /invite_token\|confirmation_token\|recovery_token\|access_token/);
});

test("les Core Web Vitals sont envoyés anonymement à GoatCounter", () => {
    const vitals = source("src/components/analytics/WebVitals.tsx");
    assert.match(vitals, /"LCP", "INP", "CLS"/);
    assert.match(vitals, /goatCounter\.count/);
    assert.doesNotMatch(vitals, /metric\.value/);
});

test("des composants purement visuels ne forcent plus une hydratation Framer Motion", () => {
    for (const file of [
        "src/app/blog/BlogClient.tsx",
        "src/app/livret-accueil/page.tsx",
        "src/components/home/FeaturesSection.tsx",
    ]) {
        const content = source(file);
        assert.doesNotMatch(content, /framer-motion/);
        assert.doesNotMatch(content, /^"use client"/);
    }
});
