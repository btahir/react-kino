import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "product-launch": "src/product-launch.tsx",
    "case-study": "src/case-study.tsx",
    portfolio: "src/portfolio.tsx",
  },
  format: ["esm", "cjs"],
  dts: true,
  splitting: false,
  treeshake: true,
  clean: true,
  external: ["react", "react-dom", "react-kino"],
  minify: true,
});
