import { storyRecipes } from "react-kino/recipes";
import Link from "next/link";
import type { Metadata } from "next";
import { StoryboardWorkspace } from "@/components/storyboard-workspace";
export const metadata: Metadata = {
  title: "Kino Storyboard — visual scroll story editor",
  description:
    "Compose and tune React scroll stories locally. Real runtime preview, portable JSON, undo, and responsive reading modes. No account required.",
  alternates: { canonical: "https://www.react-kino.dev/studio" },
};
export default async function StudioPage({
  searchParams,
}: {
  searchParams: Promise<{ recipe?: string }>;
}) {
  const params = await searchParams;
  const recipe = storyRecipes.some((r) => r.id === params.recipe)
    ? params.recipe
    : "launch";
  return (
    <div
      style={{
        background: "#e8e9e1",
        minHeight: "100vh",
        padding: "clamp(12px, 2vw, 28px)",
        color: "#263231",
      }}
    >
      <nav
        aria-label="Workspace navigation"
        style={{
          display: "flex",
          gap: 24,
          padding: "0 8px 18px",
          font: "13px system-ui",
        }}
      >
        <Link href="/">← Kino</Link>
        <Link href="/docs/authoring">How to use Storyboard</Link>
        <Link href="/recipes/launch">See a live story</Link>
      </nav>
      <StoryboardWorkspace recipe={recipe} />
    </div>
  );
}
