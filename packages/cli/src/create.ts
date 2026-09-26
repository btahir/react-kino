import path from "path";
import fs from "fs-extra";
import kleur from "kleur";
import type { TemplateName } from "./prompts";

export async function createProject(
  template: TemplateName,
  projectName: string,
  createDir: boolean,
): Promise<void> {
  if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(projectName))
    throw new Error(
      "Choose a project directory name containing letters, numbers, underscores or hyphens.",
    );
  const targetDir = createDir
    ? path.resolve(process.cwd(), projectName)
    : process.cwd();

  if (createDir) {
    try {
      if ((await fs.lstat(targetDir)).isSymbolicLink())
        throw new Error("Refusing a symlink project directory.");
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
    if (await fs.pathExists(targetDir)) {
      const files = await fs.readdir(targetDir);
      if (files.length > 0) {
        console.log(
          kleur.red(
            `\n  Directory "${projectName}" already exists and is not empty.\n`,
          ),
        );
        process.exit(1);
      }
    }
    await fs.ensureDir(targetDir);
  }

  const templatesRoot = path.resolve(__dirname, "..", "templates", template);

  if (!(await fs.pathExists(templatesRoot))) {
    console.log(
      kleur.red(`\n  Template "${template}" not found at ${templatesRoot}\n`),
    );
    process.exit(1);
  }

  const files = await collectFiles(templatesRoot);

  // Preflight the entire write set before creating any files.
  for (const file of files) {
    const relativePath = path.relative(templatesRoot, file);
    const destination = path.join(targetDir, relativePath);
    if (await fs.pathExists(destination))
      throw new Error(
        `Refusing to overwrite ${relativePath}. Choose an empty directory.`,
      );
    let ancestor = path.dirname(destination);
    while (
      ancestor !== targetDir &&
      ancestor.startsWith(targetDir + path.sep)
    ) {
      try {
        const stat = await fs.lstat(ancestor);
        if (!stat.isDirectory() || stat.isSymbolicLink())
          throw new Error(`Refusing to write through symlink ${ancestor}.`);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
      }
      ancestor = path.dirname(ancestor);
    }
  }

  for (const file of files) {
    const relativePath = path.relative(templatesRoot, file);
    const destPath = path.join(targetDir, relativePath);

    await fs.ensureDir(path.dirname(destPath));

    let content = await fs.readFile(file, "utf-8");
    content = content
      .replace(/function __PROJECT_NAME__Page/g, "function AppPage")
      .replace(/function __PROJECT_NAME__/g, "function App");
    content = content.replace(/__PROJECT_NAME__/g, projectName);

    await fs.writeFile(destPath, content, { encoding: "utf-8", flag: "wx" });

    console.log(kleur.green("  \u2713") + ` Created ${relativePath}`);
  }

  console.log(kleur.bold("\n  Done! Next steps:\n"));

  if (createDir) {
    console.log(`    cd ${projectName}`);
  }

  console.log("    npm install");
  console.log("    npm run dev\n");
}

async function collectFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(fullPath)));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}
