import kleur from "kleur";
import { askInitQuestions } from "./prompts";
import { createProject } from "./create";

const BANNER = `
  ${kleur.magenta("\u2726")} ${kleur.bold("react-kino")} ${kleur.dim("\u2014 cinematic scroll experiences for React")}
`;

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === "init") {
    console.log(BANNER);

    const answers = await askInitQuestions();

    if (!answers) {
      console.log(kleur.dim("\n  Cancelled.\n"));
      process.exit(0);
    }

    await createProject(answers.template, answers.projectName, answers.createDir);
  } else if (command === "--help" || command === "-h") {
    printHelp();
  } else if (command === "--version" || command === "-v") {
    console.log("0.1.0");
  } else {
    console.log(kleur.red(`\n  Unknown command: ${command}\n`));
    printHelp();
    process.exit(1);
  }
}

function printHelp() {
  console.log(BANNER);
  console.log("  Usage:");
  console.log("    npx @kino/cli init    Scaffold a new scroll page from a template");
  console.log("    npx @kino/cli -h      Show this help message");
  console.log("    npx @kino/cli -v      Show version\n");
}

main().catch((err) => {
  console.error(kleur.red("\n  Error:"), err.message);
  process.exit(1);
});
