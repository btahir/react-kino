<h1 align="center">@react-kino/core</h1>

<p align="center">
Framework-agnostic scroll engine powering <a href="https://www.npmjs.com/package/react-kino">react-kino</a>.<br/>
Pure TypeScript, zero dependencies, under 1 KB gzipped.
</p>

---

## Do you need this package?

Probably not directly. `@react-kino/core` is the low-level scroll math (progress calculation, easing, duration parsing, pinning checks) that [`react-kino`](https://www.npmjs.com/package/react-kino) wraps with React components and hooks. If you're building with React, install **`react-kino`** instead -- it re-exports the types from this package (`EasingName`, `EasingFn`, `ProgressData`) so you rarely need to depend on `@react-kino/core` yourself.

Install this package directly only if you're integrating the scroll engine into a non-React app, or building bindings for another framework.

```bash
npm install @react-kino/core
```

---

## What's included

- **`ScrollTracker`** -- subscribes to `window` scroll/resize events, batches updates via `requestAnimationFrame`, and emits `{ scrollY, viewportHeight, scrollHeight, progress }` to subscribers. Resize bursts (window drags, mobile browser URL-bar show/hide) are debounced and coalesced into a single rAF-scheduled emission so viewport-dependent values stay in sync.
- **`ProgressValue`** -- a tiny, React-free "motion value". Holds a single number, notifies subscribers imperatively on change (`get()` / `set(n)` / `on(fn)`), and skips redundant notifications when the value is unchanged. This is the backbone of react-kino's ref-based rendering engine: components subscribe and write to the DOM directly, bypassing React's render cycle on the scroll hot path.
- **`calcElementProgress(offsets, info)`** -- computes element-relative scroll progress (`0`-`1`) from Motion-style offset pairs like `["start end", "end start"]`, mapping an element's viewport entry/exit without pinning. Pure and unit-tested; helpers `edgeToFraction`, `parseOffsetEntry`, and `resolveOffsetScrollY` are also exported.
- **`calcSceneProgress(scrollY, offsetTop, duration)`** -- computes a pinned scene's progress (`0`-`1`) from raw scroll position.
- **`parseDuration(duration, viewportHeight)`** -- parses a CSS-like duration string (`"200vh"`, `"1500px"`) into pixels. Warns in development (not production) and falls back to `0` if the input can't be parsed.
- **`isSceneActive(scrollY, offsetTop, duration)`** -- returns whether a scene is currently within its scroll range.
- **`clamp(value, min, max)`** / **`lerp(a, b, t)`** -- small numeric helpers used throughout the engine.
- **Easing presets** -- `linear`, `easeIn`, `easeOut`, `easeInOut`, `easeInCubic`, `easeOutCubic`, `easeInOutCubic`, `easeInQuart`, `easeOutQuart`, `easeInOutQuart`, plus an `EASINGS` lookup keyed by the typed `EasingName` union (`"linear" | "ease-in" | "ease-out" | "ease-in-out" | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic" | "ease-in-quart" | "ease-out-quart" | "ease-in-out-quart"`).
- **Types** -- `EasingFn`, `EasingName`, `SceneConfig`, `ProgressData`, `ScrollSubscriber`, `ProgressListener`, `OffsetEdge`, `OffsetEntry`, `ElementOffsetInfo`.

```ts
import { ProgressValue, calcElementProgress } from "@react-kino/core";

// A motion value you can write to without re-rendering anything.
const progress = new ProgressValue(0);
const unsubscribe = progress.on((p) => {
  element.style.setProperty("--kino-progress", String(p));
});
progress.set(0.5); // notifies subscribers; set(0.5) again is a no-op

// Element-relative progress (0 as it enters, 1 once it has fully passed).
const p = calcElementProgress(["start end", "end start"], {
  elementTop: 1200, // rect.top + scrollY
  elementHeight: 480,
  viewportHeight: 800,
  scrollY: 900,
});
```

```ts
import { ScrollTracker, calcSceneProgress, parseDuration } from "@react-kino/core";

const tracker = new ScrollTracker();
const unsubscribe = tracker.subscribe(({ scrollY, viewportHeight }) => {
  const durationPx = parseDuration("300vh", viewportHeight);
  const progress = calcSceneProgress(scrollY, /* offsetTop */ 0, durationPx);
  console.log(progress); // 0 -> 1
});

tracker.start();
// later: unsubscribe(); tracker.stop();
```

---

## Design goals

- **Zero dependencies** -- pure TypeScript, runs anywhere (browser, edge runtimes) with no Node.js assumptions.
- **Framework-agnostic** -- no React (or any UI framework) in this package; `react-kino` is the React binding.
- **Tiny** -- the entire engine is under 1 KB gzipped.
- **Type-safe** -- ships full `.d.ts` declarations and source maps.

---

## License

MIT

---

<p align="center">
  <a href="https://github.com/btahir/react-kino">GitHub</a>
</p>
