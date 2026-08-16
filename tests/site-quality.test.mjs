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
});

test("la date tarifaire publique correspond à avril 2026", () => {
  assert.match(source("src/lib/pricing-data.ts"), /PRICING_DATE = "Avril 2026"/);
});
