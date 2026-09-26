import type { StoryDocument, StoryLayer, StoryScene } from "./document";
const heading = (content: string): StoryLayer => ({
  id: "headline",
  kind: "heading",
  content,
  track: {
    start: 0,
    end: 0.35,
    from: { y: 50, opacity: 0.15 },
    to: { y: 0, opacity: 1 },
    easing: "ease-out",
  },
});
const body = (content: string): StoryLayer => ({
  id: "body",
  kind: "text",
  content,
  track: {
    start: 0.15,
    end: 0.6,
    from: { y: 35, opacity: 0.15 },
    to: { y: 0, opacity: 1 },
    easing: "ease-out",
  },
});
function scene(
  id: string,
  title: string,
  headline: string,
  copy: string,
  light = false,
): StoryScene {
  return {
    id,
    title,
    duration: 250,
    pin: true,
    layout: "stack",
    background: light ? "#eee9df" : "#171c20",
    color: light ? "#171c20" : "#f5f1e8",
    layers: [heading(headline), body(copy)],
  };
}
export const storyRecipes: {
  id: string;
  title: string;
  description: string;
  document: StoryDocument;
}[] = [
  {
    id: "launch",
    title: "Product launch",
    description:
      "A confident introduction, a reason to care, and one clear next step.",
    document: {
      version: 1,
      title: "Made for the everyday",
      scenes: [
        scene(
          "introduce",
          "The idea",
          "Less noise. More focus.",
          "A workspace designed around the work that matters. Start with your product's clearest promise, then show it in action.",
        ),
        scene(
          "detail",
          "The difference",
          "Every detail earns its place.",
          "Explain one meaningful benefit here. Pair it with a registered product image or interactive component, rather than another wall of features.",
          true,
        ),
        scene(
          "begin",
          "Your next chapter",
          "Make room for better work.",
          "Replace this closing note with your own trusted application call to action. Your content and components stay in your codebase.",
        ),
      ],
    },
  },
  {
    id: "editorial",
    title: "Editorial essay",
    description:
      "Three readable chapters for a visual narrative, with a natural mobile reading mode.",
    document: {
      version: 1,
      title: "A slower way through",
      scenes: [
        scene(
          "arrival",
          "Arrival",
          "The city wakes slowly.",
          "Before the first train, there is a small pocket of quiet. Use this chapter to establish the place, the question, and the people at the center of your story.",
          true,
        ),
        scene(
          "turn",
          "A closer look",
          "A small change, a different view.",
          "Give the reader something specific to notice. A quote, photograph, or diagram can live in a registered component while the text remains searchable and readable.",
        ),
        scene(
          "reflection",
          "Reflection",
          "What do we carry forward?",
          "End with a question worth thinking about. On narrow screens this story becomes a straightforward article, keeping every word in its original reading order.",
          true,
        ),
      ],
    },
  },
  {
    id: "case-study",
    title: "Case study",
    description:
      "Move from problem to decisions to evidence without hiding the actual results.",
    document: {
      version: 1,
      title: "A considered redesign",
      scenes: [
        scene(
          "problem",
          "The problem",
          "People were getting lost.",
          "Describe the observed problem and the people affected. Distinguish measured evidence from assumptions, and keep any client data out of the example.",
        ),
        scene(
          "decision",
          "The decision",
          "Make the next step obvious.",
          "Show the design decision and the trade-off. Add your real artifact through a named image or component registration.",
          true,
        ),
        scene(
          "outcome",
          "The outcome",
          "Results, with context.",
          "Include your actual measurement period and sample size here. This starter deliberately contains no invented conversion figures or customer testimonials.",
        ),
      ],
    },
  },
  {
    id: "comparison",
    title: "Before & after",
    description:
      "A balanced evidence story with two registered comparison panels.",
    document: {
      version: 1,
      title: "See the difference",
      scenes: [
        {
          ...scene(
            "compare",
            "Two perspectives",
            "A change you can inspect.",
            "Name what changed and why. Your original and updated designs stay side by side.",
          ),
          layout: "split",
        },
        {
          ...scene("evidence", "The evidence", "Before", "After", true),
          layout: "split",
          layers: [
            { id: "before", kind: "component", content: "Before" },
            { id: "after", kind: "component", content: "After" },
          ],
        },
      ],
    },
  },
  {
    id: "gallery",
    title: "Feature chapters",
    description: "Three focused product chapters with a readable mobile flow.",
    document: {
      version: 1,
      title: "One thing at a time",
      scenes: [
        scene(
          "clarity",
          "01 — Clarity",
          "Find your starting point.",
          "Introduce the first benefit with an example from a real workflow.",
        ),
        scene(
          "rhythm",
          "02 — Rhythm",
          "Keep a comfortable pace.",
          "Connect the second benefit to the first. Each chapter has its own timing and can be reordered independently.",
          true,
        ),
        scene(
          "finish",
          "03 — Finish",
          "Leave something useful.",
          "Give the reader a clear conclusion and a useful next step.",
        ),
      ],
    },
  },
  {
    id: "portfolio",
    title: "Personal portfolio",
    description:
      "A short introduction, selected work, and a human closing note.",
    document: {
      version: 1,
      title: "Selected work",
      scenes: [
        scene(
          "hello",
          "Hello",
          "Thoughtful work for real people.",
          "Write a short introduction in your own voice. Tell visitors what you make and what kinds of problems interest you.",
          true,
        ),
        scene(
          "work",
          "Selected work",
          "The details tell the story.",
          "Register your own project cards here. The editor controls timing; the application keeps its links, semantics, and component behavior.",
        ),
        scene(
          "contact",
          "Let's talk",
          "Something in mind?",
          "Finish with your own contact component. No form backend, tracking script, or hosted account is required by Kino.",
          true,
        ),
      ],
    },
  },
];
// Distinct visual compositions remain explicit registered layers, never opaque HTML.
function visual(id: string, content: string): StoryLayer {
  return {
    id,
    kind: "component",
    content,
    track: {
      start: 0.05,
      end: 0.75,
      from: { y: 30, scale: 0.94, opacity: 0.25 },
      to: { y: 0, scale: 1, opacity: 1 },
      easing: "ease-out",
    },
  };
}
const launch = storyRecipes[0].document;
launch.scenes[0].layout = "split";
launch.scenes[0].layers.splice(1, 0, visual("product", "ProductVisual"));
launch.scenes[1].layers.push(visual("features", "Features"));
const editorial = storyRecipes[1].document;
editorial.scenes[0].layers.push(visual("landscape", "Landscape"));
editorial.scenes[1].layout = "split";
editorial.scenes[1].layers = [
  visual("quote", "Quote"),
  body(
    "Look beyond the headline. This chapter leaves space for a quotation or primary artifact while the narrative remains in ordinary, readable text.",
  ),
];
const caseStudy = storyRecipes[2].document;
caseStudy.scenes[1].layers.push(visual("comparison", "Comparison"));
caseStudy.scenes[2].layout = "split";
caseStudy.scenes[2].layers = [
  heading("Results, with context."),
  visual("evidence", "Evidence"),
];
storyRecipes[4].document.scenes[0].layers.push(visual("features", "Features"));
storyRecipes[4].document.scenes[1].layers.push(
  visual("product", "ProductVisual"),
);
storyRecipes[5].document.scenes[1].layers = [
  heading("Selected work."),
  visual("projects", "Projects"),
];
export function createStoryRecipe(id = "launch"): StoryDocument {
  const recipe = storyRecipes.find((r) => r.id === id);
  if (!recipe) throw new Error(`Unknown recipe: ${id}`);
  return JSON.parse(JSON.stringify(recipe.document)) as StoryDocument;
}
