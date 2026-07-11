# react-kino

## 0.4.0

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

### Patch Changes

- Updated dependencies
  - @react-kino/core@0.2.0

## 0.3.1

### Patch Changes

- Fix workspace protocol for npm consumers — change workspace:\* to workspace:^ so pnpm publish resolves to valid semver
- Updated dependencies
  - @react-kino/core@0.1.3
