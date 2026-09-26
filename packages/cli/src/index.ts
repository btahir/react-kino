import kleur from "kleur";
import fs from "node:fs/promises";
import path from "node:path";
import {
  parseStory,
  inspectStory,
  serializeStory,
  validateStory,
} from "@react-kino/core/document";
import { createStoryRecipe, storyRecipes } from "react-kino/recipes";
import { askInitQuestions } from "./prompts";
import { createProject } from "./create";
import packageJson from "../package.json";
const args = process.argv.slice(2);
const json = args.includes("--json");
async function main() {
  const command = args[0];
  if (command === "--version" || command === "-v") {
    console.log(packageJson.version);
    return;
  }
  if (command === "validate" || command === "doctor") {
    const filename = args[1];
    if (!filename || filename.startsWith("--"))
      throw new Error(
        `Usage: kino ${command} story.kino.json [--json] [--components Before,After]`,
      );
    const stat = await fs.stat(filename);
    if (stat.size > 2_000_000)
      throw new Error("Story exceeds the 2 MB import limit.");
    const source = await fs.readFile(filename, "utf8");
    let input: unknown;
    try {
      input = JSON.parse(source);
    } catch {
      throw new Error("Invalid JSON.");
    }
    const validation = validateStory(input);
    const componentsArg = args.indexOf("--components");
    const registrations =
      componentsArg >= 0
        ? (args[componentsArg + 1] ?? "").split(",").filter(Boolean)
        : undefined;
    const diagnostics =
      command === "doctor" && validation.valid
        ? inspectStory(validation.document!, registrations)
        : validation.diagnostics;
    const report = {
      valid: validation.valid,
      diagnostics,
      ...(validation.valid
        ? {
            title: validation.document!.title,
            scenes: validation.document!.scenes.length,
            layers: validation.document!.scenes.reduce(
              (n, s) => n + s.layers.length,
              0,
            ),
          }
        : {}),
      scope:
        "Document checks only. Verify actual content, assets, layout, keyboard and reduced motion in a browser.",
    };
    console.log(
      json
        ? JSON.stringify(report, null, 2)
        : `${validation.valid ? "✓ Valid story" : "✕ Invalid story"}\n${diagnostics.map((d) => `${d.severity}: ${d.path} — ${d.message}`).join("\n")}\n${report.scope}`,
    );
    if (!validation.valid) process.exitCode = 1;
    return;
  }
  if (command === "recipe") {
    if (args[1] === "list" || !args[1]) {
      console.log(
        json
          ? JSON.stringify(
              storyRecipes.map(({ id, title, description }) => ({
                id,
                title,
                description,
              })),
              null,
              2,
            )
          : storyRecipes
              .map((r) => `${r.id.padEnd(12)} ${r.description}`)
              .join("\n"),
      );
      return;
    }
    const output = args[2];
    const source = serializeStory(createStoryRecipe(args[1]));
    if (!output || output.startsWith("--")) {
      console.log(source);
      return;
    }
    if (args.includes("--dry-run")) {
      console.log(
        `Would create ${path.resolve(output)} (existing files are never overwritten).`,
      );
      return;
    }
    await fs.writeFile(output, source, { flag: "wx" });
    console.log(`Created ${output}. Import it in Story or Storyboard.`);
    return;
  }
  if (!command || command === "init") {
    console.log(
      kleur.bold("\n  react-kino — stories that stay in your codebase\n"),
    );
    const templateIndex = args.indexOf("--template");
    const nameIndex = args.indexOf("--name");
    const template = args[templateIndex + 1];
    if (
      templateIndex >= 0 &&
      !["product-launch", "case-study", "portfolio", "blank"].includes(template)
    )
      throw new Error("Unknown template.");
    if (templateIndex >= 0 && (nameIndex < 0 || !args[nameIndex + 1]))
      throw new Error("Supply --name for noninteractive scaffolding.");
    const answers =
      templateIndex >= 0
        ? {
            template: template as
              | "product-launch"
              | "case-study"
              | "portfolio"
              | "blank",
            projectName: args[nameIndex + 1],
            createDir: !args.includes("--here"),
          }
        : await askInitQuestions();
    if (!answers) return;
    await createProject(
      answers.template,
      answers.projectName,
      answers.createDir,
    );
    return;
  }
  if (!["--help", "-h"].includes(command)) {
    process.exitCode = 1;
    console.error(`Unknown command: ${command}`);
  }
  console.log(
    `Kino ${packageJson.version}\n\n  kino init                         Scaffold a React page (never overwrite files)\n  kino recipe list                  List portable story recipes\n  kino recipe launch story.json     Save a recipe; --dry-run previews the write\n  kino validate story.json --json   Validate a versioned story document\n  kino doctor story.json --json     Explain document warnings\n  kino doctor story.json --components Before,After\n\nDocuments reference trusted application components by name. No code is evaluated.`,
  );
}
main().catch((error) => {
  console.error(
    json
      ? JSON.stringify({ valid: false, error: error.message })
      : `Error: ${error.message}`,
  );
  process.exitCode = 1;
});
