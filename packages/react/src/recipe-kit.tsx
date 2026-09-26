"use client";
import React from "react";
import { CompareSlider } from "./compare-slider";
const mono = {
  font: "11px ui-monospace, monospace",
  letterSpacing: ".12em",
  textTransform: "uppercase" as const,
};
function ProductVisual() {
  return (
    <figure style={{ margin: 0 }}>
      <svg
        viewBox="0 0 520 310"
        role="img"
        aria-label="Original illustration of a focused workspace on a laptop"
        style={{ width: "100%", maxHeight: 250 }}
      >
        <rect x="70" y="20" width="380" height="240" rx="16" fill="#afc4ac" />
        <rect x="82" y="32" width="356" height="215" rx="8" fill="#203b35" />
        <rect x="100" y="55" width="100" height="8" rx="4" fill="#b9ceaa" />
        <rect x="100" y="83" width="310" height="140" rx="7" fill="#f3eedc" />
        <rect x="115" y="100" width="180" height="9" rx="4" fill="#a4b59c" />
        <rect x="115" y="124" width="280" height="27" rx="5" fill="#d2ddc6" />
        <rect x="115" y="163" width="125" height="42" rx="5" fill="#718d72" />
        <rect x="252" y="163" width="143" height="42" rx="5" fill="#d8c6a1" />
        <path
          d="M70 260H450L495 278Q499 286 484 290H35Q20 286 26 278Z"
          fill="#d7ddc9"
        />
        <path d="M210 260H312L323 272H200Z" fill="#a9bba6" />
      </svg>
      <figcaption style={{ ...mono, textAlign: "center", opacity: 0.8 }}>
        Original sample artwork · replace with your product
      </figcaption>
    </figure>
  );
}
function Landscape() {
  return (
    <figure style={{ margin: 0 }}>
      <svg
        viewBox="0 0 680 310"
        role="img"
        aria-label="Original illustration of sunlight above a quiet landscape"
        style={{ width: "100%", maxHeight: 280, borderRadius: 14 }}
      >
        <rect width="680" height="310" fill="#d8c9a2" />
        <circle cx="475" cy="85" r="46" fill="#f5edca" />
        <path d="M0 180Q130 40 270 170T680 120V310H0" fill="#8c9f8b" />
        <path d="M0 245Q210 90 410 220T680 180V310H0" fill="#496e59" />
        <path d="M0 295Q250 160 520 290T680 245V310H0" fill="#203f36" />
      </svg>
      <figcaption style={{ ...mono, marginTop: 10 }}>
        A place to begin · original vector illustration
      </figcaption>
    </figure>
  );
}
function Quote() {
  return (
    <blockquote
      style={{
        margin: 0,
        borderLeft: "3px solid #b1976b",
        padding: "12px 24px",
        fontFamily: "Georgia,serif",
        fontSize: "clamp(22px,3cqw,36px)",
        lineHeight: 1.45,
      }}
    >
      A story changes when we give the details enough room.
      <footer style={{ ...mono, fontSize: 9, marginTop: 18 }}>
        Sample editorial passage
      </footer>
    </blockquote>
  );
}
function ComparisonPanel({ after }: { after: boolean }) {
  return (
    <div
      style={{
        padding: 24,
        borderRadius: 14,
        background: after ? "#d4e2d0" : "#ddd8d0",
        color: "#253f34",
        minHeight: 220,
      }}
    >
      <span style={mono}>{after ? "Revised layout" : "Original layout"}</span>
      <h3 style={{ fontSize: 24, margin: "16px 0" }}>
        {after ? "One clear next step." : "Everything, everywhere."}
      </h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: after ? "1fr" : "repeat(3,1fr)",
          gap: 8,
        }}
      >
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            style={{
              height: after ? 24 : 65,
              background: after && n === 1 ? "#486c52" : "#ffffff80",
              borderRadius: 5,
            }}
          />
        ))}
      </div>
      <p style={{ fontSize: 11, marginBottom: 0, marginTop: 16 }}>
        Illustrative interface, not a client result.
      </p>
    </div>
  );
}
function Evidence() {
  return (
    <div
      style={{
        padding: 28,
        border: "1px solid currentColor",
        borderRadius: 14,
      }}
    >
      <span style={mono}>An honest outcome</span>
      <dl
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 0,
        }}
      >
        <dt>Baseline</dt>
        <dd style={{ margin: 0 }}>Your measurement</dd>
        <dt>Change</dt>
        <dd style={{ margin: 0 }}>Your result</dd>
        <dt>Time window</dt>
        <dd style={{ margin: 0 }}>Your dates</dd>
      </dl>
      <p style={{ fontSize: 12, opacity: 0.8, marginBottom: 0 }}>
        Add real evidence before publishing your case study.
      </p>
    </div>
  );
}
function ProjectCards() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,180px),1fr))",
        gap: 14,
      }}
    >
      {[
        {
          name: "A calmer workspace",
          category: "Interface design",
          color: "#d1d9bc",
        },
        {
          name: "A different perspective",
          category: "Editorial experience",
          color: "#d8b18b",
        },
      ].map((project, i) => (
        <article
          key={project.name}
          style={{
            padding: 20,
            borderRadius: 12,
            background: project.color,
            color: "#293f34",
          }}
        >
          <div
            style={{
              height: 80,
              display: "grid",
              placeItems: "center",
              border: "1px solid #293f3433",
              borderRadius: 8,
              marginBottom: 20,
            }}
          >
            <span style={{ fontSize: 38, fontFamily: "Georgia,serif" }}>
              {i === 0 ? "Aa" : "↗"}
            </span>
          </div>
          <span style={{ ...mono, fontSize: 9 }}>{project.category}</span>
          <h3 style={{ fontSize: 20, lineHeight: 1.2, margin: "10px 0" }}>
            {project.name}
          </h3>
          <p style={{ fontSize: 11, margin: 0 }}>
            Sample work — replace with your own project.
          </p>
        </article>
      ))}
    </div>
  );
}
function FeatureCards() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,150px),1fr))",
        gap: 12,
      }}
    >
      {["Compose", "Refine", "Keep"].map((name, i) => (
        <div
          key={name}
          style={{
            padding: 24,
            borderRadius: 12,
            background: ["#cedbc1", "#d5c3a2", "#b6c7bc"][i],
            color: "#263e33",
          }}
        >
          <span style={mono}>0{i + 1}</span>
          <h3 style={{ fontSize: 24, margin: "25px 0 12px" }}>{name}</h3>
          <p style={{ fontSize: 13, margin: 0 }}>
            {
              [
                "Build from scenes and meaningful content.",
                "Tune the timing in the real renderer.",
                "Export a document your application owns.",
              ][i]
            }
          </p>
        </div>
      ))}
    </div>
  );
}
/** Optional original sample visuals. Replace registrations with your own application components. */
export function createRecipeComponents(): Record<string, React.ReactNode> {
  return {
    ProductVisual: <ProductVisual />,
    Landscape: <Landscape />,
    Quote: <Quote />,
    Before: <ComparisonPanel after={false} />,
    After: <ComparisonPanel after />,
    Comparison: (
      <CompareSlider
        before={<ComparisonPanel after={false} />}
        after={<ComparisonPanel after />}
        ariaLabel="Compare sample interface layouts"
      />
    ),
    Evidence: <Evidence />,
    Projects: <ProjectCards />,
    Features: <FeatureCards />,
  };
}
