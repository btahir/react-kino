import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { storyRecipes } from "react-kino/recipes";
import { RecipeStory } from "@/components/recipe-story";
export function generateStaticParams() {
  return storyRecipes.map((recipe) => ({ id: recipe.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const recipe = storyRecipes.find((r) => r.id === id);
  return {
    title: `${recipe?.title ?? "Story"} — React scroll recipe`,
    description: recipe?.description,
    alternates: { canonical: `https://www.react-kino.dev/recipes/${id}` },
  };
}
export default async function RecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipe = storyRecipes.find((r) => r.id === id);
  if (!recipe) notFound();
  return (
    <main>
      <nav
        style={{
          display: "flex",
          gap: 24,
          padding: "20px 5vw",
          background: "#f5f1e8",
          color: "#263231",
        }}
      >
        <Link href="/">← Kino</Link>
        <Link href={`/studio?recipe=${id}`}>Edit in Storyboard</Link>
        <Link href="/docs/recipes/story-recipes">Get the source</Link>
      </nav>
      <RecipeStory id={id} />
      <footer
        style={{ padding: "48px 5vw", background: "#f5f1e8", color: "#263231" }}
      >
        <h2>{recipe.title}</h2>
        <p>{recipe.description}</p>
        <p>
          Every scene is a versioned document rendered by the same Story
          component you install. Replace the example text with your own; the
          library does not collect reader data.
        </p>
        <pre
          style={{
            overflowX: "auto",
            padding: 20,
            background: "#e6e8df",
            borderRadius: 8,
          }}
        >
          <code>{`npx @react-kino/cli recipe ${id} story.kino.json\nnpx @react-kino/cli validate story.kino.json`}</code>
        </pre>
      </footer>
    </main>
  );
}
