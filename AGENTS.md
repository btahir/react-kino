# AGENTS.md

This file provides guidance to AI coding agents working with this repository.

## Project Overview

react-kino is a React component library for cinematic scroll-driven storytelling (Apple-style scroll experiences).

## Monorepo Structure (Turborepo + pnpm)

```
react-kino/
├── packages/
│   ├── core/       # @react-kino/core — framework-agnostic scroll engine (pure TS, zero deps)
│   ├── react/      # react-kino — React components and hooks (the npm-published package)
│   └── cli/        # @react-kino/cli — local scaffolding, recipe and validation CLI
├── apps/
│   ├── docs/       # Next.js 15 + Fumadocs documentation site
│   └── playground/ # component playground
└── tooling/        # shared ESLint, TypeScript, and tsup configs
```

**Key architectural split:** `@react-kino/core` contains all scroll math, progress calculation, easing, and pinning logic as pure JS. `react-kino` (packages/react) wraps core with React components and hooks.

## Commands

```bash
pnpm install              # install all dependencies
pnpm build                # build all packages in dependency order (core → react → docs)
pnpm dev                  # run all dev scripts in parallel (tsup --watch + vite dev)
pnpm lint                 # lint all packages
pnpm test                 # run core and React unit tests directly
pnpm typecheck            # type-check all packages
pnpm clean                # clean all dist dirs and node_modules
```

Build order enforced by Turborepo: `@react-kino/core` → `react-kino` → `apps/docs`.

## Build & Test Tooling

- **Package manager:** pnpm with workspaces
- **Monorepo:** Turborepo v2 (`turbo.json` defines task pipeline)
- **Package builds:** tsup v8 (ESM + CJS + `.d.ts`)
- **Docs app:** Next.js 15 + Fumadocs
- **Tests:** Vitest + @testing-library/react + jsdom
- **TypeScript:** strict mode, ES2020 target, `bundler` module resolution

## Conventions

- **File naming:** kebab-case for all files (`compare-slider.tsx`, `use-scroll-progress.ts`)
- **Export naming:** PascalCase for React components (`<CompareSlider>`), camelCase for hooks (`useScrollProgress`)
- **SSR safety:** All scroll logic in `useEffect` (client-side only). Components render children on server. Use `useIsClient()` guard for scroll-dependent calculations.
- **Next.js compatibility:** Components use `"use client"` directive for App Router
- **Accessibility:** Respect `prefers-reduced-motion` — render content immediately without animation when preferred
- **Bundle discipline:** Keep optional Studio and recipe data out of runtime imports; measure entrypoints with the same tooling.
- **Dependencies:** Core has zero runtime dependencies; React wrapper depends on core and React peers.

## Animation Engine

The current engine uses passive listeners, requestAnimationFrame batching, ProgressValue subscriptions, and DOM writes. Do not claim native ScrollTimeline or WAAPI acceleration without implementing and verifying it.

## Pinning Strategy

`<Scene>` uses CSS `position: sticky` with a tall spacer div (height = duration). Progress = scroll position through spacer / spacer height. Same technique as GSAP ScrollTrigger without the dependency.

## Publishing

Uses changesets for independent package versioning. Run local checks and publish manually only with explicit user direction. Do not add automatic GitHub workflows.
