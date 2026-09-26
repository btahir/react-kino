<h1 align="center">@react-kino/templates</h1>

<p align="center">
Pre-built, full-page cinematic scroll experiences for <a href="https://www.npmjs.com/package/react-kino">react-kino</a>.<br/>
Drop in a template, pass your content as props, ship.
</p>

---

## Installation

```bash
npm install @react-kino/templates react-kino
```

```bash
pnpm add @react-kino/templates react-kino
```

**Requirements:** React 18+, `react-kino` as a peer dependency.

---

## Templates

### `<ProductLaunch>`

Apple-style product launch page with a scroll-away hero, sticky nav, stat counters, horizontal feature panels, and a marquee ticker.

```tsx
import { ProductLaunch } from "@react-kino/templates/product-launch";

<ProductLaunch
  name="Acme Pro"
  tagline="The tool that changes everything."
  accentColor="#dc2626"
  navItems={[
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
  ]}
  stats={[
    { value: 10000, label: "Users", format: (n) => `${n.toLocaleString()}+` },
    { value: 99.9, label: "Uptime", format: (n) => `${n.toFixed(1)}%` },
  ]}
  features={[
    { title: "Tiny core", description: "Under 1 KB gzipped.", icon: "⚡" },
    {
      title: "GPU accelerated",
      description: "Compositor-only properties.",
      icon: "🚀",
    },
  ]}
/>;
```

| Prop             | Type                                   | Default         | Description                                          |
| ---------------- | -------------------------------------- | --------------- | ---------------------------------------------------- |
| `name`           | `string`                               | **required**    | Product name (hero heading + sticky header)          |
| `tagline`        | `string`                               | **required**    | Hero subtitle                                        |
| `heroBackground` | `string`                               | dark gradient   | CSS background for the hero                          |
| `accentColor`    | `string`                               | `"#dc2626"`     | Brand accent color used throughout                   |
| `stats`          | `Array<{ value, label, format? }>`     | 3 defaults      | Animated counters section                            |
| `features`       | `Array<{ title, description, icon? }>` | 3 defaults      | Horizontal scroll feature panels                     |
| `navItems`       | `Array<{ label, href? }>`              | --              | Sticky header navigation links                       |
| `headerCtaText`  | `string`                               | `"Get Started"` | CTA button text in sticky header                     |
| `headerCtaHref`  | `string`                               | `"#"`           | CTA button link                                      |
| `showScrollHint` | `boolean`                              | `true`          | Show scroll-down arrow on hero                       |
| `marqueeItems`   | `string[]`                             | feature titles  | Custom items for the ticker between features and CTA |

**Sections:** Sticky header -- Hero (scroll-away) -- Feature cards -- Stat counters -- Horizontal scroll features -- Marquee ticker -- CTA

---

### `<CaseStudy>`

Portfolio case study page with word-by-word overview reveal, smooth challenge/solution cards, result counters, and a results ticker.

```tsx
import { CaseStudy } from "@react-kino/templates/case-study";

<CaseStudy
  title="Redesigning the Future of Commerce"
  client="Acme Corp"
  year={2024}
  overview="We partnered with Acme Corp to reimagine their entire commerce platform from the ground up, delivering a system that scales to millions of transactions."
  challenge="The legacy platform couldn't handle peak traffic, leading to lost revenue during key shopping events."
  solution="A ground-up rebuild using edge computing and progressive rendering, cutting load times by 80%."
  results={[
    { metric: "Faster load time", value: 80, format: (n) => `${n}%` },
    { metric: "Revenue increase", value: 3.2, format: (n) => `${n}x` },
  ]}
  nextProject={{ title: "Project Atlas", href: "/work/atlas" }}
/>;
```

| Prop             | Type                                | Default           | Description                                             |
| ---------------- | ----------------------------------- | ----------------- | ------------------------------------------------------- |
| `title`          | `string`                            | **required**      | Project title (hero heading)                            |
| `client`         | `string`                            | **required**      | Client name (sticky header + hero subtitle)             |
| `year`           | `string \| number`                  | **required**      | Project year                                            |
| `heroImage`      | `string`                            | --                | Hero background image URL                               |
| `overview`       | `string`                            | **required**      | Project overview (rendered word-by-word via TextReveal) |
| `challenge`      | `string`                            | **required**      | The challenge description                               |
| `solution`       | `string`                            | **required**      | The solution description                                |
| `results`        | `Array<{ metric, value, format? }>` | `[]`              | Animated result counters                                |
| `nextProject`    | `{ title, href }`                   | --                | Link to the next project                                |
| `navItems`       | `Array<{ label, href? }>`           | --                | Sticky header navigation links                          |
| `showScrollHint` | `boolean`                           | `true`            | Show scroll-down arrow on hero                          |
| `marqueeItems`   | `string[]`                          | formatted results | Custom items for the results ticker                     |

**Sections:** Sticky header -- Hero (scroll-away) -- Overview (TextReveal) -- Challenge & Solution (ScrollTransform) -- Result counters -- Marquee ticker -- Next project

---

### `<Portfolio>`

Personal portfolio page with a scroll-away name/role hero, word-by-word bio, fluid project cards, skills marquee, and contact section.

```tsx
import { Portfolio } from "@react-kino/templates/portfolio";

<Portfolio
  name="Jane Smith"
  role="Design Engineer"
  bio="I craft interfaces that feel alive. Ten years of turning complex products into experiences people love."
  accentColor="#3b82f6"
  projects={[
    {
      title: "Project Alpha",
      description: "A design system for scale.",
      year: 2024,
      tags: ["React", "Design Systems"],
    },
    {
      title: "Project Beta",
      description: "Real-time collaboration tool.",
      year: 2023,
      tags: ["WebSocket", "Canvas"],
    },
  ]}
  skills={["React", "TypeScript", "Figma", "Three.js", "Motion Design"]}
  contactEmail="jane@example.com"
/>;
```

| Prop             | Type                                         | Default      | Description                                     |
| ---------------- | -------------------------------------------- | ------------ | ----------------------------------------------- |
| `name`           | `string`                                     | **required** | Your name (hero heading + sticky header)        |
| `role`           | `string`                                     | **required** | Your role/title (hero subtitle)                 |
| `bio`            | `string`                                     | **required** | Bio text (rendered word-by-word via TextReveal) |
| `accentColor`    | `string`                                     | `"#3b82f6"`  | Accent color for highlights and tags            |
| `projects`       | `Array<{ title, description, year, tags? }>` | `[]`         | Project cards with scroll-driven entrance       |
| `skills`         | `string[]`                                   | `[]`         | Skills shown in horizontal scroll panels        |
| `contactEmail`   | `string`                                     | --           | Contact email shown in header and footer        |
| `navItems`       | `Array<{ label, href? }>`                    | --           | Sticky header navigation links                  |
| `showScrollHint` | `boolean`                                    | `true`       | Show scroll-down arrow on hero                  |
| `marqueeItems`   | `string[]`                                   | skills list  | Custom items for the skills ticker              |

**Sections:** Sticky header -- Hero (scroll-away) -- Bio (TextReveal) -- Projects (ScrollTransform) -- Skills marquee -- Skills horizontal scroll -- Contact

---

## What's included

Every template is built with these react-kino components:

| Component                    | Used for                                      |
| ---------------------------- | --------------------------------------------- |
| `StickyHeader`               | Transparent-to-solid navigation bar           |
| `ScrollTransform`            | Hero scroll-away effect, fluid card entrances |
| `TextReveal`                 | Word-by-word text reveal on scroll            |
| `Marquee`                    | Infinitely scrolling ticker                   |
| `Scene`                      | Pinned scroll sections with progress tracking |
| `Reveal`                     | Scroll-triggered entrance animations          |
| `Parallax`                   | Background depth layers                       |
| `Counter`                    | Animated stat numbers                         |
| `HorizontalScroll` / `Panel` | Horizontal feature/skill panels               |
| `Progress`                   | Fixed scroll progress bar                     |

---

## Tree-shaking

Each template has its own entry point. Import only what you use:

```tsx
// Only bundles ProductLaunch (not CaseStudy or Portfolio)
import { ProductLaunch } from "@react-kino/templates/product-launch";
```

Or import everything from the barrel:

```tsx
import { ProductLaunch, CaseStudy, Portfolio } from "@react-kino/templates";
```

---

## SSR / Next.js

Templates are SSR-safe and include `"use client"` directives. Use them directly in Next.js App Router pages:

```tsx
// app/page.tsx
"use client";
import { ProductLaunch } from "@react-kino/templates/product-launch";

export default function Page() {
  return <ProductLaunch name="My Product" tagline="Ship faster." />;
}
```

---

## License

MIT

## Support independent maintenance

[Support this project](https://react-tourlight.vercel.app/support). Contributions support maintenance, documentation and development across Tourlight, Kino, Clickmap and Redact. Every feature remains MIT licensed.
