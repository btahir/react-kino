"use client";

import {
  Kino,
  Scene,
  Reveal,
  Parallax,
  Counter,
  CompareSlider,
  HorizontalScroll,
  Panel,
  TextReveal,
  Progress,
  Marquee,
  StickyHeader,
} from "react-kino";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback, type ReactNode } from "react";

/* ════════════════════════════════════════════
   Shared UI
   ════════════════════════════════════════════ */

function ProgressSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        marginBottom: "24px",
      }}
    >
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "12px",
          color: "#444",
          letterSpacing: "0.05em",
        }}
      >
        progress
      </span>
      <input
        type="range"
        min={0}
        max={1}
        step={0.005}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ flex: 1 }}
      />
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "13px",
          color: "#ef4444",
          minWidth: "36px",
          textAlign: "right",
        }}
      >
        {(value * 100).toFixed(0)}%
      </span>
    </div>
  );
}

function OptionButtons<T extends string>({
  options,
  value,
  onChange,
}: {
  options: T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div style={{ display: "flex", gap: "6px", marginBottom: "16px", flexWrap: "wrap" }}>
      {options.map((opt) => (
        <button
          key={opt}
          className="opt-btn"
          data-active={value === opt}
          onClick={() => onChange(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <pre
        style={{
          background: "#0a0a0a",
          border: "1px solid #141414",
          borderRadius: "8px",
          padding: "20px 24px",
          paddingRight: "80px",
          overflow: "auto",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "13px",
          lineHeight: 1.7,
          color: "#777",
          margin: 0,
        }}
      >
        <code>{code}</code>
      </pre>
      <button
        onClick={() => {
          navigator.clipboard.writeText(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          padding: "4px 12px",
          borderRadius: "4px",
          border: "1px solid #1a1a1a",
          background: "#111",
          color: copied ? "#ef4444" : "#555",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "11px",
          cursor: "pointer",
          transition: "color 0.2s",
        }}
      >
        {copied ? "copied" : "copy"}
      </button>
    </div>
  );
}

function DemoSection({
  id,
  name,
  tag,
  description,
  code,
  children,
}: {
  id: string;
  name: string;
  tag?: string;
  description: string;
  code: string;
  children: ReactNode;
}) {
  return (
    <section id={id} style={{ padding: "56px 0", borderBottom: "1px solid #111" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          marginBottom: "8px",
        }}
      >
        <h2
          style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: "26px",
            fontWeight: 700,
            letterSpacing: "0.01em",
          }}
        >
          {name}
        </h2>
        <span className="component-tag">{tag || "component"}</span>
      </div>
      <p
        style={{
          fontSize: "15px",
          color: "#666",
          marginBottom: "32px",
          maxWidth: "600px",
          lineHeight: 1.6,
        }}
      >
        {description}
      </p>

      {/* Demo area */}
      <div className="demo-card" style={{ padding: "32px", marginBottom: "20px" }}>
        {children}
      </div>

      {/* Code */}
      <CodeBlock code={code} />
    </section>
  );
}

/* ════════════════════════════════════════════
   Component Demos
   ════════════════════════════════════════════ */

function ScenePlayground() {
  const [progress, setProgress] = useState(0.3);
  return (
    <DemoSection
      id="scene"
      name="Scene"
      description="Creates a pinned, scroll-driven scene. Provides a progress value (0→1) to children as you scroll through its duration. Uses CSS position: sticky under the hood."
      code={`<Scene duration="200vh">
  {(progress) => (
    <div style={{ opacity: progress }}>
      {Math.round(progress * 100)}%
    </div>
  )}
</Scene>`}
    >
      <ProgressSlider value={progress} onChange={setProgress} />
      <div
        style={{
          height: "200px",
          borderRadius: "8px",
          background: `radial-gradient(circle, rgba(220,38,38,${0.03 + progress * 0.15}) 0%, #0a0a0a 70%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: "72px",
            fontFamily: "'Rajdhani', sans-serif",
            fontWeight: 700,
            color: "#ef4444",
            opacity: 0.3 + progress * 0.7,
            transform: `scale(${0.7 + progress * 0.5})`,
            transition: "transform 0.1s, opacity 0.1s",
            textShadow: `0 0 ${progress * 40}px rgba(220, 38, 38, ${progress * 0.4})`,
          }}
        >
          {Math.round(progress * 100)}%
        </div>
      </div>
    </DemoSection>
  );
}

function TextRevealPlayground() {
  const [progress, setProgress] = useState(0.45);
  const [mode, setMode] = useState<"word" | "char" | "line">("word");
  return (
    <DemoSection
      id="textreveal"
      name="TextReveal"
      description="Progressively reveals text as scroll progresses. Supports word-by-word, character-by-character, or line-by-line reveal modes."
      code={`<TextReveal
  mode="word"
  progress={progress}
  at={0}
  span={0.8}
>
  Your text reveals progressively
  as the user scrolls.
</TextReveal>`}
    >
      <OptionButtons
        options={["word", "char", "line"] as ("word" | "char" | "line")[]}
        value={mode}
        onChange={setMode}
      />
      <ProgressSlider value={progress} onChange={setProgress} />
      <div
        style={{
          padding: "24px",
          fontSize: "22px",
          fontWeight: 600,
          lineHeight: 1.5,
          textAlign: "center",
          letterSpacing: "-0.01em",
          whiteSpace: mode === "line" ? "pre-line" : undefined,
        }}
      >
        <TextReveal progress={progress} mode={mode} at={0} span={0.8}>
          {mode === "line"
            ? "Cinematic scroll-driven storytelling.\nBuild immersive experiences.\nCore engine under 1 KB gzipped."
            : "Cinematic scroll-driven storytelling components for React. Build immersive experiences without the complexity."}
        </TextReveal>
      </div>
    </DemoSection>
  );
}

function RevealPlayground() {
  const [progress, setProgress] = useState(0);
  const [animation, setAnimation] = useState<
    "fade" | "fade-up" | "fade-down" | "scale" | "blur"
  >("fade-up");

  return (
    <DemoSection
      id="reveal"
      name="Reveal"
      description="Reveals elements with entrance animations triggered at a specific scroll progress. Five built-in animations: fade, fade-up, fade-down, scale, and blur."
      code={`<Reveal
  animation="fade-up"
  at={0.3}
  duration={600}
>
  <div>I appear on scroll!</div>
</Reveal>`}
    >
      <OptionButtons
        options={
          ["fade", "fade-up", "fade-down", "scale", "blur"] as (
            | "fade"
            | "fade-up"
            | "fade-down"
            | "scale"
            | "blur"
          )[]
        }
        value={animation}
        onChange={(v) => {
          setAnimation(v);
          setProgress(0);
        }}
      />
      <ProgressSlider value={progress} onChange={setProgress} />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "32px 0",
          minHeight: "140px",
          alignItems: "center",
        }}
      >
        <Reveal
          key={animation}
          animation={animation}
          progress={progress}
          at={0.2}
          duration={600}
        >
          <div
            className="gamer-card"
            style={{ padding: "28px 48px", textAlign: "center" }}
          >
            <div
              style={{
                fontSize: "20px",
                fontFamily: "'Rajdhani', sans-serif",
                fontWeight: 600,
                marginBottom: "6px",
              }}
            >
              Revealed!
            </div>
            <div style={{ fontSize: "13px", color: "#555" }}>
              animation: {animation}
            </div>
          </div>
        </Reveal>
      </div>
    </DemoSection>
  );
}

function CounterPlayground() {
  const [progress, setProgress] = useState(0.5);
  return (
    <DemoSection
      id="counter"
      name="Counter"
      description="Animates numbers from a start value to an end value based on scroll progress. Supports custom formatting, easing, and configurable start/span ranges."
      code={`<Counter
  from={0}
  to={1000}
  progress={progress}
  at={0}
  span={0.8}
  format={(n) => n.toFixed(0)}
/>`}
    >
      <ProgressSlider value={progress} onChange={setProgress} />
      <div
        style={{
          display: "flex",
          gap: "40px",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {[
          { label: "Integer", to: 1000, fmt: (n: number) => n.toFixed(0) },
          {
            label: "Percentage",
            to: 99.9,
            fmt: (n: number) => `${n.toFixed(1)}%`,
          },
          {
            label: "Currency",
            to: 50,
            fmt: (n: number) => `$${n.toFixed(0)}`,
          },
        ].map((c) => (
          <div key={c.label} style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "48px",
                fontFamily: "'Rajdhani', sans-serif",
                fontWeight: 700,
                color: "#ef4444",
                lineHeight: 1.1,
                textShadow: `0 0 30px rgba(220, 38, 38, ${progress * 0.3})`,
              }}
            >
              <Counter
                from={0}
                to={c.to}
                progress={progress}
                at={0}
                span={0.8}
                format={c.fmt}
              />
            </div>
            <span
              style={{
                fontSize: "12px",
                fontFamily: "'JetBrains Mono', monospace",
                color: "#444",
                letterSpacing: "0.08em",
              }}
            >
              {c.label}
            </span>
          </div>
        ))}
      </div>
    </DemoSection>
  );
}

function CompareSliderPlayground() {
  return (
    <DemoSection
      id="compareslider"
      name="CompareSlider"
      description="Side-by-side comparison slider. Supports drag interaction (default) or scroll-driven mode. Drag the handle below to see it in action."
      code={`<CompareSlider
  before={<img src="before.jpg" />}
  after={<img src="after.jpg" />}
/>

{/* Or scroll-driven: */}
<CompareSlider
  scrollDriven
  progress={progress}
  before={...}
  after={...}
/>`}
    >
      <div
        style={{
          maxWidth: "480px",
          margin: "0 auto",
          borderRadius: "10px",
          overflow: "hidden",
          border: "1px solid #1a1a1a",
        }}
      >
        <CompareSlider
          before={
            <div
              style={{
                width: "100%",
                height: "240px",
                background: "#0a0a0a",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  fontSize: "36px",
                  opacity: 0.08,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {"{ }"}
              </div>
              <span
                style={{
                  fontSize: "12px",
                  color: "#333",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                Before
              </span>
            </div>
          }
          after={
            <div
              style={{
                width: "100%",
                height: "240px",
                background:
                  "linear-gradient(135deg, #150808 0%, #1a0a0a 40%, #dc2626 100%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  fontSize: "36px",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {"{ }"}
              </div>
              <span
                style={{
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.7)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                After
              </span>
            </div>
          }
        />
      </div>
    </DemoSection>
  );
}

function MarqueePlayground() {
  const [direction, setDirection] = useState<"left" | "right">("left");
  return (
    <DemoSection
      id="marquee"
      name="Marquee"
      description="Infinite looping horizontal ticker. Configurable speed, direction, and gap. Pauses on hover by default. Respects prefers-reduced-motion."
      code={`<Marquee speed={40} direction="left" pauseOnHover>
  <span>Item 1</span>
  <span>Item 2</span>
  <span>Item 3</span>
</Marquee>`}
    >
      <OptionButtons
        options={["left", "right"] as ("left" | "right")[]}
        value={direction}
        onChange={setDirection}
      />
      <div
        style={{
          margin: "0 -32px",
          padding: "20px 0",
          borderTop: "1px solid #141414",
          borderBottom: "1px solid #141414",
        }}
      >
        <Marquee key={direction} speed={35} direction={direction} gap={48}>
          {[
            "Scene",
            "Reveal",
            "Parallax",
            "Counter",
            "TextReveal",
            "CompareSlider",
            "HorizontalScroll",
            "Progress",
            "Marquee",
          ].map((name) => (
            <span
              key={name}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "14px",
                color: "#333",
              }}
            >
              {"<"}
              <span style={{ color: "#551111" }}>{name}</span>
              {" />"}
            </span>
          ))}
        </Marquee>
      </div>
      <p
        style={{
          fontSize: "12px",
          color: "#444",
          marginTop: "16px",
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        hover to pause
      </p>
    </DemoSection>
  );
}

function ProgressPlayground() {
  const [progress, setProgress] = useState(0.6);
  const [type, setType] = useState<"bar" | "dots" | "ring">("ring");
  return (
    <DemoSection
      id="progress"
      name="Progress"
      description="Global scroll progress indicator. Three visual types: bar (horizontal/vertical), dots (discrete steps), and ring (circular SVG). Renders at a fixed viewport position."
      code={`<Progress
  type="bar"
  position="top"
  color="#dc2626"
/>

{/* Or with explicit progress: */}
<Progress
  type="ring"
  progress={progress}
  color="#dc2626"
  ringSize={48}
/>`}
    >
      <OptionButtons
        options={["bar", "dots", "ring"] as ("bar" | "dots" | "ring")[]}
        value={type}
        onChange={setType}
      />
      <ProgressSlider value={progress} onChange={setProgress} />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px 0",
          minHeight: "80px",
        }}
      >
        {type === "bar" && (
          <div style={{ width: "100%", maxWidth: "400px" }}>
            <div
              style={{
                height: "4px",
                background: "#1a1a1a",
                borderRadius: "2px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progress * 100}%`,
                  background: "#dc2626",
                  borderRadius: "2px",
                  transition: "width 0.1s",
                  boxShadow: "0 0 12px rgba(220, 38, 38, 0.4)",
                }}
              />
            </div>
          </div>
        )}
        {type === "ring" && (
          <Progress
            type="ring"
            progress={progress}
            color="#dc2626"
            ringSize={64}
          />
        )}
        {type === "dots" && (
          <Progress
            type="dots"
            progress={progress}
            color="#dc2626"
            dotCount={7}
          />
        )}
      </div>
      {type !== "bar" && (
        <p
          style={{
            fontSize: "12px",
            color: "#444",
            textAlign: "center",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {type === "ring"
            ? "ring renders as a fixed SVG overlay"
            : "dots indicate discrete progress steps"}
        </p>
      )}
    </DemoSection>
  );
}

/* ════════════════════════════════════════════
   Description-only sections
   ════════════════════════════════════════════ */

function ParallaxSection() {
  return (
    <DemoSection
      id="parallax"
      name="Parallax"
      description="Creates parallax scroll effects by moving elements at different speeds relative to scroll. Speed < 1 moves slower (background feel), speed > 1 moves faster (foreground). GPU-accelerated with CSS transforms."
      code={`<Parallax speed={0.5} direction="vertical">
  <img src="background.jpg" />
</Parallax>

<Parallax speed={1.5}>
  <div>I move faster than scroll</div>
</Parallax>`}
    >
      <div
        style={{
          display: "flex",
          gap: "16px",
          justifyContent: "center",
          alignItems: "end",
          padding: "20px 0",
        }}
      >
        {[
          { speed: 0.3, label: "0.3×", h: 80 },
          { speed: 0.6, label: "0.6×", h: 100 },
          { speed: 1.0, label: "1.0×", h: 120 },
          { speed: 1.5, label: "1.5×", h: 140 },
        ].map((p) => (
          <div key={p.speed} style={{ textAlign: "center" }}>
            <div
              style={{
                width: "60px",
                height: `${p.h}px`,
                background: `linear-gradient(to top, rgba(220,38,38,${p.speed * 0.3}), transparent)`,
                border: "1px solid rgba(220, 38, 38, 0.15)",
                borderRadius: "6px",
                marginBottom: "8px",
              }}
            />
            <span
              style={{
                fontSize: "12px",
                fontFamily: "'JetBrains Mono', monospace",
                color: "#555",
              }}
            >
              {p.label}
            </span>
          </div>
        ))}
      </div>
      <p
        style={{
          fontSize: "12px",
          color: "#444",
          textAlign: "center",
          marginTop: "8px",
        }}
      >
        See parallax in action on the{" "}
        <Link href="/" style={{ color: "#ef4444", textDecoration: "none" }}>
          landing page
        </Link>
      </p>
    </DemoSection>
  );
}

function HorizontalScrollSection() {
  return (
    <DemoSection
      id="horizontalscroll"
      name="HorizontalScroll"
      description="Converts vertical scrolling into horizontal panel movement. Wrap Panel children inside — each Panel takes up 100vw. Vertical scroll distance equals the number of panels × 100vh."
      code={`<HorizontalScroll>
  <Panel>
    <div>Slide 1</div>
  </Panel>
  <Panel>
    <div>Slide 2</div>
  </Panel>
  <Panel>
    <div>Slide 3</div>
  </Panel>
</HorizontalScroll>`}
    >
      <div
        style={{
          display: "flex",
          gap: "12px",
          overflow: "hidden",
          padding: "8px 0",
        }}
      >
        {["Panel 1", "Panel 2", "Panel 3", "Panel 4"].map((label, i) => (
          <div
            key={label}
            style={{
              minWidth: "160px",
              height: "100px",
              background: `linear-gradient(135deg, #111 0%, rgba(220,38,38,${0.05 + i * 0.04}) 100%)`,
              border: "1px solid #1a1a1a",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              color: "#555",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {label}
          </div>
        ))}
      </div>
      <p
        style={{
          fontSize: "12px",
          color: "#444",
          textAlign: "center",
          marginTop: "16px",
        }}
      >
        Requires vertical scroll space.{" "}
        <Link href="/" style={{ color: "#ef4444", textDecoration: "none" }}>
          See it on the landing page
        </Link>
      </p>
    </DemoSection>
  );
}

function VideoScrollSection() {
  return (
    <DemoSection
      id="videoscroll"
      name="VideoScroll"
      description="Scrubs a video frame-by-frame based on scroll position — the same technique Apple uses in keynote product pages. Pins the video while scrubbing. Supports overlay content via render function children."
      code={`<VideoScroll
  src="/hero.mp4"
  duration="300vh"
  pin
>
  {(progress) => (
    <div style={{ opacity: progress > 0.5 ? 1 : 0 }}>
      Overlay content appears midway
    </div>
  )}
</VideoScroll>`}
    >
      <div
        style={{
          height: "180px",
          background: "#0a0a0a",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          border: "1px solid #141414",
        }}
      >
        <div style={{ fontSize: "32px", opacity: 0.15 }}>▶</div>
        <span
          style={{
            fontSize: "13px",
            color: "#444",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          Provide an MP4 src to scrub on scroll
        </span>
      </div>
    </DemoSection>
  );
}

function StickyHeaderSection() {
  return (
    <DemoSection
      id="stickyheader"
      name="StickyHeader"
      tag="component"
      description="A fixed header that transitions from transparent to an opaque background with optional backdrop blur after scrolling past a configurable threshold. The header at the top of this page is a live StickyHeader."
      code={`<StickyHeader
  threshold={80}
  background="rgba(0, 0, 0, 0.9)"
  blur
>
  <nav>Your nav content</nav>
</StickyHeader>`}
    >
      <div
        style={{
          padding: "20px",
          textAlign: "center",
          fontSize: "13px",
          color: "#555",
        }}
      >
        ↑ The header above is a live{" "}
        <code
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            color: "#ef4444",
            fontSize: "12px",
          }}
        >
          {"<StickyHeader>"}
        </code>{" "}
        — scroll to see it transition
      </div>
    </DemoSection>
  );
}

function KinoSection() {
  return (
    <DemoSection
      id="kino"
      name="Kino"
      tag="provider"
      description="Root provider that initializes the global scroll tracker. All scroll-driven components must be wrapped inside Kino. Also exposes a useKino() hook for accessing the scroll tracker directly."
      code={`import { Kino, Scene, Progress } from "react-kino";

export default function App() {
  return (
    <Kino>
      <Progress type="bar" position="top" />
      <Scene duration="200vh">
        {(progress) => <div>{progress}</div>}
      </Scene>
    </Kino>
  );
}`}
    >
      <div
        style={{
          padding: "20px",
          textAlign: "center",
          fontSize: "13px",
          color: "#555",
        }}
      >
        This entire playground is wrapped in{" "}
        <code
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            color: "#ef4444",
            fontSize: "12px",
          }}
        >
          {"<Kino>"}
        </code>
      </div>
    </DemoSection>
  );
}

/* ════════════════════════════════════════════
   Hooks Section
   ════════════════════════════════════════════ */

function HooksSection() {
  const hooks = [
    {
      name: "useScrollProgress",
      desc: "Returns the global page scroll progress as a number from 0 to 1. Used internally by Progress and other components.",
      code: `const progress = useScrollProgress();
// 0 at top of page → 1 at bottom`,
    },
    {
      name: "useSceneProgress",
      desc: "Tracks scroll progress within a specific element. Takes a ref and duration in pixels, returns 0→1 progress.",
      code: `const ref = useRef<HTMLDivElement>(null);
const progress = useSceneProgress(ref, 1000);`,
    },
    {
      name: "useIsClient",
      desc: "SSR hydration guard. Returns false during server render, true after client hydration. Use to protect scroll-dependent calculations.",
      code: `const isClient = useIsClient();
if (!isClient) return <Fallback />;`,
    },
  ];

  return (
    <section id="hooks" style={{ padding: "56px 0" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          marginBottom: "8px",
        }}
      >
        <h2
          style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: "26px",
            fontWeight: 700,
          }}
        >
          Hooks
        </h2>
        <span className="component-tag">3 hooks</span>
      </div>
      <p
        style={{
          fontSize: "15px",
          color: "#666",
          marginBottom: "32px",
          maxWidth: "600px",
          lineHeight: 1.6,
        }}
      >
        Low-level hooks for custom scroll-driven logic.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {hooks.map((h) => (
          <div key={h.name} className="demo-card" style={{ padding: "24px" }}>
            <code
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "15px",
                color: "#ef4444",
                display: "block",
                marginBottom: "8px",
              }}
            >
              {h.name}()
            </code>
            <p
              style={{
                fontSize: "14px",
                color: "#666",
                marginBottom: "16px",
                lineHeight: 1.5,
              }}
            >
              {h.desc}
            </p>
            <CodeBlock code={h.code} />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   Nav Items
   ════════════════════════════════════════════ */

const NAV_ITEMS = [
  { id: "scene", label: "Scene" },
  { id: "textreveal", label: "TextReveal" },
  { id: "reveal", label: "Reveal" },
  { id: "counter", label: "Counter" },
  { id: "compareslider", label: "CompareSlider" },
  { id: "marquee", label: "Marquee" },
  { id: "progress", label: "Progress" },
  { id: "parallax", label: "Parallax" },
  { id: "horizontalscroll", label: "HorizontalScroll" },
  { id: "videoscroll", label: "VideoScroll" },
  { id: "stickyheader", label: "StickyHeader" },
  { id: "kino", label: "Kino" },
  { id: "hooks", label: "Hooks" },
];

/* ════════════════════════════════════════════
   Page
   ════════════════════════════════════════════ */

export default function PlaygroundPage() {
  const [activeId, setActiveId] = useState("scene");
  const navRef = useRef<HTMLDivElement>(null);

  // Track which section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );

    NAV_ITEMS.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Auto-scroll nav to keep active item visible
  useEffect(() => {
    if (!navRef.current) return;
    const activeEl = navRef.current.querySelector(`[data-active="true"]`);
    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeId]);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        const headerOffset = 110; // sticky header + nav strip height
        const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    },
    []
  );

  return (
    <div className="landing-page" style={{ minHeight: "100vh" }}>
      <Kino>
        <StickyHeader threshold={60} background="rgba(8, 8, 8, 0.92)" blur>
          <div className="site-nav">
            <Link href="/" className="site-nav-logo">
              react-<span>kino</span>
            </Link>
            <div className="site-nav-links">
              <Link href="/playground" className="nav-link" data-active="true">
                Playground
              </Link>
              <Link href="/docs" className="nav-link">
                Docs
              </Link>
              <a
                href="https://github.com/bilaltahir/react-kino"
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
        <div
          style={{
            padding: "120px 24px 40px",
            maxWidth: "800px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <h1
            className="section-heading"
            style={{
              fontSize: "clamp(36px, 6vw, 64px)",
              marginBottom: "16px",
              textShadow: "0 0 60px rgba(220, 38, 38, 0.1)",
            }}
          >
            Component Playground
          </h1>
          <p style={{ fontSize: "16px", color: "#666", lineHeight: 1.6 }}>
            Interactive demos for every react-kino component.
            <br />
            Drag the sliders to simulate scroll progress.
          </p>
        </div>

        {/* Component nav strip */}
        <nav className="playground-nav" ref={navRef}>
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="playground-nav-item"
              data-active={activeId === item.id}
              onClick={(e) => handleNavClick(e, item.id)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Demos */}
        <main style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px" }}>
          <ScenePlayground />
          <TextRevealPlayground />
          <RevealPlayground />
          <CounterPlayground />
          <CompareSliderPlayground />
          <MarqueePlayground />
          <ProgressPlayground />
          <ParallaxSection />
          <HorizontalScrollSection />
          <VideoScrollSection />
          <StickyHeaderSection />
          <KinoSection />
          <HooksSection />
        </main>

        {/* Footer */}
        <footer
          style={{
            padding: "60px 24px",
            textAlign: "center",
            borderTop: "1px solid #141414",
            marginTop: "40px",
          }}
        >
          <p style={{ fontSize: "14px", color: "#444", marginBottom: "16px" }}>
            All 12 components + 3 hooks documented above.
          </p>
          <div style={{ display: "flex", gap: "24px", justifyContent: "center" }}>
            <Link href="/" className="nav-link" style={{ color: "#dc2626" }}>
              ← Home
            </Link>
            <Link href="/docs" className="nav-link" style={{ color: "#dc2626" }}>
              Full Docs →
            </Link>
          </div>
        </footer>
      </Kino>
    </div>
  );
}
