import {
  mkdtemp,
  readFile,
  writeFile,
  mkdir,
  readdir,
  rm,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";
import assert from "node:assert/strict";
import { createServer } from "node:net";
import { gzipSync } from "node:zlib";
import { chromium } from "@playwright/test";
const repo = process.cwd();
const base = await mkdtemp(path.join(tmpdir(), "kino-packed-"));
function run(command, args, cwd = base) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
    maxBuffer: 10_000_000,
  });
  if (result.status !== 0)
    throw new Error(
      `${command} ${args.join(" ")} failed\n${result.stdout}\n${result.stderr}`,
    );
  return result.stdout;
}
try {
  const packs = path.join(base, "packs");
  await mkdir(packs);
  for (const folder of ["core", "react", "templates", "cli"])
    run(
      "pnpm",
      ["pack", "--pack-destination", packs],
      path.join(repo, "packages", folder),
    );
  const tarballs = (await readdir(packs))
    .filter((p) => p.endsWith(".tgz"))
    .map((p) => path.join(packs, p));
  assert.equal(tarballs.length, 4);
  for (const archive of tarballs) {
    const listing = run("tar", ["-tzf", archive]);
    for (const name of ["README.md", "LICENSE", "CHANGELOG.md"])
      assert.ok(
        listing.includes("package/" + name),
        `${archive} missing ${name}`,
      );
    if (path.basename(archive).startsWith("react-kino-0")) {
      assert.ok(listing.includes("package/schema/story-v1.json"));
      assert.ok(listing.includes("package/skills/kino/SKILL.md"));
    }
  }
  await writeFile(
    path.join(base, "package.json"),
    JSON.stringify({
      private: true,
      type: "module",
      scripts: { build: "next build" },
      dependencies: { react: "19.2.4", "react-dom": "19.2.4", next: "15.5.12" },
      devDependencies: {
        typescript: "^5",
        "@types/react": "^19",
        "@types/react-dom": "^19",
        "@types/node": "^22",
        vite: "^6",
      },
    }),
  );
  run("npm", ["install", "--no-audit", "--no-fund", ...tarballs]);
  await writeFile(
    path.join(base, "check.mjs"),
    `import assert from 'node:assert/strict';import {createRequire} from 'node:module';import {readFileSync} from 'node:fs';import React from 'react';import {renderToString} from 'react-dom/server';import {Story} from 'react-kino/story';import {Storyboard} from 'react-kino/studio';import {createStoryRecipe} from 'react-kino/recipes';import {parseStory,serializeStory} from 'react-kino/document';import {createRecipeComponents} from 'react-kino/recipe-kit';const require=createRequire(import.meta.url);for(const id of ['react-kino','react-kino/story','react-kino/studio','react-kino/recipe-kit','react-kino/document','react-kino/recipes','@react-kino/core','@react-kino/core/document','@react-kino/templates']){assert.ok(Object.keys(require(id)).length);const source=readFileSync(require.resolve(id),'utf8');if(/document|recipes|core/.test(id))assert.ok(!source.startsWith('"use client"'));else assert.ok(source.startsWith('"use client"'));}const story=parseStory(serializeStory(createStoryRecipe()));assert.ok(renderToString(React.createElement(Story,{document:story,components:createRecipeComponents()})).includes('Less noise'));assert.ok(renderToString(React.createElement(Storyboard)).includes('Storyboard'));`,
  );
  run("node", ["check.mjs"]);
  console.log(
    "Packed ESM/CommonJS imports, pure/client boundaries, shipped files, SSR: passed.",
  );
  await mkdir(path.join(base, "app"));
  await writeFile(
    path.join(base, "app/layout.tsx"),
    `import React from 'react';export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}`,
  );
  await writeFile(
    path.join(base, "app/page.tsx"),
    `import {Story} from 'react-kino/story';import {Storyboard} from 'react-kino/studio';import {createStoryRecipe} from 'react-kino/recipes';import {validateStory} from 'react-kino/document';export default function Page(){const story=createStoryRecipe();if(!validateStory(story).valid)throw Error('invalid');return <main><Story document={story}/><Storyboard initialDocument={story}/></main>}`,
  );
  await writeFile(
    path.join(base, "tsconfig.json"),
    JSON.stringify({
      compilerOptions: {
        target: "ES2020",
        lib: ["dom", "es2020"],
        strict: true,
        module: "esnext",
        moduleResolution: "bundler",
        jsx: "preserve",
        esModuleInterop: true,
        skipLibCheck: true,
        noEmit: true,
      },
      include: ["app/**/*.tsx", ".next/types/**/*.ts"],
    }),
  );
  await writeFile(
    path.join(base, "next.config.mjs"),
    `export default {experimental:{cpus:2}};`,
  );
  run("npm", ["run", "build"]);
  console.log(
    "Packed Next App Router production build and declaration resolution: passed.",
  );
  const portFinder = createServer();
  await new Promise((resolve) => portFinder.listen(0, "127.0.0.1", resolve));
  const port = portFinder.address().port;
  await new Promise((resolve) => portFinder.close(resolve));
  const server = spawn(
    process.execPath,
    [
      path.join(base, "node_modules/next/dist/bin/next"),
      "start",
      "-p",
      String(port),
    ],
    { cwd: base, stdio: "ignore" },
  );
  let browser;
  try {
    const url = `http://127.0.0.1:${port}`;
    let ready = false;
    for (let n = 0; n < 40; n++) {
      try {
        ready = (await fetch(url, { signal: AbortSignal.timeout(500) })).ok;
      } catch {}
      if (ready) break;
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    assert.ok(ready, "packed Next server did not start");
    browser = await chromium.launch();
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(url);
    await page
      .getByRole("textbox", { name: "Layer content" })
      .fill("Packed consumer edit");
    await page.getByRole("textbox", { name: "Layer content" }).press("Tab");
    await page.getByRole("heading", { name: "Packed consumer edit" }).waitFor();
    assert.deepEqual(errors, []);
    console.log(
      "Packed Next App Router browser hydration and actual editor interaction: passed.",
    );
  } finally {
    await browser?.close();
    server.kill("SIGTERM");
    await new Promise((resolve) => server.once("exit", resolve));
  }
  for (const [name, entry] of [
    ["runtime", "react-kino"],
    ["studio", "react-kino/studio"],
  ]) {
    await writeFile(
      path.join(base, `${name}-entry.mjs`),
      `export * from '${entry}';`,
    );
    run(path.join(base, "node_modules/esbuild/bin/esbuild"), [
      `${name}-entry.mjs`,
      "--bundle",
      "--minify",
      "--format=esm",
      "--external:react",
      "--external:react-dom",
      `--outfile=${name}.mjs`,
      `--metafile=${name}.json`,
    ]);
    const source = await readFile(path.join(base, `${name}.mjs`));
    const meta = JSON.parse(
      await readFile(path.join(base, `${name}.json`), "utf8"),
    );
    if (name === "runtime")
      assert.ok(
        !Object.keys(meta.inputs).some((input) =>
          /studio|recipe-kit/.test(input),
        ),
        "runtime pulls authoring code",
      );
    console.log(
      `Packed ${name} bundle: ${source.length} bytes minified, ${gzipSync(source).length} gzip; React peers external.`,
    );
  }
  const cli = path.join(base, "node_modules/@react-kino/cli/dist/index.js");
  assert.equal(
    run("node", [cli, "--version"]).trim(),
    JSON.parse(
      await readFile(path.join(repo, "packages/cli/package.json"), "utf8"),
    ).version,
  );
  for (const template of [
    "blank",
    "product-launch",
    "case-study",
    "portfolio",
  ]) {
    run("node", [
      cli,
      "init",
      "--template",
      template,
      "--name",
      "demo-" + template,
    ]);
    const project = path.join(base, "demo-" + template);
    run("npm", ["run", "build"], project);
    console.log(
      `Packed ${template} scaffold TypeScript/Vite production build: passed.`,
    );
  }
} finally {
  await rm(base, { recursive: true, force: true });
}
