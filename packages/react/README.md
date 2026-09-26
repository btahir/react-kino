# react-kino

**React scroll stories with a visual authoring workspace and source you own.**

Compose cinematic scenes, tune timing in the optional Storyboard editor, and render the same portable document in your application. Free under MIT. No hosted account or player required.

[Documentation](https://www.react-kino.dev/docs) · [Storyboard](https://www.react-kino.dev/studio) · [Live recipes](https://www.react-kino.dev/#recipes) · [Component playground](https://www.react-kino.dev/playground)

> Story, Storyboard and portable documents require `react-kino@0.6.0` or later; document CLI commands require `@react-kino/cli@0.2.0` or later.

## Install

```sh
npm install react-kino
```

React and React DOM 18+ are peers. The React package depends on the small internal `@react-kino/core` engine. The core has no runtime dependencies. Use a modern browser with ResizeObserver, IntersectionObserver and CSS container query units for the story/editor layouts.

## A complete story

```tsx
"use client";
import { Story } from "react-kino/story";
import { createStoryRecipe } from "react-kino/recipes";
import { createRecipeComponents } from "react-kino/recipe-kit";

const document = createStoryRecipe("editorial");
export default function Page() {
  return <Story document={document} components={createRecipeComponents()} />;
}
```

Six editable recipes cover product launches, editorial essays, case studies, before/after comparisons, feature chapters and portfolios. The `comparison` recipe references your `Before` and `After` component registrations. Sample copy is a writing scaffold, never a claim about your business.

## Tune it visually

```tsx
"use client";
import { Storyboard } from "react-kino/studio";
import { createStoryRecipe } from "react-kino/recipes";
import { createRecipeComponents } from "react-kino/recipe-kit";

export function AuthoringPage() {
  return (
    <Storyboard
      initialDocument={createStoryRecipe("launch")}
      components={{
        ...createRecipeComponents(),
        ProductVisual: <YourProduct />,
      }}
      storageKey="product-launch-v1"
    />
  );
}
```

Select a scene or layer, drag timing handles, scrub progress, edit transforms, reorder content, and compare desktop with a natural mobile reading layout. Undo/redo, local drafts, explicit restoration, JSON import/export and missing-component diagnostics are included. The editor ships scoped styles and is **not imported by the runtime entrypoints**.

Your React components remain in your code. Documents contain only data and registered names; they do not execute code or round-trip arbitrary JSX. Imports are validated and limited to 2 MB. Draft storage is local to the browser; export a file to share or commit it.

## Render your exported document

```tsx
import { Story } from "react-kino/story";
import { parseStory } from "react-kino/document";
import { createRecipeComponents } from "react-kino/recipe-kit";
import rawStory from "./story.kino.json";

const document = parseStory(JSON.stringify(rawStory));
<Story
  document={document}
  components={{ ...createRecipeComponents(), ProductVisual: <YourProduct /> }}
/>;
```

Pure document functions work in Node without React or a DOM. See the [version 1 JSON Schema](https://www.react-kino.dev/schema/story-v1.json); the runtime validator additionally checks unique IDs and ordered timing ranges.

## Compose individual components

The existing component API remains available:

```tsx
import { Kino, Scene, Reveal, Counter } from "react-kino";

<Kino>
  <Scene duration="250vh" unpinBelow={640}>
    <Reveal animation="fade-up" at={0.15}>
      <h1>A story worth telling.</h1>
    </Reveal>
    <Counter from={0} to={12} at={0.4} />
  </Scene>
</Kino>;
```

| Purpose              | Components / hooks                                                               |
| -------------------- | -------------------------------------------------------------------------------- |
| Story structure      | `Kino`, `Scene`, `Story`, `Progress`, `StickyHeader`                             |
| Scroll motion        | `Reveal`, `ScrollTransform`, `Parallax`, `TextReveal`                            |
| Media and comparison | `VideoScroll`, `CompareSlider`, `HorizontalScroll`, `Panel`                      |
| Details              | `Counter`, `Marquee`                                                             |
| Numeric progress     | `useScrollProgress`, `useSceneProgress`, `useSceneContext`, `useElementProgress` |
| Ref-based progress   | `useScrollProgressValue`, `useSceneProgressValue`, `useElementProgressValue`     |

Built-in hot paths update DOM styles through stable progress subscriptions rather than rendering React on every frame. Numeric/render-prop APIs intentionally opt into updates. [API reference](https://www.react-kino.dev/docs).

## Real layouts and accessibility

- Scenes measure content, including later resizes. Tall content unpins and late reveals become visible. `overflow="clip"` explicitly preserves the older clipping treatment.
- `Kino root={scrollRef}` supports a stable nested scroll ancestor. `stickyOffset` leaves room for navigation. `tracker.refresh()` handles application-specific layout changes.
- Story documents become one-column natural reading layouts below 640px, with reduced motion, or with `reading`. Tall scenes also reveal their content without exit transforms hiding it.
- Horizontal galleries become vertical lists under reduced motion. VideoScroll supports posters, loading/error states, metadata preload, and a readable fallback.
- `Parallax from={180} to={-80}` gives a bounded local range. Existing speed animation now uses the element origin instead of page-top displacement; review old compositions that compensated for the previous behavior.
- SSR includes readable content. Test your actual media, registered components, keyboard behavior and browser matrix; no automated check certifies accessibility or smooth video on every device.

[Responsive stories](https://www.react-kino.dev/docs/responsive-stories) · [Video guidance](https://www.react-kino.dev/docs/recipes/video-story)

## CLI and coding agents

```sh
npx @react-kino/cli init
npx @react-kino/cli init --template product-launch --name my-scroll-app
npx @react-kino/cli recipe list
npx @react-kino/cli recipe launch story.kino.json
npx @react-kino/cli validate story.kino.json --json
npx @react-kino/cli doctor story.kino.json --components Product --json
```

The scaffolder produces a runnable Vite project and a Next App Router page you can copy into an existing application. It refuses to overwrite files or traverse symlinked destination directories. Recipe writes also refuse overwrite; `--dry-run` previews a recipe write. Doctor reports document warnings, not a browser audit.

The package includes [an agent skill](https://github.com/btahir/react-kino/blob/main/packages/react/skills/kino/SKILL.md), versioned schema, and [plain documentation](https://www.react-kino.dev/llms-full.txt). No MCP service is required.

## shadcn registry and templates

```sh
npx shadcn add https://www.react-kino.dev/registry/components/scene.json
npm install @react-kino/templates
```

Registry wrappers reference this package. The templates package still supplies full-page ProductLaunch, CaseStudy and Portfolio components through individual imports. See [templates](https://www.react-kino.dev/templates).

## Support independent maintenance

Tourlight, Kino, Clickmap and Redact share one independent maintainer. Voluntary support helps fund fixes, compatibility updates, documentation and development. Every feature stays free and MIT licensed. [Support this project](https://react-tourlight.vercel.app/support) through the shared support page. Using or exporting a story never requires a payment.

## Contribute and verify locally

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm test
pnpm test:tools
pnpm test:e2e
```

No automatic GitHub CI or publication workflow is included. See [architecture](https://github.com/btahir/react-kino/blob/main/docs/ARCHITECTURE.md), [verification](https://github.com/btahir/react-kino/blob/main/docs/VERIFICATION.md) and [release guidance](https://github.com/btahir/react-kino/blob/main/docs/RELEASING.md). Publishing npm packages and deploying documentation are separate steps.
