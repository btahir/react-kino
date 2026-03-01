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
} from "react-kino";
import Link from "next/link";
import { useState } from "react";

function Hero() {
  return (
    <section
      style={{
        position: "relative",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <Parallax speed={0.3}>
        <div
          style={{
            position: "absolute",
            inset: "-50%",
            backgroundImage:
              "radial-gradient(circle at 50% 50%, rgba(220, 38, 38, 0.08) 0%, transparent 60%), " +
              "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), " +
              "linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
            backgroundSize: "100% 100%, 80px 80px, 80px 80px",
            backgroundPosition: "center, center, center",
          }}
        />
      </Parallax>

      <Parallax speed={1.1}>
        <div
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            maxWidth: "900px",
            padding: "0 24px",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(56px, 8vw, 120px)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              marginBottom: "24px",
            }}
          >
            react-
            <span
              style={{
                background:
                  "linear-gradient(135deg, #dc2626 0%, #f87171 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              kino
            </span>
          </h1>

          <p
            style={{
              fontSize: "clamp(16px, 2vw, 20px)",
              lineHeight: 1.7,
              color: "#888888",
              maxWidth: "600px",
              margin: "0 auto 40px",
            }}
          >
            Cinematic scroll-driven storytelling for React.
            <br />
            Apple-style scroll experiences in under 3&nbsp;KB.
          </p>

          <div
            style={{
              display: "flex",
              gap: "16px",
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: "24px",
            }}
          >
            <code
              style={{
                display: "inline-block",
                fontSize: "15px",
                fontFamily: "'SF Mono', 'Fira Code', monospace",
                background: "#1a1a1a",
                border: "1px solid #2a2a2a",
                borderRadius: "8px",
                padding: "12px 20px",
                color: "#f87171",
              }}
            >
              npm install react-kino
            </code>
          </div>

          <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
            <Link
              href="/docs"
              style={{
                display: "inline-block",
                padding: "12px 32px",
                background: "#dc2626",
                borderRadius: "999px",
                fontSize: "16px",
                fontWeight: 500,
                color: "#ffffff",
                textDecoration: "none",
              }}
            >
              Documentation
            </Link>
            <a
              href="https://github.com/bilaltahir/react-kino"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                padding: "12px 32px",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "999px",
                fontSize: "16px",
                fontWeight: 500,
                color: "#ffffff",
                textDecoration: "none",
              }}
            >
              GitHub
            </a>
          </div>
        </div>
      </Parallax>

      <div
        style={{
          position: "absolute",
          bottom: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "14px",
          color: "#555555",
          letterSpacing: "0.05em",
        }}
      >
        Scroll to explore
      </div>
    </section>
  );
}

function SceneDemo() {
  return (
    <Scene duration="120vh">
      {(progress) => (
        <div
          style={{
            width: "100%",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: `radial-gradient(ellipse at 50% 50%, rgba(124,58,237,${0.12 + 0.18 * progress}) 0%, #0a0a0a 70%)`,
            padding: "0 24px",
          }}
        >
          <p
            style={{
              fontSize: "13px",
              fontWeight: 500,
              color: "#dc2626",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              marginBottom: "32px",
              opacity: 0.8,
            }}
          >
            {"<Scene>"}
          </p>
          <div
            style={{
              fontSize: "clamp(80px, 15vw, 180px)",
              fontWeight: 700,
              fontFamily: "'SF Mono', 'Fira Code', 'Fira Mono', monospace",
              letterSpacing: "-0.04em",
              lineHeight: 1,
              marginBottom: "24px",
              background: `linear-gradient(135deg, #ffffff ${Math.max(0, 80 - progress * 100)}%, #f87171 ${100 - progress * 60}%, #dc2626 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {Math.round(progress * 100)}%
          </div>
          <p style={{ fontSize: "15px", color: "#555555" }}>scene progress</p>

          {/* Visual element that transforms with progress */}
          <div
            style={{
              marginTop: "40px",
              display: "flex",
              gap: "8px",
              alignItems: "center",
            }}
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  width: "4px",
                  height: `${20 + progress * 40 * (i === 2 ? 1.5 : i === 1 || i === 3 ? 1.2 : 0.8)}px`,
                  background: `rgba(220, 38, 38, ${0.3 + progress * 0.7})`,
                  borderRadius: "2px",
                  transition: "height 0.1s ease",
                }}
              />
            ))}
          </div>
        </div>
      )}
    </Scene>
  );
}

function TextRevealDemo() {
  return (
    <Scene duration="150vh">
      {(progress) => (
        <div
          style={{
            width: "100%",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 24px",
          }}
        >
          <p
            style={{
              fontSize: "13px",
              fontWeight: 500,
              color: "#dc2626",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              marginBottom: "40px",
              opacity: 0.8,
            }}
          >
            {"<TextReveal>"}
          </p>
          <div
            style={{
              maxWidth: "700px",
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 600,
              lineHeight: 1.4,
              letterSpacing: "-0.02em",
              textAlign: "center",
            }}
          >
            <TextReveal progress={progress} mode="word" at={0.0} span={0.75}>
              Scroll-driven storytelling components for React. Build cinematic
              experiences without the complexity.
            </TextReveal>
          </div>
        </div>
      )}
    </Scene>
  );
}

function CounterDemo() {
  return (
    <Scene duration="120vh">
      {(progress) => (
        <div
          style={{
            width: "100%",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 24px",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(36px, 5vw, 64px)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              marginBottom: "12px",
              textAlign: "center",
              opacity: Math.min(1, progress * 8),
            }}
          >
            Numbers that move.
          </h2>
          <p
            style={{
              fontSize: "17px",
              lineHeight: 1.7,
              color: "#888888",
              marginBottom: "56px",
              textAlign: "center",
              opacity: Math.min(1, progress * 6),
            }}
          >
            Animated counters driven by scroll progress.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "24px",
              maxWidth: "800px",
              width: "100%",
            }}
          >
            {[
              { label: "Bundle size", to: 3, fmt: (n: number) => `${n.toFixed(1)} KB` },
              { label: "Dependencies", to: 0, fmt: (n: number) => `${n}` },
              { label: "Components", to: 12, fmt: (n: number) => `${n}` },
            ].map((stat, i) => (
              <div key={stat.label} style={{ textAlign: "center", padding: "24px 8px" }}>
                <div
                  style={{
                    fontSize: "clamp(36px, 5vw, 64px)",
                    fontWeight: 700,
                    color: "#f87171",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.1,
                    marginBottom: "8px",
                  }}
                >
                  <Counter
                    from={0}
                    to={stat.to}
                    at={0.05 + i * 0.05}
                    span={0.5}
                    progress={progress}
                    format={stat.fmt}
                  />
                </div>
                <span
                  style={{
                    fontSize: "13px",
                    color: "#555555",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Scene>
  );
}

function CompareDemo() {
  return (
    <Scene duration="150vh">
      {(progress) => (
        <div
          style={{
            width: "100%",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 24px",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(36px, 5vw, 64px)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              marginBottom: "12px",
              textAlign: "center",
              opacity: Math.min(1, progress * 8),
            }}
          >
            Before &amp; After.
          </h2>
          <p
            style={{
              fontSize: "17px",
              lineHeight: 1.7,
              color: "#888888",
              marginBottom: "40px",
              textAlign: "center",
              opacity: Math.min(1, progress * 6),
            }}
          >
            Scroll-driven comparison slider.
          </p>

          <div
            style={{
              maxWidth: "640px",
              width: "100%",
              borderRadius: "16px",
              overflow: "hidden",
              border: "1px solid #2a2a2a",
            }}
          >
            <CompareSlider
              scrollDriven
              progress={progress}
              before={
                <div
                  style={{
                    width: "100%",
                    height: "360px",
                    background: "#111111",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "16px",
                    fontFamily: "'SF Mono', 'Fira Code', monospace",
                  }}
                >
                  <div style={{ fontSize: "48px", opacity: 0.15 }}>{"{ }"}</div>
                  <div style={{ fontSize: "14px", color: "#444", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    Without react-kino
                  </div>
                  <div style={{ fontSize: "13px", color: "#333" }}>Static content</div>
                </div>
              }
              after={
                <div
                  style={{
                    width: "100%",
                    height: "360px",
                    background: "linear-gradient(135deg, #1a0a0a 0%, #2d1010 40%, #dc2626 100%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "16px",
                    fontFamily: "'SF Mono', 'Fira Code', monospace",
                  }}
                >
                  <div style={{ fontSize: "48px" }}>{"{ }"}</div>
                  <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    With react-kino
                  </div>
                  <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>Cinematic scroll experience</div>
                </div>
              }
            />
          </div>
        </div>
      )}
    </Scene>
  );
}

function HorizontalDemo() {
  const features = [
    { icon: "//", title: "Zero dependencies", description: "Only React as a peer dependency. Nothing else." },
    { icon: "<>", title: "Declarative API", description: "Compose scenes and animations like JSX." },
    { icon: ">>", title: "GPU accelerated", description: "CSS transforms and will-change for 60fps." },
    { icon: "a11y", title: "Accessible", description: "Respects prefers-reduced-motion out of the box." },
  ];

  return (
    <section>
      <div
        style={{
          textAlign: "center",
          maxWidth: "600px",
          margin: "0 auto",
          padding: "80px 24px 40px",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(36px, 5vw, 64px)",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
            marginBottom: "12px",
          }}
        >
          Features worth scrolling for.
        </h2>
        <p style={{ fontSize: "17px", lineHeight: 1.7, color: "#888888" }}>
          Vertical scroll, horizontal motion. Keep scrolling.
        </p>
      </div>
      <HorizontalScroll>
        {features.map((f) => (
          <Panel key={f.title}>
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px",
              }}
            >
              <div
                style={{
                  background: "#1a1a1a",
                  border: "1px solid #2a2a2a",
                  borderRadius: "16px",
                  padding: "48px 40px",
                  maxWidth: "360px",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    fontSize: "24px",
                    fontFamily: "'SF Mono', 'Fira Code', monospace",
                    color: "#dc2626",
                    marginBottom: "20px",
                    fontWeight: 700,
                  }}
                >
                  {f.icon}
                </div>
                <h3
                  style={{
                    fontSize: "22px",
                    fontWeight: 600,
                    marginBottom: "8px",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {f.title}
                </h3>
                <p style={{ fontSize: "16px", color: "#888888", lineHeight: 1.6 }}>
                  {f.description}
                </p>
              </div>
            </div>
          </Panel>
        ))}
      </HorizontalScroll>
    </section>
  );
}

function Footer() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("npm install react-kino").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <footer
      style={{
        padding: "100px 24px 60px",
        textAlign: "center",
        borderTop: "1px solid #1a1a1a",
      }}
    >
      <h2
        style={{
          fontSize: "clamp(32px, 4vw, 56px)",
          fontWeight: 700,
          letterSpacing: "-0.04em",
          lineHeight: 1.1,
          marginBottom: "12px",
        }}
      >
        react-kino
      </h2>
      <p
        style={{
          fontSize: "18px",
          color: "#888888",
          lineHeight: 1.7,
          marginBottom: "40px",
        }}
      >
        Cinematic scroll-driven storytelling for React.
      </p>

      <button
        onClick={handleCopy}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "12px",
          background: "#1a1a1a",
          border: "1px solid #2a2a2a",
          borderRadius: "12px",
          padding: "16px 24px",
          cursor: "pointer",
          marginBottom: "32px",
          color: "#ffffff",
        }}
      >
        <code
          style={{
            fontSize: "15px",
            fontFamily: "'SF Mono', 'Fira Code', monospace",
          }}
        >
          npm install react-kino
        </code>
        <span style={{ fontSize: "13px", color: "#555555" }}>
          {copied ? "Copied!" : "Click to copy"}
        </span>
      </button>

      <div
        style={{
          display: "flex",
          gap: "24px",
          justifyContent: "center",
          marginBottom: "40px",
        }}
      >
        <Link
          href="/docs"
          style={{ fontSize: "15px", color: "#dc2626", textDecoration: "none" }}
        >
          Documentation
        </Link>
        <a
          href="https://github.com/bilaltahir/react-kino"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: "15px", color: "#dc2626", textDecoration: "none" }}
        >
          GitHub
        </a>
      </div>

      <p style={{ fontSize: "13px", color: "#333333" }}>Built with react-kino</p>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="landing-page">
      <Kino>
        <Progress type="bar" position="top" color="#dc2626" />
        <Hero />
        <SceneDemo />
        <TextRevealDemo />
        <CounterDemo />
        <CompareDemo />
        <HorizontalDemo />
        <Footer />
      </Kino>
    </div>
  );
}
