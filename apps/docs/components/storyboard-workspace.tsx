"use client";
import { createStoryRecipe } from "react-kino/recipes";
import { Storyboard } from "react-kino/studio";
import { demoComponents } from "./demo-components";
export function StoryboardWorkspace({
  recipe = "launch",
}: {
  recipe?: string;
}) {
  return (
    <Storyboard
      key={recipe}
      initialDocument={createStoryRecipe(recipe)}
      components={demoComponents}
    />
  );
}
