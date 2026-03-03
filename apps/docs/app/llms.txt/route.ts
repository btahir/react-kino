import { source } from "@/lib/source";

const BASE_URL = "https://react-kino.dev";

export const revalidate = false;

export function GET() {
  const pages = source.getPages();

  const lines = [
    "# react-kino",
    "",
    "> Cinematic scroll-driven storytelling components for React. Apple-style scroll experiences with a core engine under 1 KB gzipped.",
    "",
    "React-kino provides pinned scroll sections (Scenes), reveal animations, parallax, counters, compare sliders, video scroll, text reveal, and more — all with zero runtime dependencies.",
    "",
    "## Docs",
    "",
  ];

  for (const page of pages) {
    const url = `${BASE_URL}${page.url}`;
    const title = page.data.title;
    const desc = page.data.description || "";
    lines.push(`- [${title}](${url}): ${desc}`);
  }

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
