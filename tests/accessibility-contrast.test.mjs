import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

function luminance(hex) {
  const channels = [1, 3, 5]
    .map((index) => Number.parseInt(hex.slice(index, index + 2), 16) / 255)
    .map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(first, second) {
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

test("les couleurs de texte principales atteignent 4,5:1 sur le fond clair", () => {
  const cream = "#FDF7F0";
  ["#E00048", "#C80040", "#9E0033", "#497A62", "#3F6C56", "#345C49", "#696978", "#595966", "#484853"]
    .forEach((color) => assert.ok(contrast(color, cream) >= 4.5, `${color} est insuffisant sur ${cream}`));
});

test("les bordures de champs atteignent 3:1 dans les deux modes", () => {
  assert.ok(contrast("#757585", "#FFFFFF") >= 3);
  assert.ok(contrast("#9696A6", "#2C2C33") >= 3);
});

test("le focus global possède un double contraste et les champs une bordure forcée", () => {
  const css = readFileSync(join(ROOT, "src", "app", "globals.css"), "utf8");
  assert.match(css, /:focus-visible\s*\{/);
  assert.match(css, /outline: 3px solid #C80040 !important/);
  assert.match(css, /box-shadow: 0 0 0 6px #FFFFFF !important/);
  assert.match(css, /border-color: #757585 !important/);
  assert.match(css, /border-color: #9696A6 !important/);
});
