# Manual release

This branch prepares react-kino 0.6.0, @react-kino/core 0.4.0, @react-kino/cli 0.2.0 and @react-kino/templates 0.1.6. Changesets versioning has been applied to manifests, dependency ranges, changelogs and lockfile. Versioning does not publish to npm. Pushes and merges may trigger the existing Vercel Git integration; verify deployment status separately. No GitHub CI workflow is required.

Before publishing after merge:

1. Install with `pnpm install --frozen-lockfile`.
2. Run `pnpm --filter @react-kino/core build`, `pnpm --filter react-kino build`, `pnpm --filter @react-kino/templates build`, then `pnpm --filter @react-kino/cli build`.
3. Run `pnpm test`, `pnpm test:tools`, `pnpm test:packed`, `pnpm test:e2e` and `pnpm --filter @react-kino/docs build`. Stop an existing docs dev server first, or set `KINO_BUILD_DIR=.next-production` for a separate production build.
4. Inspect tarballs, package versions and npm dist-tags again. A registry conflict must be resolved with a new version rather than retrying an occupied version.
5. With the owner's npm credentials and explicit publication intent, publish the coordinated core, React, templates and CLI packages using Changesets. Verify installed consumer imports and dist-tags after publishing.
6. Check the existing Vercel Git integration or deploy the docs as configured, then verify live canonicals, sitemap, registry/schema routes, LLM text and support links. A merged PR alone does not prove a successful deployment or an npm release.

`test:packed` creates an isolated temporary consumer, installs all four local tarballs, tests Node imports, client boundaries and shipped artifacts, then builds a Next App Router app and all four CLI starters. It removes its temporary directory on success or failure. `test:e2e` can reuse localhost:4311 or start a development server itself. Use `KINO_TEST_URL` for a different server. Browser binaries are a local prerequisite (`pnpm exec playwright install`).

For a Vercel project whose root is `apps/docs`, the committed `apps/docs/vercel.json` runs the root Turbo graph filtered to the docs application. That builds core → React → templates before Next on a clean checkout; the docs `build` script also builds its workspace dependency graph, so `cd apps/docs && pnpm build` works on a clean checkout. A bare `next build` requires those outputs already to exist. Vercel project configuration must allow workspace files outside its root.
