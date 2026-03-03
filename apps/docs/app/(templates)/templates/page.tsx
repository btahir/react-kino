"use client";

import { Kino, StickyHeader } from "react-kino";
import Link from "next/link";

const templates = [
  {
    name: "Product Launch",
    href: "/templates/product-launch",
    description:
      "A bold product launch page with parallax hero, animated stats, horizontal feature scroll, and marquee ticker.",
    tags: ["Scene", "Counter", "HorizontalScroll", "Parallax", "Marquee"],
  },
  {
    name: "Case Study",
    href: "/templates/case-study",
    description:
      "An editorial case study with TextReveal overview, challenge/solution cards, animated results counters, and next-project CTA.",
    tags: ["TextReveal", "ScrollTransform", "Counter", "Parallax"],
  },
  {
    name: "Portfolio",
    href: "/templates/portfolio",
    description:
      "A minimal portfolio with TextReveal bio, project list with staggered animations, skills marquee, and contact section.",
    tags: ["TextReveal", "ScrollTransform", "HorizontalScroll", "Marquee"],
  },
];

export default function TemplatesPage() {
  return (
    <div
      className="landing-page"
      style={{
        minHeight: "100vh",
        background: "#080808",
        color: "#fff",
      }}
    >
      <Kino>
        <StickyHeader threshold={60} background="rgba(8, 8, 8, 0.92)" blur>
          <div className="site-nav">
            <Link
              href="/"
              className="site-nav-logo"
              style={{ textDecoration: "none" }}
            >
              react-<span>kino</span>
            </Link>
            <div className="site-nav-links">
              <Link href="/playground" className="nav-link">
                Playground
              </Link>
              <Link href="/templates" className="nav-link" data-active="true">
                Templates
              </Link>
              <Link href="/docs" className="nav-link">
                Docs
              </Link>
              <a
                href="https://github.com/btahir/react-kino"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link"
              >
                GitHub
              </a>
            </div>
          </div>
        </StickyHeader>

        {/* Header */}
        <section
          style={{
            paddingTop: "140px",
            paddingBottom: "60px",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(36px, 5vw, 64px)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              margin: "0 0 16px",
            }}
          >
            Templates
          </h1>
          <p
            style={{
              fontSize: "clamp(16px, 2vw, 20px)",
              color: "#666",
              maxWidth: 600,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Full-page scroll experiences built with react-kino. Preview each
            template below, then install with{" "}
            <code
              style={{
                fontSize: "0.9em",
                color: "#ef4444",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              @react-kino/templates
            </code>
            .
          </p>
        </section>

        {/* Template Grid */}
        <section
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 24px 100px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
            gap: 24,
          }}
        >
          {templates.map((t) => (
            <Link
              key={t.name}
              href={t.href}
              className="gamer-card"
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "32px 28px",
                textDecoration: "none",
                color: "inherit",
                transition: "border-color 200ms ease, transform 200ms ease",
              }}
            >
              <h2
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  margin: "0 0 12px",
                  color: "#fff",
                }}
              >
                {t.name}
              </h2>
              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.65,
                  color: "#888",
                  margin: "0 0 20px",
                  flex: 1,
                }}
              >
                {t.description}
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6,
                  marginBottom: 20,
                }}
              >
                {t.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: 11,
                      padding: "3px 10px",
                      borderRadius: 999,
                      background: "rgba(220, 38, 38, 0.08)",
                      color: "#ef4444",
                      border: "1px solid rgba(220, 38, 38, 0.15)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#dc2626",
                }}
              >
                Preview &rarr;
              </span>
            </Link>
          ))}
        </section>

        {/* Footer */}
        <footer
          style={{
            padding: "60px 24px",
            textAlign: "center",
            borderTop: "1px solid #141414",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 24,
              justifyContent: "center",
            }}
          >
            <Link
              href="/playground"
              className="nav-link"
              style={{ color: "#dc2626" }}
            >
              Playground
            </Link>
            <Link href="/docs" className="nav-link" style={{ color: "#dc2626" }}>
              Documentation
            </Link>
            <a
              href="https://github.com/btahir/react-kino"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link"
              style={{ color: "#dc2626" }}
            >
              GitHub
            </a>
          </div>
        </footer>
      </Kino>
    </div>
  );
}
