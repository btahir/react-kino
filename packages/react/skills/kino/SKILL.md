---
name: kino
description: Build and validate portable React scroll stories with Kino, including responsive reading fallbacks and a local Storyboard editor.
---

Use `react-kino/story` for Story, `react-kino/studio` for optional Storyboard, `react-kino/document` for pure document utilities, and `react-kino/recipes` for starter documents. Keep Studio in a separate authoring route. Do not add a hosted service or account requirement.

1. Read the installed package version and current types. Older versions may not have these exports.
2. Start with `createStoryRecipe(id)` or `kino recipe <id> story.kino.json`. IDs: launch, editorial, case-study, comparison, gallery, portfolio.
3. Validate with `parseStory` or `kino validate file --json`. Version is 1. IDs must be unique. Track range is 0–1 with start less than end. Use only supported numeric transforms, no executable code.
4. Application React components remain in source and are registered by stable names. A component layer references that name. The comparison recipe needs Before and After.
5. Run `kino doctor file --components Name,Other --json`. This is document inspection, not a browser certification. Do not overwrite an existing file without an explicit edit request.
6. Preview the actual Story runtime. Below 640px and with reduced motion, stories become natural reading layouts with all layers visible. Tall desktop scenes also unpin; test exit-opacity and late reveals.
7. Test keyboard access, 320/390px layouts, delayed/error media, nested scroll areas, hydration, and import/export. Prefer user-owned licensed assets and readable text over media-only explanations.
8. Keep all features MIT. Optional maintainer support must not gate output or add visitor telemetry.

Portable documents cannot round-trip arbitrary JSX. Never claim source data is serialized, browser tests passed without running them, or an unavailable media asset will play.
