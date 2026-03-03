import {
  Kino,
  Scene,
  Reveal,
  Parallax,
  Counter,
  CompareSlider,
  HorizontalScroll,
  Panel,
  Progress,
  TextReveal,
  Marquee,
  StickyHeader,
  ScrollTransform,
} from "react-kino";

// ─── Design tokens ──────────────────────────────────────────────

const font = {
  sans: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", "Segoe UI", Roboto, Arial, sans-serif',
  mono: '"SF Mono", "Fira Code", "Cascadia Code", Consolas, monospace',
};

const c = {
  text: "#f5f5f7",
  muted: "#86868b",
  subtle: "#48484a",
  blue: "#2997ff",
  purple: "#bf5af2",
  pink: "#ff375f",
  green: "#30d158",
  border: "rgba(255, 255, 255, 0.08)",
};

const gradient: React.CSSProperties = {
  background: "linear-gradient(135deg, #2997ff 0%, #bf5af2 50%, #ff375f 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

// ─── Feature panel data ─────────────────────────────────────────

const features = [
  {
    name: "Scene",
    tagline: "Pin & Progress",
    description:
      "Pin any element to the viewport and track scroll progress with sub-pixel precision. CSS sticky positioning — no scroll hijacking.",
    bg: "linear-gradient(135deg, #001d3d 0%, #003566 50%, #001d3d 100%)",
    accent: c.blue,
  },
  {
    name: "Reveal",
    tagline: "Animate on Scroll",
    description:
      "Five built-in animations — fade, scale, blur, slide. Trigger at any scroll position. Hardware-accelerated transforms.",
    bg: "linear-gradient(135deg, #1a0030 0%, #2d004d 50%, #1a0030 100%)",
    accent: c.purple,
  },
  {
    name: "TextReveal",
    tagline: "Tell Stories",
    description:
      "Progressive text reveal — word by word, character by character, or line by line. Your story unfolds as the user scrolls.",
    bg: "linear-gradient(135deg, #2d0018 0%, #4a002a 50%, #2d0018 100%)",
    accent: c.pink,
  },
  {
    name: "Parallax",
    tagline: "Add Depth",
    description:
      "Layer elements at different scroll speeds. Create cinematic depth with zero JavaScript overhead. Respects reduced-motion.",
    bg: "linear-gradient(135deg, #001a18 0%, #003330 50%, #001a18 100%)",
    accent: c.green,
  },
];

// ─── Timeline data ──────────────────────────────────────────────

const timelineSteps = [
  {
    label: "Pin",
    title: "Create a Scene",
    description:
      "Pin any content to the viewport with a single component. Define the scroll distance with a duration prop.",
    accent: c.blue,
    code: '<Scene duration="300vh">\n  {children}\n</Scene>',
  },
  {
    label: "Animate",
    title: "Add Animations",
    description:
      "Five scroll-triggered animations. Set the exact trigger point with the at prop. Hardware-accelerated.",
    accent: c.purple,
    code: '<Reveal animation="fade-up" at={0.3}>\n  <h1>Hello World</h1>\n</Reveal>',
  },
  {
    label: "Drive",
    title: "Use Raw Progress",
    description:
      "Access the 0\u20131 progress value to drive any CSS property. Build completely custom scroll-driven effects.",
    accent: c.pink,
    code: '{(progress) => (\n  <div style={{\n    opacity: progress,\n    transform: `scale(${progress})`,\n  }} />\n)}',
  },
  {
    label: "Ship",
    title: "Zero Overhead",
    description:
      "No runtime dependencies. Under 1KB gzipped core. SSR-safe. Works with Next.js, Remix, Vite.",
    accent: c.green,
    code: "npm install react-kino",
  },
];

// ─── App ────────────────────────────────────────────────────────

function App() {
  return (
    <Kino>
      <Progress type="bar" position="top" color={c.blue} />

      {/* ━━━ NAV ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <StickyHeader
        threshold={40}
        background="rgba(0, 0, 0, 0.72)"
        blur
        style={{ borderBottom: `0.5px solid ${c.border}` }}
      >
        <div
          style={{
            maxWidth: "980px",
            margin: "0 auto",
            padding: "0 22px",
            height: "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: font.sans,
          }}
        >
          <span
            style={{
              fontSize: "21px",
              fontWeight: 600,
              letterSpacing: "-0.015em",
              color: c.text,
            }}
          >
            Kino
          </span>
          <nav style={{ display: "flex", gap: "28px", fontSize: "12px" }}>
            {["Features", "Components", "Specs"].map((item) => (
              <span key={item} style={{ color: c.muted, cursor: "default" }}>
                {item}
              </span>
            ))}
            <a
              href="https://www.npmjs.com/package/react-kino"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: c.blue, textDecoration: "none" }}
            >
              Install
            </a>
          </nav>
        </div>
      </StickyHeader>

      {/* ━━━ HERO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <Scene duration="180vh">
        {(progress) => (
          <section
            style={{
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: font.sans,
              position: "relative",
            }}
          >
            <Reveal animation="fade-up" at={0} duration={1200}>
              <h1
                style={{
                  fontSize: "clamp(80px, 15vw, 144px)",
                  fontWeight: 700,
                  letterSpacing: "-0.045em",
                  lineHeight: 0.95,
                  color: c.text,
                }}
              >
                Kino
              </h1>
            </Reveal>

            <Reveal animation="fade" at={0.08} duration={1000}>
              <p
                style={{
                  fontSize: "clamp(24px, 4.5vw, 48px)",
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  marginTop: "16px",
                  ...gradient,
                }}
              >
                The scroll engine.
              </p>
            </Reveal>

            <Reveal animation="fade" at={0.18} duration={800}>
              <p style={{ fontSize: "17px", color: c.muted, marginTop: "16px" }}>
                Cinematic storytelling for React
              </p>
            </Reveal>

            <div
              className="scroll-hint"
              style={{
                position: "absolute",
                bottom: "32px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                opacity: Math.max(0, 1 - progress * 5),
                transition: "opacity 0.15s",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  color: c.subtle,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Scroll to explore
              </span>
              <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
                <path
                  d="M8 4L8 18M8 18L14 12M8 18L2 12"
                  stroke={c.subtle}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </section>
        )}
      </Scene>

      {/* ━━━ TEXT REVEAL — Philosophy ━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <Scene duration="400vh">
        {(progress) => (
          <section
            style={{
              height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 8%",
              fontFamily: font.sans,
            }}
          >
            <TextReveal
              progress={progress}
              mode="word"
              at={0.05}
              span={0.8}
              color={c.text}
              dimColor="rgba(255, 255, 255, 0.08)"
              style={{
                fontSize: "clamp(28px, 4.5vw, 56px)",
                fontWeight: 600,
                lineHeight: 1.25,
                letterSpacing: "-0.025em",
                textAlign: "center",
                maxWidth: "860px",
              }}
            >
              Every great story deserves a great stage. Kino transforms your
              React app into a cinematic experience. No dependencies. No
              complexity. Just scroll.
            </TextReveal>
          </section>
        )}
      </Scene>

      {/* ━━━ DEVICE TILT — MacBook-style 3D rotation ━━━━━━━━━━━ */}
      <Scene duration="350vh">
        {() => (
          <section
            style={{
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "48px",
              fontFamily: font.sans,
            }}
          >
            <ScrollTransform
              from={{ rotateX: 40, rotateY: -12, scale: 0.82, y: 80, opacity: 0.3 }}
              to={{ rotateX: 0, rotateY: 0, scale: 1, y: 0, opacity: 1 }}
              perspective={1200}
              span={0.5}
              easing="ease-out-cubic"
              transformOrigin="center bottom"
            >
              <div
                style={{
                  width: "min(85vw, 680px)",
                  aspectRatio: "16 / 10",
                  borderRadius: "20px",
                  background:
                    "linear-gradient(145deg, #0a0a1a, #12082a, #0a0a1a)",
                  boxShadow: [
                    "0 0 0 0.5px rgba(255,255,255,0.06)",
                    "0 2px 4px rgba(0,0,0,0.4)",
                    "0 48px 96px -16px rgba(110, 86, 207, 0.25)",
                  ].join(", "),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    width: "320px",
                    height: "320px",
                    borderRadius: "50%",
                    top: "-80px",
                    right: "-60px",
                    background:
                      "radial-gradient(circle, rgba(41,151,255,0.12), transparent 70%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    width: "240px",
                    height: "240px",
                    borderRadius: "50%",
                    bottom: "-60px",
                    left: "-40px",
                    background:
                      "radial-gradient(circle, rgba(191,90,242,0.10), transparent 70%)",
                  }}
                />
                <pre
                  style={{
                    fontSize: "clamp(13px, 1.8vw, 17px)",
                    color: "rgba(255,255,255,0.4)",
                    fontFamily: font.mono,
                    textAlign: "left",
                    lineHeight: 2,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <span style={{ color: c.subtle }}>{"<"}</span>
                  <span style={{ color: c.blue }}>Scene</span>
                  <span style={{ color: c.subtle }}>{" duration="}</span>
                  <span style={{ color: c.green }}>{'"300vh"'}</span>
                  <span style={{ color: c.subtle }}>{">"}</span>
                  {"\n"}
                  {"  "}
                  <span style={{ color: c.subtle }}>{"<"}</span>
                  <span style={{ color: c.purple }}>Reveal</span>
                  <span style={{ color: c.subtle }}>{" animation="}</span>
                  <span style={{ color: c.green }}>{'"fade-up"'}</span>
                  <span style={{ color: c.subtle }}>{">"}</span>
                  {"\n"}
                  {"    "}
                  <span style={{ color: c.text }}>Your content here</span>
                  {"\n"}
                  {"  "}
                  <span style={{ color: c.subtle }}>{"</"}</span>
                  <span style={{ color: c.purple }}>Reveal</span>
                  <span style={{ color: c.subtle }}>{">"}</span>
                  {"\n"}
                  <span style={{ color: c.subtle }}>{"</"}</span>
                  <span style={{ color: c.blue }}>Scene</span>
                  <span style={{ color: c.subtle }}>{">"}</span>
                </pre>
              </div>
            </ScrollTransform>

            {/* Text reveals after the tilt settles */}
            <div style={{ textAlign: "center" }}>
              <Reveal animation="fade-up" at={0.55} duration={800}>
                <h2
                  style={{
                    fontSize: "clamp(32px, 5vw, 56px)",
                    fontWeight: 700,
                    letterSpacing: "-0.03em",
                    color: c.text,
                  }}
                >
                  Pinned. Precise. Performant.
                </h2>
              </Reveal>
              <Reveal animation="fade-up" at={0.65} duration={800}>
                <p
                  style={{
                    fontSize: "17px",
                    color: c.muted,
                    maxWidth: "460px",
                    lineHeight: 1.5,
                    margin: "16px auto 0",
                  }}
                >
                  CSS sticky positioning and hardware-accelerated transforms.
                  No JavaScript scroll hijacking. Just the platform, used
                  right.
                </p>
              </Reveal>
            </div>
          </section>
        )}
      </Scene>

      {/* ━━━ STATS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <Scene duration="280vh">
        {() => (
          <section
            style={{
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "56px",
              fontFamily: font.sans,
            }}
          >
            <Reveal animation="fade-up" at={0.05} duration={800}>
              <h2
                style={{
                  fontSize: "clamp(28px, 4vw, 48px)",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  color: c.text,
                }}
              >
                By the numbers.
              </h2>
            </Reveal>

            <div
              style={{
                display: "flex",
                gap: "clamp(40px, 8vw, 100px)",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "baseline",
              }}
            >
              <Stat label="Components" at={0.15}>
                <Counter
                  from={0}
                  to={13}
                  at={0.15}
                  span={0.3}
                  format={(n) => Math.round(n).toString()}
                  style={statNum}
                />
              </Stat>
              <Stat label="Hooks" at={0.25}>
                <Counter
                  from={0}
                  to={4}
                  at={0.25}
                  span={0.3}
                  format={(n) => Math.round(n).toString()}
                  style={statNum}
                />
              </Stat>
              <Stat label="Dependencies" at={0.35}>
                <Counter
                  from={10}
                  to={0}
                  at={0.35}
                  span={0.3}
                  format={(n) => Math.round(n).toString()}
                  style={statNum}
                />
              </Stat>
            </div>
          </section>
        )}
      </Scene>

      {/* ━━━ STICKY TIMELINE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <Scene duration="500vh">
        {(progress) => {
          const n = timelineSteps.length;
          const active = Math.min(n - 1, Math.floor(progress * n));
          const fill = Math.min(100, ((progress * n) / (n - 1)) * 100);

          return (
            <section
              style={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                maxWidth: "1080px",
                margin: "0 auto",
                padding: "0 48px",
                fontFamily: font.sans,
              }}
            >
              <h2
                style={{
                  fontSize: "clamp(28px, 4vw, 48px)",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  color: c.text,
                  marginBottom: "64px",
                }}
              >
                How it works.
              </h2>

              <div
                style={{
                  display: "flex",
                  gap: "clamp(40px, 6vw, 80px)",
                }}
              >
                {/* Left: Timeline */}
                <div style={{ width: "180px", flexShrink: 0, position: "relative" }}>
                  {/* Track line */}
                  <div
                    style={{
                      position: "absolute",
                      left: "10px",
                      top: "10px",
                      bottom: "10px",
                      width: "2px",
                      background: "rgba(255,255,255,0.06)",
                      borderRadius: "1px",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: `${fill}%`,
                        background: `linear-gradient(to bottom, ${c.blue}, ${c.purple}, ${c.pink}, ${c.green})`,
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
                    {timelineSteps.map((step, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "18px",
                          position: "relative",
                          zIndex: 1,
                          cursor: "default",
                        }}
                      >
                        <div
                          style={{
                            width: "22px",
                            height: "22px",
                            borderRadius: "50%",
                            background: i <= active ? step.accent : "#1d1d1f",
                            boxShadow:
                              i === active
                                ? `0 0 0 4px #000, 0 0 20px ${step.accent}40`
                                : "none",
                            transition: "all 0.4s",
                            flexShrink: 0,
                          }}
                        />
                        <span
                          style={{
                            fontSize: "15px",
                            fontWeight: i === active ? 600 : 400,
                            color: i <= active ? c.text : c.subtle,
                            transition: "all 0.4s",
                          }}
                        >
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Content panels */}
                <div style={{ flex: 1, position: "relative", minHeight: "300px" }}>
                  {timelineSteps.map((step, i) => (
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
                      <p
                        style={{
                          fontSize: "12px",
                          fontWeight: 500,
                          color: step.accent,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          marginBottom: "12px",
                        }}
                      >
                        Step {i + 1}
                      </p>
                      <h3
                        style={{
                          fontSize: "clamp(24px, 3vw, 36px)",
                          fontWeight: 700,
                          letterSpacing: "-0.02em",
                          color: c.text,
                          marginBottom: "14px",
                        }}
                      >
                        {step.title}
                      </h3>
                      <p
                        style={{
                          fontSize: "17px",
                          color: c.muted,
                          lineHeight: 1.5,
                          maxWidth: "420px",
                          marginBottom: "28px",
                        }}
                      >
                        {step.description}
                      </p>
                      <pre
                        style={{
                          fontSize: "14px",
                          fontFamily: font.mono,
                          color: "rgba(255,255,255,0.45)",
                          lineHeight: 1.7,
                          padding: "20px 24px",
                          background: "rgba(255,255,255,0.03)",
                          border: `1px solid ${c.border}`,
                          borderRadius: "12px",
                          maxWidth: "420px",
                        }}
                      >
                        {step.code}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        }}
      </Scene>

      {/* ━━━ HORIZONTAL SCROLL — Component showcase ━━━━━━━━━━━━ */}
      <HorizontalScroll>
        {features.map((f) => (
          <Panel key={f.name}>
            <div
              style={{
                height: "100%",
                background: f.bg,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "24px",
                padding: "0 10%",
                fontFamily: font.sans,
              }}
            >
              <span
                style={{
                  fontSize: "13px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: f.accent,
                  fontWeight: 500,
                }}
              >
                {f.tagline}
              </span>
              <h3
                style={{
                  fontSize: "clamp(48px, 8vw, 80px)",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  color: c.text,
                }}
              >
                {"<"}
                {f.name}
                {" />"}
              </h3>
              <p
                style={{
                  fontSize: "17px",
                  color: c.muted,
                  textAlign: "center",
                  maxWidth: "440px",
                  lineHeight: 1.5,
                }}
              >
                {f.description}
              </p>
            </div>
          </Panel>
        ))}
      </HorizontalScroll>

      {/* ━━━ PARALLAX — Visual interstitial ━━━━━━━━━━━━━━━━━━━━ */}
      <div
        style={{
          position: "relative",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <Parallax speed={0.3}>
          <div style={{ height: "140vh", position: "relative" }}>
            <div
              style={{
                position: "absolute",
                top: "15%",
                left: "10%",
                width: "420px",
                height: "420px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(41,151,255,0.08), transparent 70%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "45%",
                right: "8%",
                width: "320px",
                height: "320px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(191,90,242,0.06), transparent 70%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "15%",
                left: "35%",
                width: "380px",
                height: "380px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(255,55,95,0.05), transparent 70%)",
              }}
            />
          </div>
        </Parallax>

        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Parallax speed={1.15}>
            <p
              style={{
                fontSize: "clamp(36px, 7vw, 80px)",
                fontWeight: 700,
                letterSpacing: "-0.04em",
                color: c.text,
                opacity: 0.05,
                fontFamily: font.sans,
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              Built for the platform
            </p>
          </Parallax>
        </div>
      </div>

      {/* ━━━ COMPARE SLIDER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <Scene duration="250vh">
        {() => (
          <section
            style={{
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "40px",
              fontFamily: font.sans,
            }}
          >
            <Reveal animation="fade-up" at={0.05} duration={800}>
              <h2
                style={{
                  fontSize: "clamp(28px, 4vw, 48px)",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  color: c.text,
                }}
              >
                Simplify everything.
              </h2>
            </Reveal>

            <div style={{ width: "min(85vw, 720px)", aspectRatio: "16 / 9" }}>
              <CompareSlider
                scrollDriven
                before={
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background: "#0d0d0d",
                      padding: "clamp(24px, 4vw, 48px)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "11px",
                        color: c.pink,
                        marginBottom: "16px",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        fontFamily: font.sans,
                        fontWeight: 500,
                      }}
                    >
                      Traditional approach
                    </p>
                    <pre
                      style={{
                        fontSize: "clamp(10px, 1.2vw, 13px)",
                        color: "rgba(255,255,255,0.3)",
                        lineHeight: 1.7,
                        fontFamily: font.mono,
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {[
                        "const observer = new IntersectionObserver(",
                        "  (entries) => {",
                        "    entries.forEach((entry) => {",
                        "      const ratio = entry.intersectionRatio;",
                        '      entry.target.style.opacity = ratio;',
                        "      entry.target.style.transform =",
                        "        `translateY(${(1 - ratio) * 40}px)`;",
                        "    });",
                        "  },",
                        "  { threshold: Array.from(",
                        "      { length: 100 },",
                        "      (_, i) => i / 100",
                        "    )}",
                        ");",
                        "",
                        "// ...200+ more lines",
                      ].join("\n")}
                    </pre>
                  </div>
                }
                after={
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background: "#08081a",
                      padding: "clamp(24px, 4vw, 48px)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "11px",
                        color: c.blue,
                        marginBottom: "16px",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        fontFamily: font.sans,
                        fontWeight: 500,
                      }}
                    >
                      With react-kino
                    </p>
                    <pre
                      style={{
                        fontSize: "clamp(10px, 1.2vw, 13px)",
                        color: "rgba(255,255,255,0.5)",
                        lineHeight: 1.7,
                        fontFamily: font.mono,
                      }}
                    >
                      {[
                        '<Scene duration="300vh">',
                        '  <Reveal animation="fade-up">',
                        "    <YourComponent />",
                        "  </Reveal>",
                        "</Scene>",
                      ].join("\n")}
                    </pre>
                    <p
                      style={{
                        fontSize: "13px",
                        color: c.subtle,
                        marginTop: "32px",
                        fontFamily: font.sans,
                      }}
                    >
                      That's it.
                    </p>
                  </div>
                }
              />
            </div>
          </section>
        )}
      </Scene>

      {/* ━━━ CLOSING TEXT REVEAL ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <Scene duration="300vh">
        {(progress) => (
          <section
            style={{
              height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 8%",
              fontFamily: font.sans,
            }}
          >
            <TextReveal
              progress={progress}
              mode="word"
              at={0.05}
              span={0.75}
              color={c.text}
              dimColor="rgba(255, 255, 255, 0.05)"
              style={{
                fontSize: "clamp(32px, 5vw, 64px)",
                fontWeight: 700,
                lineHeight: 1.2,
                letterSpacing: "-0.03em",
                textAlign: "center",
                maxWidth: "780px",
              }}
            >
              Start building. One component. Infinite stories.
            </TextReveal>
          </section>
        )}
      </Scene>

      {/* ━━━ CTA ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        style={{
          padding: "120px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
          fontFamily: font.sans,
        }}
      >
        <code
          style={{
            fontSize: "clamp(15px, 2.2vw, 22px)",
            fontFamily: font.mono,
            color: c.muted,
            padding: "14px 32px",
            border: `1px solid ${c.border}`,
            borderRadius: "14px",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          npm install react-kino
        </code>
        <a
          href="https://www.npmjs.com/package/react-kino"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: c.blue,
            fontSize: "17px",
            textDecoration: "none",
            marginTop: "8px",
          }}
        >
          View on npm &#8594;
        </a>
      </section>

      {/* ━━━ MARQUEE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div
        style={{
          borderTop: `0.5px solid ${c.border}`,
          borderBottom: `0.5px solid ${c.border}`,
          padding: "20px 0",
        }}
      >
        <Marquee speed={30}>
          {[
            "Scene",
            "Reveal",
            "Parallax",
            "Counter",
            "TextReveal",
            "CompareSlider",
            "HorizontalScroll",
            "VideoScroll",
            "ScrollTransform",
            "Progress",
            "Marquee",
            "StickyHeader",
          ].map((name) => (
            <span
              key={name}
              style={{
                fontSize: "13px",
                fontFamily: font.mono,
                color: c.subtle,
                whiteSpace: "nowrap",
                padding: "0 24px",
              }}
            >
              {"<"}
              {name}
              {" />"}
            </span>
          ))}
        </Marquee>
      </div>

      {/* ━━━ FOOTER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <footer
        style={{
          padding: "40px 24px 48px",
          textAlign: "center",
          fontFamily: font.sans,
        }}
      >
        <p style={{ fontSize: "12px", color: c.subtle }}>
          Built with <span style={{ color: c.muted }}>react-kino</span>
        </p>
      </footer>
    </Kino>
  );
}

// ─── Helpers ────────────────────────────────────────────────────

const statNum: React.CSSProperties = {
  fontSize: "clamp(56px, 10vw, 96px)",
  fontWeight: 700,
  letterSpacing: "-0.04em",
  lineHeight: 1,
  background: "linear-gradient(135deg, #2997ff 0%, #bf5af2 50%, #ff375f 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

function Stat({
  label,
  at,
  children,
}: {
  label: string;
  at: number;
  children: React.ReactNode;
}) {
  return (
    <div style={{ textAlign: "center" }}>
      <Reveal animation="fade-up" at={at} duration={800}>
        {children}
      </Reveal>
      <p
        style={{
          fontSize: "12px",
          color: c.muted,
          marginTop: "8px",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </p>
    </div>
  );
}

export default App;
