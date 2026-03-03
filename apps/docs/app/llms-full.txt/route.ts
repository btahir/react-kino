import { source } from "@/lib/source";
import fs from "node:fs";
import path from "node:path";

const BASE_URL = "https://react-kino.dev";

export const revalidate = false;

function stripFrontmatter(content: string): string {
  return content.replace(/^---[\s\S]*?---\n*/, "");
}

export function GET() {
  const pages = source.getPages();
  const sections: string[] = [];

  for (const page of pages) {
    const filePath = path.join(process.cwd(), "content/docs", page.file.path);
    let raw: string;
    try {
      raw = fs.readFileSync(filePath, "utf-8");
    } catch {
      continue;
    }

    const content = stripFrontmatter(raw);
    const url = `${BASE_URL}${page.url}`;
    const title = page.data.title;
    const desc = page.data.description;

    let section = `# ${title} (${url})`;
    if (desc) section += `\n\n${desc}`;
    section += `\n\n${content.trim()}`;

    sections.push(section);
  }

  return new Response(sections.join("\n\n---\n\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
