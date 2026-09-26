# @react-kino/cli

Scaffold a runnable React scroll page and inspect portable Kino stories locally.

```sh
npx @react-kino/cli init --template product-launch --name my-scroll-app
cd my-scroll-app
npm install
npm run dev
```

Choose `product-launch`, `case-study`, `portfolio`, or `blank`. The generated Vite app includes a `page.tsx` variant for copying into a Next App Router project. `--here` targets the current directory but still refuses all existing destination files; scaffolding does not install dependencies or overwrite source.

The next coordinated release adds:

```sh
kino recipe list
kino recipe editorial story.kino.json
kino recipe editorial story.kino.json --dry-run
kino validate story.kino.json --json
kino doctor story.kino.json --components Product,Chart --json
```

Validation errors return exit code 1. Doctor emits document warnings such as unresolved registrations; it does not inspect a running browser or certify accessibility. Imported stories cannot execute JavaScript. File reads are limited to 2 MB.

[Docs](https://www.react-kino.dev/docs/authoring) · [Repository](https://github.com/btahir/react-kino). Free under MIT. Voluntary shared maintainer support does not gate any command.

## Support independent maintenance

[Support this project](https://react-tourlight.vercel.app/support). Contributions support maintenance, documentation and development across Tourlight, Kino, Clickmap and Redact. Every feature remains MIT licensed.
