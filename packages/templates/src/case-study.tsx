import React, { type CSSProperties } from "react";
import { Kino, Scene, Reveal, Parallax, Counter, Progress } from "react-kino";

interface CaseStudyProps {
  /** Project title */
  title: string;
  /** Client name */
  client: string;
  /** Year of project */
  year: string | number;
  /** Optional hero background image URL */
  heroImage?: string;
  /** Project overview text */
  overview: string;
  /** The challenge faced */
  challenge: string;
  /** The solution delivered */
  solution: string;
  /** Measurable results */
  results?: Array<{
    metric: string;
    value: number;
    format?: (n: number) => string;
  }>;
  /** Link to the next project */
  nextProject?: { title: string; href: string };
}

export function CaseStudy({
  title,
  client,
  year,
  heroImage,
  overview,
  challenge,
  solution,
  results = [],
  nextProject,
}: CaseStudyProps) {
  const baseStyle: CSSProperties = {
    margin: 0,
    padding: 0,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    color: "#ffffff",
    background: "#0a0a0a",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
  };

  const sectionCenter: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    padding: "0 24px",
    textAlign: "center",
  };

  const overviewParagraphs = overview
    .split(/\n\n|\n/)
    .filter((p) => p.trim().length > 0);

  return (
    <div style={baseStyle}>
      <Kino>
        <Progress color="#e5e5e5" position="top" />

        {/* Hero */}
        <div
          style={{
            position: "relative",
            height: "100vh",
            overflow: "hidden",
          }}
        >
          <Parallax speed={0.4}>
            <div
              style={{
                position: "absolute",
                inset: "-20%",
                background: heroImage
                  ? `url(${heroImage}) center/cover no-repeat`
                  : "linear-gradient(160deg, #111 0%, #1a1a2e 50%, #0a0a0a 100%)",
              }}
            />
            {heroImage && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)",
                }}
              />
            )}
          </Parallax>
          <div
            style={{
              ...sectionCenter,
              position: "relative",
              zIndex: 1,
              gap: "16px",
            }}
          >
            <p
              style={{
                fontSize: "0.875rem",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "rgba(255, 255, 255, 0.5)",
                margin: 0,
              }}
            >
              {client} &middot; {year}
            </p>
            <h1
              style={{
                fontSize: "clamp(2.5rem, 8vw, 6rem)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
                margin: 0,
                maxWidth: "900px",
              }}
            >
              {title}
            </h1>
          </div>
        </div>

        {/* Overview */}
        <Scene duration="200vh">
          <div style={sectionCenter}>
            <div style={{ maxWidth: "680px" }}>
              <Reveal at={0.1} animation="fade-up">
                <p
                  style={{
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                    color: "rgba(255, 255, 255, 0.35)",
                    marginBottom: "32px",
                  }}
                >
                  Overview
                </p>
              </Reveal>
              {overviewParagraphs.map((paragraph, i) => {
                const step =
                  overviewParagraphs.length > 1
                    ? 0.6 / (overviewParagraphs.length - 1)
                    : 0;
                return (
                  <Reveal
                    key={i}
                    at={0.2 + i * step}
                    animation="fade-up"
                    duration={800}
                  >
                    <p
                      style={{
                        fontSize: "clamp(1.125rem, 2.5vw, 1.5rem)",
                        lineHeight: 1.7,
                        color: "rgba(255, 255, 255, 0.7)",
                        margin: "0 0 24px",
                      }}
                    >
                      {paragraph}
                    </p>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </Scene>

        {/* Challenge & Solution */}
        <Scene duration="250vh">
          <div style={sectionCenter}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "64px",
                maxWidth: "1000px",
                width: "100%",
                padding: "0 24px",
                textAlign: "left",
              }}
            >
              <Reveal at={0.2} animation="fade-up" duration={800}>
                <div>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.2em",
                      color: "#ef4444",
                      marginBottom: "16px",
                    }}
                  >
                    The Challenge
                  </p>
                  <p
                    style={{
                      fontSize: "clamp(1rem, 2vw, 1.25rem)",
                      lineHeight: 1.7,
                      color: "rgba(255, 255, 255, 0.7)",
                      margin: 0,
                    }}
                  >
                    {challenge}
                  </p>
                </div>
              </Reveal>
              <Reveal at={0.6} animation="fade-up" duration={800}>
                <div>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.2em",
                      color: "#22c55e",
                      marginBottom: "16px",
                    }}
                  >
                    The Solution
                  </p>
                  <p
                    style={{
                      fontSize: "clamp(1rem, 2vw, 1.25rem)",
                      lineHeight: 1.7,
                      color: "rgba(255, 255, 255, 0.7)",
                      margin: 0,
                    }}
                  >
                    {solution}
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </Scene>

        {/* Results */}
        {results.length > 0 && (
          <Scene duration="150vh">
            <div style={sectionCenter}>
              <Reveal at={0.1} animation="fade">
                <p
                  style={{
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                    color: "rgba(255, 255, 255, 0.35)",
                    marginBottom: "48px",
                  }}
                >
                  Results
                </p>
              </Reveal>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: "64px",
                }}
              >
                {results.map((result, i) => (
                  <div key={result.metric} style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                        fontWeight: 800,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      <Counter
                        from={0}
                        to={result.value}
                        at={0.2 + i * 0.15}
                        span={0.35}
                        format={result.format}
                      />
                    </div>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "rgba(255, 255, 255, 0.5)",
                        marginTop: "8px",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {result.metric}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Scene>
        )}

        {/* Next Project */}
        {nextProject && (
          <div style={sectionCenter}>
            <p
              style={{
                fontSize: "0.875rem",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "rgba(255, 255, 255, 0.35)",
                margin: "0 0 24px",
              }}
            >
              Next Project
            </p>
            <a
              href={nextProject.href}
              style={{
                fontSize: "clamp(2rem, 5vw, 4rem)",
                fontWeight: 700,
                color: "#ffffff",
                textDecoration: "none",
                letterSpacing: "-0.02em",
                transition: "opacity 150ms ease",
                lineHeight: 1.2,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.6";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              {nextProject.title} &rarr;
            </a>
          </div>
        )}
      </Kino>
    </div>
  );
}
