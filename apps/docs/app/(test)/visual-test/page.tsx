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

/* ------------------------------------------------------------------ */
/*  Helper: diagnostic overlay badge                                   */
/* ------------------------------------------------------------------ */
function Badge({
  label,
  value,
  pass,
}: {
  label: string;
  value: string;
  pass?: boolean;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: "rgba(0,0,0,0.6)",
        border: `1px solid ${pass === undefined ? "#2a2a2a" : pass ? "#22c55e" : "#ef4444"}`,
        borderRadius: 6,
        padding: "4px 10px",
        fontSize: 13,
        fontFamily: "monospace",
        color: "#e5e5e5",
      }}
    >
      <strong>{label}:</strong> {value}
      {pass !== undefined && (
        <span style={{ color: pass ? "#22c55e" : "#ef4444" }}>
          {pass ? " PASS" : " FAIL"}
        </span>
      )}
    </span>
  );
}

function SectionHeader({ title, id }: { title: string; id: string }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 12,
        left: 12,
        zIndex: 10,
      }}
    >
      <span
        style={{
          background: "#dc2626",
          color: "#fff",
          padding: "4px 12px",
          borderRadius: 4,
          fontSize: 14,
          fontWeight: 700,
          fontFamily: "monospace",
        }}
      >
        {id}: {title}
      </span>
    </div>
  );
}

/* ================================================================== */
/*  1. SCENE — Progress accuracy                                       */
/* ================================================================== */
function SceneTest() {
  return (
    <section data-testid="test-scene">
      <Scene duration="300vh">
        {(progress) => {
          const pct = Math.round(progress * 100);
          return (
            <div
              style={{
                width: "100%",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: `hsl(${progress * 15}, ${40 + progress * 30}%, ${8 + progress * 6}%)`,
                position: "relative",
              }}
            >
              <SectionHeader title="Scene" id="1" />
              <div
                style={{
                  fontSize: "clamp(60px, 12vw, 140px)",
                  fontWeight: 700,
                  fontFamily: "monospace",
                  color: "#fff",
                }}
              >
                {pct}%
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <Badge label="progress" value={progress.toFixed(3)} />
                <Badge
                  label="start"
                  value={pct <= 2 ? "YES" : "NO"}
                  pass={pct <= 2 || pct > 5}
                />
                <Badge
                  label="end"
                  value={pct >= 98 ? "YES" : "NO"}
                  pass={pct < 95 || pct >= 98}
                />
              </div>
              {/* Progress bar */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  height: 6,
                  width: `${pct}%`,
                  background: "#dc2626",
                  transition: "width 0.05s",
                }}
              />
            </div>
          );
        }}
      </Scene>
    </section>
  );
}

/* ================================================================== */
/*  2. REVEAL — All 5 presets                                          */
/* ================================================================== */
function RevealTest() {
  const presets: Array<{
    animation: "fade" | "fade-up" | "fade-down" | "scale" | "blur";
    at: number;
    color: string;
  }> = [
    { animation: "fade", at: 0.1, color: "#dc2626" },
    { animation: "fade-up", at: 0.3, color: "#b91c1c" },
    { animation: "fade-down", at: 0.5, color: "#991b1b" },
    { animation: "scale", at: 0.7, color: "#7f1d1d" },
    { animation: "blur", at: 0.9, color: "#ef4444" },
  ];

  return (
    <section data-testid="test-reveal">
      <Scene duration="250vh">
        {(progress) => (
          <div
            style={{
              width: "100%",
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "#0c0c0c",
              position: "relative",
              gap: 16,
            }}
          >
            <SectionHeader title="Reveal" id="2" />
            <Badge label="progress" value={progress.toFixed(2)} />
            <div
              style={{
                display: "flex",
                gap: 16,
                flexWrap: "wrap",
                justifyContent: "center",
                maxWidth: 900,
              }}
            >
              {presets.map((p) => (
                <Reveal
                  key={p.animation}
                  progress={progress}
                  at={p.at}
                  animation={p.animation}
                >
                  <div
                    style={{
                      width: 140,
                      height: 100,
                      background: p.color,
                      borderRadius: 8,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: 14,
                      fontFamily: "monospace",
                    }}
                  >
                    <div>{p.animation}</div>
                    <div style={{ fontSize: 11, opacity: 0.7 }}>
                      at={p.at}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </Scene>
    </section>
  );
}

/* ================================================================== */
/*  3. TEXT REVEAL                                                      */
/* ================================================================== */
function TextRevealTest() {
  const text =
    "Scroll driven storytelling components for React build cinematic experiences";

  return (
    <section data-testid="test-textreveal">
      <Scene duration="200vh">
        {(progress) => (
          <div
            style={{
              width: "100%",
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "#0a0a0a",
              padding: "0 24px",
              position: "relative",
            }}
          >
            <SectionHeader title="TextReveal" id="3" />
            <Badge label="progress" value={progress.toFixed(2)} />
            <div
              style={{
                maxWidth: 700,
                fontSize: "clamp(24px, 4vw, 42px)",
                fontWeight: 600,
                lineHeight: 1.5,
                textAlign: "center",
                marginTop: 24,
              }}
            >
              <TextReveal
                progress={progress}
                mode="word"
                at={0}
                span={0.75}
                color="#ffffff"
                dimColor="rgba(255,255,255,0.12)"
              >
                {text}
              </TextReveal>
            </div>
          </div>
        )}
      </Scene>
    </section>
  );
}

/* ================================================================== */
/*  4. COUNTER                                                         */
/* ================================================================== */
function CounterTest() {
  return (
    <section data-testid="test-counter">
      <Scene duration="200vh">
        {(progress) => (
          <div
            style={{
              width: "100%",
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "#0c0c0c",
              position: "relative",
              gap: 32,
            }}
          >
            <SectionHeader title="Counter" id="4" />
            <Badge label="progress" value={progress.toFixed(2)} />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 32,
                maxWidth: 700,
                width: "100%",
                textAlign: "center",
              }}
            >
              {[
                { from: 0, to: 1000, label: "Users" },
                { from: 0, to: 100, label: "Components" },
                { from: 0, to: 3, label: "Dependencies" },
              ].map((c, i) => (
                <div key={c.label}>
                  <div
                    style={{
                      fontSize: 48,
                      fontWeight: 700,
                      fontFamily: "monospace",
                      color: ["#ef4444", "#f87171", "#fca5a5"][i],
                    }}
                  >
                    <Counter
                      from={c.from}
                      to={c.to}
                      at={0}
                      span={0.6}
                      progress={progress}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "#666",
                      marginTop: 8,
                      fontFamily: "monospace",
                    }}
                  >
                    {c.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Scene>
    </section>
  );
}

/* ================================================================== */
/*  5. COMPARE SLIDER                                                  */
/* ================================================================== */
function CompareSliderTest() {
  return (
    <section data-testid="test-compareslider">
      <Scene duration="200vh">
        {(progress) => (
          <div
            style={{
              width: "100%",
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "#0a0a0a",
              position: "relative",
            }}
          >
            <SectionHeader title="CompareSlider" id="5" />
            <Badge label="progress" value={progress.toFixed(2)} />
            <div
              style={{
                maxWidth: 600,
                width: "90%",
                marginTop: 24,
                border: "1px solid #2a2a2a",
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              <CompareSlider
                scrollDriven
                progress={progress}
                before={
                  <div
                    style={{
                      width: "100%",
                      height: 300,
                      background: "#1a1a1a",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ef4444",
                      fontSize: 32,
                      fontWeight: 700,
                      fontFamily: "monospace",
                    }}
                  >
                    BEFORE
                  </div>
                }
                after={
                  <div
                    style={{
                      width: "100%",
                      height: 300,
                      background: "#dc2626",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: 32,
                      fontWeight: 700,
                      fontFamily: "monospace",
                    }}
                  >
                    AFTER
                  </div>
                }
              />
            </div>
          </div>
        )}
      </Scene>
    </section>
  );
}

/* ================================================================== */
/*  6. HORIZONTAL SCROLL                                               */
/* ================================================================== */
function HorizontalScrollTest() {
  const panels = [
    { label: "Panel 1", color: "#7f1d1d" },
    { label: "Panel 2", color: "#991b1b" },
    { label: "Panel 3", color: "#b91c1c" },
    { label: "Panel 4", color: "#dc2626" },
  ];

  return (
    <section data-testid="test-horizontalscroll">
      <div
        style={{
          background: "#0a0a0a",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            zIndex: 10,
          }}
        >
          <SectionHeader title="HorizontalScroll" id="6" />
        </div>
        <HorizontalScroll>
          {panels.map((p) => (
            <Panel key={p.label}>
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: p.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 48,
                  fontWeight: 700,
                  fontFamily: "monospace",
                }}
              >
                {p.label}
              </div>
            </Panel>
          ))}
        </HorizontalScroll>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  7. PARALLAX                                                        */
/* ================================================================== */
function ParallaxTest() {
  return (
    <section data-testid="test-parallax">
      <div
        style={{
          height: "200vh",
          position: "relative",
          background: "#0c0c0c",
          overflow: "hidden",
        }}
      >
        <SectionHeader title="Parallax" id="7" />
        {/* Place boxes side-by-side at the top — as you scroll,
            SLOW (0.3) drifts down slowly while FAST (1.5) races upward */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 80,
            paddingTop: "30vh",
          }}
        >
          <Parallax speed={0.3}>
            <div
              style={{
                width: 200,
                height: 200,
                background: "#dc2626",
                borderRadius: 16,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 700,
                fontFamily: "monospace",
              }}
            >
              <div style={{ fontSize: 24 }}>SLOW</div>
              <div style={{ fontSize: 14, opacity: 0.7 }}>speed=0.3</div>
            </div>
          </Parallax>
          <Parallax speed={1.5}>
            <div
              style={{
                width: 200,
                height: 200,
                background: "#7f1d1d",
                border: "2px solid #dc2626",
                borderRadius: 16,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 700,
                fontFamily: "monospace",
              }}
            >
              <div style={{ fontSize: 24 }}>FAST</div>
              <div style={{ fontSize: 14, opacity: 0.7 }}>speed=1.5</div>
            </div>
          </Parallax>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  8. PROGRESS — All 3 types                                          */
/* ================================================================== */
function ProgressTest() {
  return (
    <section data-testid="test-progress">
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          position: "relative",
          gap: 48,
        }}
      >
        <SectionHeader title="Progress" id="8" />
        <div style={{ fontSize: 14, color: "#666", fontFamily: "monospace" }}>
          All at progress=0.6
        </div>
        <div
          style={{
            display: "flex",
            gap: 64,
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {/* Bar */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 240,
                height: 8,
                background: "#1a1a1a",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "60%",
                  height: "100%",
                  background: "#dc2626",
                  borderRadius: 4,
                }}
              />
            </div>
            <span
              style={{ fontSize: 12, color: "#666", fontFamily: "monospace" }}
            >
              bar @ 60%
            </span>
          </div>

          {/* Dots */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", gap: 8 }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: i < 3 ? "#dc2626" : "#1a1a1a",
                  }}
                />
              ))}
            </div>
            <span
              style={{ fontSize: 12, color: "#666", fontFamily: "monospace" }}
            >
              dots 3/5
            </span>
          </div>

          {/* Ring */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <svg width="48" height="48" viewBox="0 0 48 48">
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="#1a1a1a"
                strokeWidth="4"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="#dc2626"
                strokeWidth="4"
                strokeDasharray={`${0.6 * 2 * Math.PI * 20} ${2 * Math.PI * 20}`}
                strokeLinecap="round"
                transform="rotate(-90 24 24)"
              />
            </svg>
            <span
              style={{ fontSize: 12, color: "#666", fontFamily: "monospace" }}
            >
              ring 60%
            </span>
          </div>
        </div>

        {/* Also render the actual Progress components */}
        <div
          style={{
            marginTop: 32,
            fontSize: 13,
            color: "#444",
            fontFamily: "monospace",
          }}
        >
          Real Progress components (fixed position, visible at viewport edges):
        </div>
        <Progress type="bar" position="bottom" color="#dc2626" progress={0.6} />
        <Progress type="dots" position="right" color="#ef4444" progress={0.6} dotCount={5} />
        <Progress type="ring" position="left" color="#b91c1c" progress={0.6} ringSize={48} />
      </div>
    </section>
  );
}

/* ================================================================== */
/*  9. STICKY HEADER                                                   */
/* ================================================================== */
function StickyHeaderTest() {
  return (
    <section data-testid="test-stickyheader">
      <div
        style={{
          height: "200vh",
          background:
            "linear-gradient(to bottom, #0c0c0c 0%, #1a0a0a 50%, #0c0c0c 100%)",
          position: "relative",
        }}
      >
        <StickyHeader
          threshold={100}
          background="rgba(220, 38, 38, 0.9)"
          className="test-sticky-header"
        >
          <div
            style={{
              padding: "12px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              maxWidth: 1200,
              margin: "0 auto",
            }}
          >
            <span
              style={{
                fontWeight: 700,
                fontFamily: "monospace",
                color: "#fff",
                fontSize: 16,
              }}
            >
              StickyHeader Test
            </span>
            <span
              style={{
                fontSize: 12,
                fontFamily: "monospace",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              threshold=100 · transparent → red
            </span>
          </div>
        </StickyHeader>
        <div
          style={{
            paddingTop: 120,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
          }}
        >
          <SectionHeader title="StickyHeader" id="9" />
          <div
            style={{
              fontSize: 18,
              color: "#666",
              fontFamily: "monospace",
              textAlign: "center",
              padding: "0 24px",
            }}
          >
            Scroll down 100px to see header turn red
          </div>
          <div style={{ height: "150vh" }} />
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  10. MARQUEE                                                        */
/* ================================================================== */
function MarqueeTest() {
  const items = ["Item A", "Item B", "Item C", "Item D"];

  return (
    <section data-testid="test-marquee">
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          position: "relative",
          gap: 32,
          padding: "48px 0",
        }}
      >
        <SectionHeader title="Marquee" id="10" />
        <div style={{ fontSize: 14, color: "#666", fontFamily: "monospace" }}>
          4 items duplicated to 8 · overflow hidden · CSS animation
        </div>
        <div style={{ width: "100%", maxWidth: 800 }}>
          <Marquee speed={60} gap={24}>
            {items.map((item) => (
              <div
                key={item}
                data-testid="marquee-item"
                style={{
                  padding: "16px 32px",
                  background: "#dc2626",
                  color: "#fff",
                  borderRadius: 8,
                  fontWeight: 700,
                  fontFamily: "monospace",
                  fontSize: 18,
                  whiteSpace: "nowrap",
                }}
              >
                {item}
              </div>
            ))}
          </Marquee>
        </div>
        <div style={{ width: "100%", maxWidth: 800, marginTop: 16 }}>
          <Marquee speed={40} direction="right" gap={16}>
            {items.map((item) => (
              <div
                key={item}
                style={{
                  padding: "12px 24px",
                  background: "#7f1d1d",
                  border: "1px solid #991b1b",
                  color: "#fca5a5",
                  borderRadius: 8,
                  fontWeight: 600,
                  fontFamily: "monospace",
                  fontSize: 14,
                  whiteSpace: "nowrap",
                }}
              >
                {item} (right)
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  11. EDGE CASES                                                     */
/* ================================================================== */
function EdgeCaseTest() {
  return (
    <section data-testid="test-edgecases">
      <div
        style={{
          background: "#0a0a0a",
          position: "relative",
        }}
      >
        <div style={{ padding: "48px 24px 0", textAlign: "center" }}>
          <SectionHeader title="Edge Cases" id="11" />
          <div
            style={{
              fontSize: 14,
              color: "#666",
              fontFamily: "monospace",
              marginTop: 48,
            }}
          >
            Minimal duration (101vh), extreme duration (1000vh), empty Scene
          </div>
        </div>

        {/* Minimal duration */}
        <Scene duration="101vh">
          {(progress) => (
            <div
              style={{
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#0c0808",
                position: "relative",
              }}
            >
              <div style={{ textAlign: "center", fontFamily: "monospace" }}>
                <div style={{ fontSize: 14, color: "#666" }}>
                  Minimal: 101vh
                </div>
                <div
                  style={{ fontSize: 48, fontWeight: 700, color: "#ef4444" }}
                >
                  {Math.round(progress * 100)}%
                </div>
              </div>
            </div>
          )}
        </Scene>

        {/* Extreme duration */}
        <Scene duration="1000vh">
          {(progress) => (
            <div
              style={{
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#080808",
                position: "relative",
              }}
            >
              <div style={{ textAlign: "center", fontFamily: "monospace" }}>
                <div style={{ fontSize: 14, color: "#666" }}>
                  Extreme: 1000vh
                </div>
                <div
                  style={{ fontSize: 48, fontWeight: 700, color: "#dc2626" }}
                >
                  {Math.round(progress * 100)}%
                </div>
              </div>
            </div>
          )}
        </Scene>

        {/* Empty Scene */}
        <Scene duration="120vh">
          <div
            style={{
              height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#0a0a0a",
            }}
          >
            <div
              style={{
                fontSize: 14,
                color: "#666",
                fontFamily: "monospace",
              }}
            >
              Empty Scene (no render prop, static children only) — should not
              crash
            </div>
          </div>
        </Scene>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  MAIN PAGE                                                          */
/* ================================================================== */
export default function VisualTestPage() {
  return (
    <div
      style={{
        background: "#0a0a0a",
        color: "#e5e5e5",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Page header */}
      <div
        style={{
          padding: "24px",
          textAlign: "center",
          borderBottom: "1px solid #1a1a1a",
          position: "relative",
          zIndex: 100,
          background: "#0a0a0a",
        }}
      >
        <h1
          style={{
            fontSize: 24,
            fontWeight: 700,
            fontFamily: "monospace",
            margin: 0,
            color: "#fff",
          }}
        >
          react-kino Visual Test Page
        </h1>
        <p
          style={{
            fontSize: 14,
            color: "#666",
            marginTop: 8,
            fontFamily: "monospace",
          }}
        >
          11 sections · scroll through each to verify
        </p>
      </div>

      <Kino>
        <ParallaxTest />
        <SceneTest />
        <RevealTest />
        <TextRevealTest />
        <CounterTest />
        <CompareSliderTest />
        <HorizontalScrollTest />
        <ProgressTest />
        <StickyHeaderTest />
        <MarqueeTest />
        <EdgeCaseTest />
      </Kino>

      {/* Footer */}
      <div
        style={{
          padding: "48px 24px",
          textAlign: "center",
          borderTop: "1px solid #1a1a1a",
          fontFamily: "monospace",
        }}
      >
        <p style={{ fontSize: 14, color: "#444" }}>
          End of visual test page — all 11 sections rendered
        </p>
      </div>
    </div>
  );
}
