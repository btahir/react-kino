# Verification — 2026-09-25

Release prepared locally: react-kino **0.6.0**, @react-kino/core **0.4.0**, @react-kino/cli **0.2.0**, @react-kino/templates **0.1.6**. npm version histories and dist-tags were read on this date: none of these target versions existed. Registry latest versions were 0.5.0 / 0.3.0 / 0.1.3 / 0.1.5 respectively. No publish or deployment was performed as part of these checks.

## Passed checks

- `pnpm test`: **295 unit tests**, 142 in core and 153 in React. Includes strict document validation, serialization, diagnostics, independent recipe copies, SSR, trusted/missing registrations, tall scenes with late reveals and exit-opacity tracks, image/video errors, failed-video source replacement, editing/history/drafts/import errors and keyboard timing.
- `pnpm test:e2e`: **27 browser cases**, passed on both the development server and the final production build, across Chromium, Firefox and WebKit. Real landing navigation, actual content edits and undo/redo, pointer timeline dragging and keyboard controls, JSON download bytes, Chromium clipboard contents, draft persistence/reload/explicit restore, malformed file import, clear draft, 390px authoring layout, nested scroll roots and resize, late-content fallback, reduced-motion horizontal/video reading, six recipe and discovery routes, and actual seeking of the original four-second video all passed.
- Automated axe checks on the Storyboard found no critical or serious violations. Browser page-error checks passed on the tested landing/editor paths. Desktop and mobile canvas were additionally reviewed visually, including preview typography relative to its own 390px container.
- `pnpm test:tools`: all six recipes generated and validated; document doctor/JSON errors/version/dry-run checked; overwrite refusal preserved existing bytes; all four starters scaffolded; partial `--here` collisions and symlink project directories refused before writing files.
- `pnpm test:packed`: all four coordinated local tarballs installed into an isolated consumer. ESM/CommonJS imports, pure/client entrypoint boundaries, package artifacts, SSR and declaration resolution passed. A real Next 15.5.12 App Router production build and Chromium hydration/editor interaction passed. All four packed CLI starters passed TypeScript and Vite production builds. Temporary consumers were removed automatically.
- Packed full runtime export bundle: **33,976 bytes minified / 12,350 gzip**. Optional Studio export bundle: **51,882 / 17,728 gzip**. Both externalize React/React DOM; these are esbuild comparison measurements, not an entire application's network cost. The runtime bundle's import graph excludes Studio and recipe-kit.
- Production docs build generated **47 pages**, including recipes, editor, working registry/schema/LLM endpoints and current Open Graph art. A clean-output check moved core/React/templates dist directories aside and the docs build successfully restored/built them before Next. The docs build script runs the workspace dependency graph first; the Vercel configuration also invokes that graph from the repository root. The separate `.next-production` output permits local review alongside a dev server.
- `pnpm lint`: all six configured TypeScript lint tasks passed. `git diff --check` passed.

## Boundaries and release review

These browser checks use desktop engines with emulated mobile width and reduced motion, not physical iOS/Android devices or assistive technology testing. Automated axe results are not complete accessibility certification. Actual customer media, HTTP range behavior, codecs, enormous custom registered components and production CSP/storage restrictions need application-specific checks.

Scene now measures a content wrapper, auto-unpins tall content and makes essential layers visible. Existing code relying on direct-child CSS, clipping or the old document-global parallax offset needs the migration notes in ARCHITECTURE.md. Use `overflow="clip"` only when deliberate clipping is appropriate. Stable scroll roots are supported; replacing the root node requires provider remounting.

The editor keeps documents local and supports a fixed mobile reading policy, not arbitrary breakpoint animation overrides, JSX round-trip editing, collaborative accounts or video export. Recipe visuals are original, labeled examples; applications replace them with their own product, evidence and links. CLI doctor is static document inspection and cannot prove visual correctness.

Site route checks are local build/runtime checks. They do not establish live deployment, crawling, indexing, LLM recommendations or willingness to donate. Shared support links go to the existing maintainer support page; no payment gate, billing integration, telemetry or automatic GitHub workflow was added.
