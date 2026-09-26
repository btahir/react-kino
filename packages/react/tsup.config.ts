import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/document.ts",
    "src/story.tsx",
    "src/recipes.ts",
    "src/recipe-kit.tsx",
    "src/studio.tsx",
  ],
  format: ["esm", "cjs"],
  dts: true,
  splitting: true,
  treeshake: true,
  clean: true,
  external: ["react", "react-dom"],
  minify: true,
  sourcemap: true,
});
