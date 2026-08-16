import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const APP_DIR = join(ROOT, "src", "app");

function walk(directory, extensions) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return walk(path, extensions);
    return extensions.some((extension) => entry.name.endsWith(extension)) ? [path] : [];
  });
}

function source(path) {
  return readFileSync(join(ROOT, path), "utf8");
}

test("les ressources indispensables à la PWA et au SEO existent", () => {
  [
    "public/manifest.json",
    "public/offline.html",
    "public/sw.js",
    "src/app/robots.ts",
    "src/app/sitemap.ts",
  ].forEach((path) => assert.ok(existsSync(join(ROOT, path)), `${path} est manquant`));
});

test("les liens internes littéraux pointent vers une route existante", () => {
  const pageFiles = walk(APP_DIR, ["page.tsx"]);
  const routePatterns = pageFiles.map((file) => {
    const route = `/${relative(APP_DIR, dirname(file)).replaceAll("\\", "/")}`.replace(/\/$/, "");
    const pattern = route === "" ? "/" : route;
    return new RegExp(`^${pattern.replace(/\[[^/]+\]/g, "[^/]+")}$`);
  });

  const sourceFiles = walk(join(ROOT, "src"), [".ts", ".tsx"]);
  const links = new Set();
  const expression = /(?:href|url)\s*(?:=|:)\s*["'](\/[^"']+)["']/g;

  sourceFiles.forEach((file) => {
    const content = readFileSync(file, "utf8");
    for (const match of content.matchAll(expression)) links.add(match[1]);
  });

  const invalid = [...links].filter((link) => {
    if (link.startsWith("/.netlify/") || link.startsWith("/images/") || link.startsWith("/documents/") || link.startsWith("/icon-") || link === "/apple-touch-icon.png") return false;
    const route = link.split(/[?#]/)[0] || "/";
    return !routePatterns.some((pattern) => pattern.test(route));
  });

  assert.deepEqual(invalid, [], `Liens sans route : ${invalid.join(", ")}`);
});

test("les anciens liens et coordonnées erronés ne réapparaissent pas", () => {
  const files = [
    "src/lib/chatbot-data.ts",
    "netlify/functions/send-notification.ts",
    "netlify/functions/admin-approve-user.ts",
  ];
  const combined = files.map(source).join("\n");
  assert.ok(!combined.includes('url: "/tarifs"'), "Le lien /tarifs doit cibler /admissions#tarifs");
  assert.ok(!combined.includes("/vie-sociale"), "La route /vie-sociale n’existe plus");
  assert.ok(!combined.includes("01.64.63.80.80"), "Un ancien numéro de téléphone subsiste");
});

test("les fondations d’accessibilité restent présentes", () => {
  assert.match(source("src/app/layout.tsx"), /href="#contenu-principal"/);
  assert.match(source("src/app/layout.tsx"), /id="contenu-principal"/);
  assert.match(source("src/app/accessibilite/page.tsx"), /<h1/);
  assert.match(source("src/components/layout/Header.tsx"), /aria-expanded=/);
  assert.match(source("src/components/ui/ChatBot.tsx"), /role="dialog"/);
  assert.match(source("src/components/admissions/PricingSection.tsx"), /aria-pressed=/);
  assert.match(source("src/components/admissions/PricingSection.tsx"), /aria-live="polite"/);
  assert.match(source("src/components/admissions/AdmissionFAQ.tsx"), /aria-expanded=/);
  assert.match(source("src/app/familles/page.tsx"), /htmlFor="sender-name"/);
  assert.match(source("src/app/familles/page.tsx"), /aria-controls="camera-photo-input"/);
  assert.match(source("src/components/contact/ConversationalForm.tsx"), /htmlFor="contact-email"/);
  assert.match(source("src/components/contact/ConversationalForm.tsx"), /stepHeadingRef\.current\?\.focus/);
  assert.match(source("src/components/ui/LazyVideo.tsx"), /aria-label=\{`Lire la vidéo/);
  assert.match(source("src/components/auth/SignupModal.tsx"), /type="checkbox"/);
  assert.match(source("src/components/auth/SignupModal.tsx"), /aria-modal="true"/);
  assert.ok(existsSync(join(ROOT, "public/videos/balade-crecy.fr.vtt")));
  assert.match(source("src/components/ui/LazyVideo.tsx"), /kind="captions"/);
  assert.ok(existsSync(join(ROOT, "src/app/echo-du-coeur/janvier-2026/page.tsx")));
  assert.match(source("src/lib/data/gazette.json"), /"accessibleUrl": "\/echo-du-coeur\/janvier-2026"/);
  assert.match(source("src/app/administration/PhotoManager.tsx"), /isUsefulAlt/);
  assert.match(source("src/app/galerie/page.tsx"), /accessibleDescription/);
  assert.match(source("src/app/galerie/page.tsx"), /Agrandir la photo \$\{position\} sur \$\{total\}/);
  assert.doesNotMatch(source("src/app/globals.css"), /html\s*\{\s*font-size:\s*(?:14|15)px/);
  assert.match(source("src/app/globals.css"), /--color-terracotta-dark:\s*#9E0033/);
  assert.match(source("src/components/layout/Footer.tsx"), /Accessibilité : partiellement conforme — 95,2 %/);
  assert.match(source("src/app/accessibilite/page.tsx"), /partiellement conforme au RGAA 4\.1\.2/);
  assert.match(source("src/app/accessibilite/page.tsx"), /95,2 %/);
  assert.ok(existsSync(join(ROOT, "src/app/accessibilite/rapport-audit-2026/page.tsx")));
  assert.ok(existsSync(join(ROOT, "src/app/accessibilite/schema-pluriannuel/page.tsx")));
  assert.ok(existsSync(join(ROOT, "src/app/accessibilite/plan-annuel-2026/page.tsx")));
});

test("les appels à l’action ne contiennent pas d’éléments interactifs imbriqués", () => {
  const combined = walk(join(ROOT, "src"), [".tsx"])
    .map((file) => readFileSync(file, "utf8"))
    .join("\n");
  assert.doesNotMatch(combined, /<Link\b[\s\S]{0,500}<(?:(?:motion\.)?button)\b/);
  assert.doesNotMatch(combined, /<a\b[\s\S]{0,500}<(?:(?:motion\.)?button)\b/);
});

test("la date tarifaire publique correspond à avril 2026", () => {
  assert.match(source("src/lib/pricing-data.ts"), /PRICING_DATE = "Avril 2026"/);
});
