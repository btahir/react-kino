import React, { type CSSProperties } from "react";
import {
  Kino,
  Scene,
  Reveal,
  Parallax,
  TextReveal,
  HorizontalScroll,
  Panel,
  Progress,
  StickyHeader,
  ScrollTransform,
  Marquee,
} from "react-kino";

interface PortfolioProps {
  /** Your name */
  name: string;
  /** Your role / title */
  role: string;
  /** Short bio text */
  bio: string;
  /** Accent color for highlights */
  accentColor?: string;
  /** Portfolio projects */
  projects?: Array<{
    title: string;
    description: string;
    year: string | number;
    tags?: string[];
  }>;
  /** List of skills */
  skills?: string[];
  /** Contact email address */
  contactEmail?: string;
  /** Optional navigation items for sticky header */
  navItems?: Array<{ label: string; href?: string }>;
  /** Show scroll-down hint on hero. Default: true */
  showScrollHint?: boolean;
  /** Custom items for the skills marquee ticker */
  marqueeItems?: string[];
}

export function Portfolio({
  name,
  role,
  bio,
  accentColor = "#3b82f6",
  projects = [],
  skills = [],
  contactEmail,
  navItems,
  showScrollHint = true,
  marqueeItems,
}: PortfolioProps) {
  const baseStyle: CSSProperties = {
    margin: 0,
    padding: 0,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    color: "#ffffff",
    background: "#050505",
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

  const tickerItems = marqueeItems ?? skills;

  return (
    <div style={baseStyle}>
      <Kino>
        <Progress color={accentColor} position="top" />

        {/* Sticky Header */}
        <StickyHeader
          threshold={40}
          background="rgba(0, 0, 0, 0.72)"
          blur
          style={{ borderBottom: "0.5px solid rgba(255,255,255,0.08)" }}
        >
          <div
            style={{
              maxWidth: "980px",
              margin: "0 auto",
              height: "48px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 24px",
            }}
          >
            <span
              style={{ fontSize: "0.875rem", fontWeight: 600, color: "#fff" }}
            >
              {name}
            </span>
            <div
              style={{ display: "flex", alignItems: "center", gap: "24px" }}
            >
              {navItems && navItems.length > 0 && (
                <nav style={{ display: "flex", gap: "20px" }}>
                  {navItems.map((item) => (
                    <a
                      key={item.label}
                      href={item.href ?? "#"}
                      style={{
                        fontSize: "0.8rem",
                        color: "rgba(255,255,255,0.6)",
                        textDecoration: "none",
                      }}
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              )}
              {contactEmail && (
                <a
                  href={`mailto:${contactEmail}`}
                  style={{
                    fontSize: "0.8rem",
                    color: "rgba(255,255,255,0.6)",
                    textDecoration: "none",
                  }}
                >
                  {contactEmail}
                </a>
              )}
            </div>
          </div>
        </StickyHeader>

        {/* Hero with ScrollTransform */}
        <Scene duration="150vh">
          {(progress) => (
            <div
              style={{
                position: "relative",
                height: "100vh",
                overflow: "hidden",
              }}
            >
              <Parallax speed={0.3}>
                <div
                  style={{
                    position: "absolute",
                    inset: "-10%",
                    backgroundImage:
                      "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
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
                <ScrollTransform
                  from={{ scale: 1, y: 0, opacity: 1 }}
                  to={{ scale: 0.85, y: -50, opacity: 0 }}
                  span={0.7}
                  easing="ease-out"
                >
                  <h1
                    style={{
                      fontSize: "clamp(3.5rem, 12vw, 10rem)",
                      fontWeight: 900,
                      letterSpacing: "-0.05em",
                      lineHeight: 0.95,
                      margin: 0,
                      textAlign: "center",
                    }}
                  >
                    {name}
                  </h1>
                  <p
                    style={{
                      fontSize: "clamp(1rem, 2.5vw, 1.5rem)",
                      color: accentColor,
                      marginTop: "20px",
                      fontWeight: 500,
                      letterSpacing: "0.02em",
                      textAlign: "center",
                    }}
                  >
                    {role}
                  </p>
                </ScrollTransform>
                {showScrollHint && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "40px",
                      opacity: Math.max(0, 1 - progress * 5),
                      fontSize: "1.5rem",
                      color: "rgba(255, 255, 255, 0.4)",
                    }}
                  >
                    &#8595;
                  </div>
                )}
              </div>
            </div>
          )}
        </Scene>

        {/* Bio - TextReveal */}
        <Scene duration="200vh">
          <div style={sectionCenter}>
            <div style={{ maxWidth: "750px" }}>
              <TextReveal
                mode="word"
                at={0.05}
                span={0.85}
                color="#ffffff"
                dimColor="rgba(255, 255, 255, 0.1)"
              >
                {bio}
              </TextReveal>
            </div>
          </div>
        </Scene>

        {/* Projects — Sticky Timeline */}
        {projects.length > 0 && (
          <Scene duration={`${Math.max(projects.length * 150, 500)}vh`}>
            {(progress) => {
              const n = projects.length;
              const active = Math.min(n - 1, Math.floor(progress * n));
              const fill = Math.min(
                100,
                n > 1 ? ((progress * n) / (n - 1)) * 100 : progress * 100
              );

              return (
                <section
                  style={{
                    height: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    maxWidth: "1080px",
                    margin: "0 auto",
                    padding: "0 clamp(16px, 4vw, 48px)",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.2em",
                      color: "rgba(255, 255, 255, 0.35)",
                      marginBottom: "48px",
                    }}
                  >
                    Selected Work
                  </p>

                  <div
                    style={{
                      display: "flex",
                      gap: "clamp(20px, 4vw, 80px)",
                    }}
                  >
                    {/* Left: Timeline */}
                    <div
                      style={{
                        width: "clamp(80px, 22vw, 180px)",
                        flexShrink: 0,
                        position: "relative",
                      }}
                    >
                      {/* Track line */}
                      <div
                        style={{
                          position: "absolute",
                          left: "clamp(6px, 1.2vw, 10px)",
                          top: "clamp(6px, 1.2vw, 10px)",
                          bottom: "clamp(6px, 1.2vw, 10px)",
                          width: "2px",
                          background: "rgba(255,255,255,0.06)",
                          borderRadius: "1px",
                        }}
                      >
                        <div
                          style={{
                            width: "100%",
                            height: `${fill}%`,
                            background: accentColor,
                            transition: "height 0.4s ease-out",
                            borderRadius: "1px",
                          }}
                        />
                      </div>

                      {/* Dots & labels */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          height: "300px",
                        }}
                      >
                        {projects.map((project, i) => (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "clamp(8px, 2vw, 18px)",
                              position: "relative",
                              zIndex: 1,
                              cursor: "default",
                            }}
                          >
                            <div
                              style={{
                                width: "clamp(14px, 3vw, 22px)",
                                height: "clamp(14px, 3vw, 22px)",
                                borderRadius: "50%",
                                background:
                                  i <= active
                                    ? accentColor
                                    : "rgba(255,255,255,0.08)",
                                boxShadow:
                                  i === active
                                    ? `0 0 0 4px #050505, 0 0 20px ${accentColor}40`
                                    : "none",
                                transition: "all 0.4s",
                                flexShrink: 0,
                              }}
                            />
                            <span
                              style={{
                                fontSize: "clamp(12px, 2vw, 15px)",
                                fontWeight: i === active ? 600 : 400,
                                color:
                                  i <= active
                                    ? "#f5f5f7"
                                    : "rgba(255,255,255,0.25)",
                                transition: "all 0.4s",
                              }}
                            >
                              {project.year}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right: Content panels */}
                    <div
                      style={{
                        flex: 1,
                        position: "relative",
                        minHeight: "300px",
                      }}
                    >
                      {projects.map((project, i) => (
                        <div
                          key={i}
                          style={{
                            position: "absolute",
                            top: "0",
                            left: "0",
                            right: "0",
                            opacity: i === active ? 1 : 0,
                            transform: `translateY(${i === active ? 0 : i > active ? 24 : -24}px)`,
                            transition: "opacity 0.5s, transform 0.5s",
                            pointerEvents: i === active ? "auto" : "none",
                          }}
                        >
                          <h3
                            style={{
                              fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                              fontWeight: 700,
                              letterSpacing: "-0.02em",
                              margin: "0 0 14px",
                              color: "#f5f5f7",
                            }}
                          >
                            {project.title}
                          </h3>
                          <p
                            style={{
                              fontSize: "1rem",
                              color: "rgba(255, 255, 255, 0.5)",
                              lineHeight: 1.6,
                              maxWidth: "480px",
                              margin: "0 0 20px",
                            }}
                          >
                            {project.description}
                          </p>
                          {project.tags && project.tags.length > 0 && (
                            <div
                              style={{
                                display: "flex",
                                gap: "8px",
                                flexWrap: "wrap",
                              }}
                            >
                              {project.tags.map((tag) => (
                                <span
                                  key={tag}
                                  style={{
                                    fontSize: "0.75rem",
                                    padding: "4px 12px",
                                    borderRadius: "999px",
                                    background: `${accentColor}15`,
                                    color: accentColor,
                                    border: `1px solid ${accentColor}30`,
                                  }}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              );
            }}
          </Scene>
        )}

        {/* Skills Marquee Ticker */}
        {tickerItems.length > 0 && (
          <div
            style={{
              borderTop: "0.5px solid rgba(255,255,255,0.08)",
              borderBottom: "0.5px solid rgba(255,255,255,0.08)",
              padding: "20px 0",
            }}
          >
            <Marquee speed={30}>
              {tickerItems.map((item) => (
                <span
                  key={item}
                  style={{
                    fontSize: "0.875rem",
                    color: "rgba(255, 255, 255, 0.5)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item}
                </span>
              ))}
            </Marquee>
          </div>
        )}

        {/* Skills - Horizontal Scroll */}
        {skills.length > 0 && (
          <HorizontalScroll>
            {chunkArray(skills, Math.ceil(skills.length / 3)).map(
              (group, panelIndex) => (
                <Panel key={panelIndex}>
                  <div
                    style={{
                      ...sectionCenter,
                      gap: "24px",
                    }}
                  >
                    {panelIndex === 0 && (
                      <p
                        style={{
                          fontSize: "0.75rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.2em",
                          color: "rgba(255, 255, 255, 0.35)",
                          margin: "0 0 16px",
                        }}
                      >
                        Skills & Tools
                      </p>
                    )}
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "12px",
                        justifyContent: "center",
                        maxWidth: "600px",
                      }}
                    >
                      {group.map((skill) => (
                        <span
                          key={skill}
                          style={{
                            fontSize: "1rem",
                            padding: "10px 24px",
                            borderRadius: "999px",
                            background: "rgba(255, 255, 255, 0.04)",
                            border: "1px solid rgba(255, 255, 255, 0.08)",
                            color: "rgba(255, 255, 255, 0.8)",
                            transition: "border-color 200ms ease",
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </Panel>
              )
            )}
          </HorizontalScroll>
        )}

        {/* Contact */}
        <div style={sectionCenter}>
          <p
            style={{
              fontSize: "clamp(1.25rem, 3vw, 2rem)",
              color: "rgba(255, 255, 255, 0.4)",
              margin: "0 0 24px",
              fontWeight: 500,
            }}
          >
            Let&apos;s work together
          </p>
          {contactEmail && (
            <a
              href={`mailto:${contactEmail}`}
              style={{
                fontSize: "clamp(1.5rem, 4vw, 3rem)",
                fontWeight: 700,
                color: "#ffffff",
                textDecoration: "none",
                transition: "color 150ms ease",
                letterSpacing: "-0.01em",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = accentColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#ffffff";
              }}
            >
              {contactEmail}
            </a>
          )}
        </div>
      </Kino>
    </div>
  );
}

/** Split an array into chunks of the given size */
function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}
