# Kino 0.6 architecture

## Three separate responsibilities

`@react-kino/core` owns the scroll tracker, progress values, math and pure version 1 document contract. `@react-kino/core/document` has no React or browser dependency. Validation is strict and bounded: supported keys only, finite numeric ranges, unique IDs, at most 40 scenes and 30 layers each, a 2 MB text import limit, explicit image URL schemes and no executable source. The published JSON Schema describes the structure; the runtime validator also enforces unique IDs and ordered track bounds.

`react-kino` contains the existing component API and exports `Story`. `react-kino/story` is a smaller explicit renderer entry. A document selects trusted React nodes from a named registration map; it cannot import code, serialize arbitrary JSX, or execute strings. `react-kino/recipes` contains only data. `react-kino/recipe-kit` contains optional original sample visuals and an interactive comparison. Missing registrations are visible in the renderer and identified by document diagnostics. Application components remain responsible for their own behavior and data.

`react-kino/studio` is an optional client entry, never imported by the runtime. It uses the same Story renderer. Its local state includes a bounded 80-state history, selection, responsive preview, timeline manipulation and validated import/export. Draft storage is opt-in through editing and restoration is explicit. It stores no server data and makes no analytics requests. The exported document is the shared contract between humans, an application and a coding agent; the CLI validates that same contract. The CLI doctor cannot certify browser layout or performance.

## Runtime and reading policy

A Kino provider owns one ScrollTracker and stable ProgressValue subscriptions. A stable `root` ref may point at a scroll container; scroll offsets and viewport height are measured relative to its content viewport. ResizeObserver updates root and content measurements, while window resize covers ordinary document playback. Applications can call `tracker.refresh()` after unrelated layout changes. Replacing the root DOM node during a mounted provider's lifetime requires remounting that provider.

Scene preserves the existing pinned API but measures an inner flow-root content wrapper. When content exceeds available height, the scene unpins, becomes natural height and provides reading state with progress 1. Reduced motion follows the same policy. Story additionally uses a natural single-column reading layout below 640px, with all hiding/translating transforms reset. Story's container query units make the 390px editor preview reflect its own width. This is an explicit reading policy, not arbitrary per-breakpoint keyframe authoring.

`overflow="clip"` is the opt-in escape hatch for the old clipping behavior. Scene's new measurement wrapper can affect selectors or flex/grid styling that assumed immediate child placement. Apply content layout to your own inner element; `Scene.style` still styles the sticky shell. Local parallax uses the element's origin instead of accumulated document scroll. Existing layouts that compensated for the old global displacement need review. Explicit `from`/`to` gives a bounded local pixel range.

VideoScroll defers the media source until hydration knows the motion preference. Reduced motion keeps a poster and readable text. Metadata preload is the default; loading/error states are visible, errors unpin, changing a failed source retries, and the seek loop applies the latest target after an outstanding seek. The sample clip is original reproducible schematic artwork. Network support, encoding, browser codecs and actual device performance remain application responsibilities.

## Packaging and release

React-facing exports retain `use client`; pure document/recipe exports do not. Conditional ESM/CommonJS types and legacy subpath type mappings are explicit. The four coordinated packages are packed together for consumer verification so a local test cannot silently use old registry dependencies. LICENSE, README and CHANGELOG accompany each tarball; react-kino also includes schema and the concise agent skill.

The docs site renders real stories and component examples. Recipe routes use original registered content; sample metrics are labeled as placeholders. Canonicals, sitemap, registry, schema and LLM text routes share the www.react-kino.dev origin. Their presence does not prove indexing, recommendation or adoption. The optional shared support page funds maintenance across Tourlight, Kino, Clickmap and Redact; no feature or export requires payment.
