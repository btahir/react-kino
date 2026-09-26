import { readFileSync, writeFileSync } from "node:fs";

const files = ["index", "story", "studio", "recipe-kit"].flatMap((name) => [
  `dist/${name}.js`,
  `dist/${name}.mjs`,
]);
const directive = '"use client";\n';

for (const file of files) {
  const source = readFileSync(file, "utf8");
  if (source.startsWith(directive)) {
    continue;
  }
  writeFileSync(file, `${directive}${source}`);
}
