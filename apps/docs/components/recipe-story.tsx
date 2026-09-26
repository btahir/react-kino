"use client";
import { useState } from "react";
import { Story } from "react-kino/story";
import { createStoryRecipe } from "react-kino/recipes";
import { demoComponents } from "./demo-components";
export function RecipeStory({ id }: { id: string }) {
  const [reading, setReading] = useState(false);
  return (
    <>
      <div
        style={{
          padding: "16px 5vw",
          background: "#e8ede3",
          color: "#263231",
          display: "flex",
          justifyContent: "space-between",
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        <span>Scroll to explore · resize to see the mobile reading layout</span>
        <label>
          <input
            type="checkbox"
            checked={reading}
            onChange={(e) => setReading(e.target.checked)}
          />{" "}
          Reading mode
        </label>
      </div>
      <Story
        document={createStoryRecipe(id)}
        components={demoComponents}
        reading={reading}
      />
    </>
  );
}
