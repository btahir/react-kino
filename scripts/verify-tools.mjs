import {
  mkdtemp,
  readFile,
  writeFile,
  rm,
  mkdir,
  symlink,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import assert from "node:assert/strict";
const cli = path.resolve("packages/cli/dist/index.js");
const dir = await mkdtemp(path.join(tmpdir(), "kino-tools-"));
const run = (args, cwd = dir) =>
  spawnSync(process.execPath, [cli, ...args], { cwd, encoding: "utf8" });
try {
  const recipes = run(["recipe", "list", "--json"]);
  assert.equal(recipes.status, 0, recipes.stderr);
  const list = JSON.parse(recipes.stdout);
  assert.equal(list.length, 6);
  for (const recipe of list) {
    const filename = recipe.id + ".json";
    const create = run(["recipe", recipe.id, filename]);
    assert.equal(create.status, 0, create.stderr);
    const validate = run(["validate", filename, "--json"]);
    assert.equal(validate.status, 0, validate.stderr);
    assert.equal(JSON.parse(validate.stdout).valid, true);
    const before = await readFile(path.join(dir, filename), "utf8");
    assert.equal(run(["recipe", recipe.id, filename]).status, 1);
    assert.equal(await readFile(path.join(dir, filename), "utf8"), before);
  }
  const doctor = run([
    "doctor",
    "comparison.json",
    "--components",
    "Before",
    "--json",
  ]);
  assert.equal(doctor.status, 0);
  assert.ok(
    JSON.parse(doctor.stdout).diagnostics.some(
      (d) => d.code === "missing-registration",
    ),
  );
  await writeFile(path.join(dir, "invalid.json"), '{"version":22}');
  const invalid = run(["validate", "invalid.json", "--json"]);
  assert.equal(invalid.status, 1);
  assert.equal(JSON.parse(invalid.stdout).valid, false);
  await writeFile(path.join(dir, "syntax.json"), "{bad");
  const syntax = run(["validate", "syntax.json", "--json"]);
  assert.equal(syntax.status, 1);
  assert.equal(JSON.parse(syntax.stderr).valid, false);
  const dry = run(["recipe", "launch", "preview.json", "--dry-run"]);
  assert.equal(dry.status, 0);
  await assert.rejects(readFile(path.join(dir, "preview.json")));
  assert.equal(
    run(["--version"]).stdout.trim(),
    JSON.parse(await readFile("packages/cli/package.json", "utf8")).version,
  );
  for (const template of [
    "blank",
    "product-launch",
    "case-study",
    "portfolio",
  ]) {
    const name = "demo-" + template;
    const create = run(["init", "--template", template, "--name", name]);
    assert.equal(create.status, 0, create.stderr);
    const pkg = JSON.parse(
      await readFile(path.join(dir, name, "package.json"), "utf8"),
    );
    assert.equal(pkg.name, name);
    assert.ok(pkg.scripts.build);
    await readFile(path.join(dir, name, "main.tsx"));
    assert.equal(
      run(["init", "--template", template, "--name", name]).status,
      1,
    );
  }
  const blocked = path.join(dir, "blocked");
  await mkdir(blocked);
  await writeFile(path.join(blocked, "package.json"), "preserve me");
  assert.equal(
    run(["init", "--template", "blank", "--name", "blocked", "--here"], blocked)
      .status,
    1,
  );
  assert.equal(
    await readFile(path.join(blocked, "package.json"), "utf8"),
    "preserve me",
  );
  await assert.rejects(readFile(path.join(blocked, "index.html")));
  const outside = path.join(dir, "outside");
  await mkdir(outside);
  await symlink(outside, path.join(dir, "linked"), "dir");
  assert.equal(
    run(["init", "--template", "blank", "--name", "linked"]).status,
    1,
  );
  await assert.rejects(readFile(path.join(outside, "index.html")));
  console.log(
    "CLI integration passed: six recipes, validation, doctor warnings, JSON errors, overwrite refusal, dry run, version.",
  );
} finally {
  await rm(dir, { recursive: true, force: true });
}
