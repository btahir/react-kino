---
"@react-kino/core": minor
"react-kino": minor
---

Performance re-architecture: ref-based rendering engine (backward-compatible).

- **`ProgressValue` primitive** in `@react-kino/core` — a tiny, React-free motion value (`get` / `set` / `on`) that skips redundant notifications. It's the backbone of the new engine.
- **Ref-based rendering path** — `<Scene>` now exposes progress as a stable `ProgressValue`, and the built-in components (`Parallax`, `ScrollTransform`, `Reveal`, `HorizontalScroll`, `Counter`, `TextReveal`, `VideoScroll`) subscribe to it and write `transform` / `opacity` / `textContent` directly to the DOM. Scrolling a scene now triggers **zero React re-renders** for these components. The numeric `useSceneContext()` and render-prop APIs still work unchanged (they opt back into re-rendering).
- **New fast-path hooks** — `useSceneProgressValue()` and `useScrollProgressValue()` return a `ProgressValue` you subscribe to imperatively; `useSceneProgress()` / `useScrollProgress()` remain for the re-rendering path.
- **Element-relative scroll offsets** — new `useElementProgress` / `useElementProgressValue` hooks and `calcElementProgress` core math support Motion-style offset pairs (`["start end", "end start"]`) to map an element's viewport entry/exit to 0→1 without pinning. `<Reveal trigger="visibility">` (and standalone `<Reveal>`) animate based on their own position.
- **IntersectionObserver gating** — scenes only do per-frame work while near the viewport (generous `rootMargin`); off-screen scenes cost nothing per frame, and progress snaps to its exact value on fast re-entry.
- `prefers-reduced-motion` and SSR behavior are preserved exactly.
