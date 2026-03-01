import { readFileSync, writeFileSync } from "node:fs";

const files = [
  "dist/index.js",
  "dist/index.mjs",
  "dist/product-launch.js",
  "dist/product-launch.mjs",
  "dist/case-study.js",
  "dist/case-study.mjs",
  "dist/portfolio.js",
  "dist/portfolio.mjs",
];
const directive = '"use client";\n';

for (const file of files) {
  const source = readFileSync(file, "utf8");
  if (source.startsWith(directive)) {
    continue;
  }
  writeFileSync(file, `${directive}${source}`);
}
