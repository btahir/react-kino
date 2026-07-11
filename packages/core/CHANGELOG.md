# @react-kino/core

## 0.3.0

### Minor Changes

- c781aeb: Performance re-architecture: ref-based rendering engine (backward-compatible).

  - **`ProgressValue` primitive** in `@react-kino/core` — a tiny, React-free motion value (`get` / `set` / `on`) that skips redundant notifications. It's the backbone of the new engine.
  - **Ref-based rendering path** — `<Scene>` now exposes progress as a stable `ProgressValue`, and the built-in components (`Parallax`, `ScrollTransform`, `Reveal`, `HorizontalScroll`, `Counter`, `TextReveal`, `VideoScroll`) subscribe to it and write `transform` / `opacity` / `textContent` directly to the DOM. Scrolling a scene now triggers **zero React re-renders** for these components. The numeric `useSceneContext()` and render-prop APIs still work unchanged (they opt back into re-rendering).
  - **New fast-path hooks** — `useSceneProgressValue()` and `useScrollProgressValue()` return a `ProgressValue` you subscribe to imperatively; `useSceneProgress()` / `useScrollProgress()` remain for the re-rendering path.
  - **Element-relative scroll offsets** — new `useElementProgress` / `useElementProgressValue` hooks and `calcElementProgress` core math support Motion-style offset pairs (`["start end", "end start"]`) to map an element's viewport entry/exit to 0→1 without pinning. `<Reveal trigger="visibility">` (and standalone `<Reveal>`) animate based on their own position.
  - **IntersectionObserver gating** — scenes only do per-frame work while near the viewport (generous `rootMargin`); off-screen scenes cost nothing per frame, and progress snaps to its exact value on fast re-entry.
  - `prefers-reduced-motion` and SSR behavior are preserved exactly.

## 0.2.0

### Minor Changes

- Bug fixes and new APIs from a full audit:

  - Fix: `ScrollTracker` now emits on window resize (debounced + rAF-coalesced); `Scene`, `VideoScroll`, and `HorizontalScroll` recompute viewport-dependent values, so pinned scenes no longer desync after resize or mobile URL-bar changes
  - Fix: `VideoScroll` seeks to the correct frame as soon as video metadata loads (no more stale first frame)
  - Fix: `HorizontalScroll` honors `prefers-reduced-motion`
  - Fix: lazy `ScrollTracker` initialization in `Kino` (no allocation per render)
  - Accessibility: `CompareSlider` is now keyboard and screen-reader accessible (`role="slider"`, arrow/Home/End keys, `ariaLabel` prop, pointer-cancel handling)
  - New: all component prop types exported (`SceneProps`, `RevealProps`, `CounterProps`, `ParallaxProps`, `CompareSliderProps`, `ProgressProps`, `VideoScrollProps`, `TextRevealProps`, `HorizontalScrollProps`, `PanelProps`)
  - New: typed easing names — `EasingName` union exported from core and re-exported from react-kino alongside `EasingFn` and `ProgressData`
  - New: non-throwing context hooks; internal hooks no longer call hooks inside try/catch
  - `parseDuration` warns in development when falling back to 0 on invalid input
  - Source maps now shipped for core and react

## 0.1.3

### Patch Changes

- Fix workspace protocol for npm consumers — change workspace:\* to workspace:^ so pnpm publish resolves to valid semver
