import { readFileSync, writeFileSync } from "node:fs";

const files = ["dist/index.js", "dist/index.mjs"];
const directive = '"use client";\n';

for (const file of files) {
  const source = readFileSync(file, "utf8");
  if (source.startsWith(directive)) {
    continue;
  }
  writeFileSync(file, `${directive}${source}`);
}
