"use client";
import React, { type CSSProperties } from "react";
import {
  Kino,
  Scene,
  Reveal,
  Parallax,
  Counter,
  HorizontalScroll,
  Panel,
  Progress,
} from "react-kino";

interface ProductLaunchProps {
  /** Product name */
  name: string;
  /** Product tagline */
  tagline: string;
  /** Hero background color or gradient */
  heroBackground?: string;
  /** Brand accent color */
  accentColor?: string;
  /** Stats to display in the counter section */
  stats?: Array<{
    value: number;
    label: string;
    format?: (n: number) => string;
  }>;
  /** Feature panels for horizontal scroll */
  features?: Array<{ title: string; description: string; icon?: string }>;
}

const defaultStats: NonNullable<ProductLaunchProps["stats"]> = [
  { value: 10, label: "Times faster", format: (n: number) => `${n}x` },
  { value: 99.9, label: "Uptime", format: (n: number) => `${n.toFixed(1)}%` },
  {
    value: 50000,
    label: "Users worldwide",
    format: (n: number) => n.toLocaleString() + "+",
  },
];

const defaultFeatures: NonNullable<ProductLaunchProps["features"]> = [
  {
    title: "Lightning Fast",
    description:
      "Built from the ground up for speed. Every millisecond counts.",
    icon: "\u26A1",
  },
  {
    title: "Beautifully Crafted",
    description:
      "Pixel-perfect design that looks stunning on every screen size.",
    icon: "\u2728",
  },
  {
    title: "Infinitely Scalable",
    description:
      "From prototype to production, it grows with your ambitions.",
    icon: "\uD83D\uDE80",
  },
];

export function ProductLaunch({
  name,
  tagline,
  heroBackground = "linear-gradient(135deg, #0a0a0a 0%, #1a0a0a 100%)",
  accentColor = "#dc2626",
  stats: statsProp,
  features: featuresProp,
}: ProductLaunchProps) {
  const stats = statsProp ?? defaultStats;
  const features = featuresProp ?? defaultFeatures;
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

  return (
    <div style={baseStyle}>
      <Kino>
        <Progress color={accentColor} position="top" />

        {/* Hero Section */}
        <div style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
          <Parallax speed={0.5}>
            <div
              style={{
                position: "absolute",
                inset: "-20%",
                background: heroBackground,
              }}
            />
          </Parallax>
          <div
            style={{
              ...sectionCenter,
              position: "relative",
              zIndex: 1,
            }}
          >
            <h1
              style={{
                fontSize: "clamp(3rem, 10vw, 8rem)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1,
                margin: 0,
                background: `linear-gradient(135deg, #ffffff 0%, ${accentColor} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {name}
            </h1>
            <p
              style={{
                fontSize: "clamp(1.125rem, 2.5vw, 1.5rem)",
                color: "rgba(255, 255, 255, 0.6)",
                marginTop: "24px",
                maxWidth: "600px",
                lineHeight: 1.6,
              }}
            >
              {tagline}
            </p>
          </div>
        </div>

        {/* Reveal Section - Three feature cards */}
        <Scene duration="150vh">
          <div style={sectionCenter}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "32px",
                maxWidth: "1000px",
                width: "100%",
                padding: "0 24px",
              }}
            >
              {[
                {
                  label: "Built for",
                  value: "Performance",
                  desc: "Zero compromises on speed. Every interaction feels instant.",
                },
                {
                  label: "Designed for",
                  value: "Developers",
                  desc: "Clean APIs, comprehensive docs, and a delightful DX.",
                },
                {
                  label: "Made for",
                  value: "Scale",
                  desc: "From side project to enterprise. No ceiling on growth.",
                },
              ].map((card, i) => (
                <Reveal
                  key={card.value}
                  at={0.2 + i * 0.2}
                  animation="fade-up"
                  duration={800}
                >
                  <div
                    style={{
                      padding: "40px 32px",
                      borderRadius: "16px",
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.06)",
                      backdropFilter: "blur(12px)",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.875rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        color: accentColor,
                        margin: 0,
                      }}
                    >
                      {card.label}
                    </p>
                    <h2
                      style={{
                        fontSize: "2rem",
                        fontWeight: 700,
                        margin: "8px 0 16px",
                      }}
                    >
                      {card.value}
                    </h2>
                    <p
                      style={{
                        color: "rgba(255, 255, 255, 0.5)",
                        margin: 0,
                        lineHeight: 1.6,
                      }}
                    >
                      {card.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Scene>

        {/* Stats Section */}
        {stats.length > 0 && (
          <Scene duration="150vh">
            <div style={sectionCenter}>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: "64px",
                }}
              >
                {stats.map((stat, i) => (
                  <div key={stat.label} style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontSize: "clamp(2.5rem, 6vw, 5rem)",
                        fontWeight: 800,
                        letterSpacing: "-0.02em",
                        background: `linear-gradient(135deg, #ffffff 0%, ${accentColor} 100%)`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      <Counter
                        from={0}
                        to={stat.value}
                        at={0.15 + i * 0.15}
                        span={0.4}
                        format={stat.format}
                      />
                    </div>
                    <p
                      style={{
                        fontSize: "1rem",
                        color: "rgba(255, 255, 255, 0.5)",
                        marginTop: "8px",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Scene>
        )}

        {/* Features - Horizontal Scroll */}
        {features.length > 0 && (
          <HorizontalScroll>
            {features.map((feature) => (
              <Panel key={feature.title}>
                <div
                  style={{
                    ...sectionCenter,
                    background:
                      "radial-gradient(ellipse at center, rgba(124, 58, 237, 0.08) 0%, transparent 70%)",
                  }}
                >
                  {feature.icon && (
                    <span style={{ fontSize: "4rem", marginBottom: "24px" }}>
                      {feature.icon}
                    </span>
                  )}
                  <h3
                    style={{
                      fontSize: "clamp(2rem, 5vw, 3.5rem)",
                      fontWeight: 700,
                      margin: 0,
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "clamp(1rem, 2vw, 1.25rem)",
                      color: "rgba(255, 255, 255, 0.5)",
                      marginTop: "16px",
                      maxWidth: "480px",
                      lineHeight: 1.6,
                    }}
                  >
                    {feature.description}
                  </p>
                </div>
              </Panel>
            ))}
          </HorizontalScroll>
        )}

        {/* CTA Section */}
        <div
          style={{
            ...sectionCenter,
            background: `radial-gradient(ellipse at center, ${accentColor}15 0%, transparent 70%)`,
          }}
        >
          <h2
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            Ready for {name}?
          </h2>
          <p
            style={{
              fontSize: "clamp(1rem, 2vw, 1.25rem)",
              color: "rgba(255, 255, 255, 0.5)",
              marginTop: "16px",
              marginBottom: "40px",
            }}
          >
            Join thousands of teams already building with {name}.
          </p>
          <button
            style={{
              padding: "16px 40px",
              fontSize: "1.125rem",
              fontWeight: 600,
              color: "#ffffff",
              background: accentColor,
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              transition: "transform 150ms ease, box-shadow 150ms ease",
              boxShadow: `0 0 40px ${accentColor}40`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = `0 0 60px ${accentColor}60`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = `0 0 40px ${accentColor}40`;
            }}
          >
            Get Started
          </button>
        </div>
      </Kino>
    </div>
  );
}
