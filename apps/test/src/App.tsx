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
} from "react-kino";

function App() {
  return (
    <Kino>
      {/* Fixed progress bar */}
      <Progress type="bar" position="top" color="#dc2626" />

      {/* Sticky header */}
      <StickyHeader
        style={{
          padding: "12px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "rgba(10, 10, 10, 0.8)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #1a1a1a",
        }}
      >
        <span style={{ fontWeight: 700, fontSize: "18px" }}>
          react-kino <span style={{ color: "#dc2626" }}>test</span>
        </span>
        <span style={{ fontSize: "12px", color: "#666", fontFamily: "monospace" }}>
          v0.1.2
        </span>
      </StickyHeader>

      {/* 1. Scene + Reveal */}
      <Scene duration="300vh">
        {(progress) => (
          <div
            style={{
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "24px",
              position: "relative",
            }}
          >
            <span className="section-label">{"<Scene> + <Reveal>"}</span>

            <Reveal animation="fade-up" at={0}>
              <h1 style={{ fontSize: "clamp(40px, 8vw, 80px)", fontWeight: 800 }}>
                react-kino
              </h1>
            </Reveal>

            <Reveal animation="fade" at={0.2}>
              <p style={{ fontSize: "20px", color: "#888" }}>
                Cinematic scroll-driven storytelling for React
              </p>
            </Reveal>

            <Reveal animation="scale" at={0.4}>
              <code
                style={{
                  padding: "8px 16px",
                  background: "#1a1a1a",
                  borderRadius: "6px",
                  fontSize: "14px",
                  color: "#dc2626",
                }}
              >
                npm install react-kino
              </code>
            </Reveal>

            <Reveal animation="blur" at={0.6}>
              <p style={{ fontSize: "14px", color: "#555" }}>
                Progress: {Math.round(progress * 100)}%
              </p>
            </Reveal>
          </div>
        )}
      </Scene>

      {/* 2. Parallax */}
      <div style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
        <span className="section-label">{"<Parallax>"}</span>
        <Parallax speed={0.3}>
          <div
            style={{
              height: "140vh",
              background: "linear-gradient(180deg, #1a0505, #0a0a0a, #050a1a)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p style={{ fontSize: "48px", fontWeight: 700, opacity: 0.15 }}>
              PARALLAX BACKGROUND
            </p>
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
          <Parallax speed={1.5}>
            <div
              style={{
                padding: "20px 40px",
                background: "#dc2626",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "24px",
              }}
            >
              Foreground (speed: 1.5)
            </div>
          </Parallax>
        </div>
      </div>

      {/* 3. Counter */}
      <Scene duration="250vh">
        {() => (
          <div
            style={{
              height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "60px",
              position: "relative",
            }}
          >
            <span className="section-label">{"<Counter>"}</span>
            {[
              { from: 0, to: 10000, label: "Users" },
              { from: 0, to: 50, label: "Countries" },
              { from: 0, to: 99.9, label: "Uptime", fmt: (n: number) => `${n.toFixed(1)}%` },
            ].map((s, i) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <Counter
                  from={s.from}
                  to={s.to}
                  at={0.1 + i * 0.1}
                  span={0.4}
                  format={s.fmt}
                  style={{ fontSize: "48px", fontWeight: 800, color: "#dc2626" }}
                />
                <p style={{ fontSize: "14px", color: "#666", marginTop: "8px" }}>{s.label}</p>
              </div>
            ))}
          </div>
        )}
      </Scene>

      {/* 4. TextReveal */}
      <Scene duration="300vh">
        {(progress) => (
          <div
            style={{
              height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 10%",
              position: "relative",
            }}
          >
            <span className="section-label">{"<TextReveal>"}</span>
            <TextReveal
              progress={progress}
              mode="word"
              at={0.1}
              span={0.7}
              style={{ fontSize: "clamp(24px, 4vw, 48px)", fontWeight: 600, lineHeight: 1.4 }}
            >
              Scroll-driven storytelling components for React. Build cinematic
              experiences without the complexity. Core engine under one kilobyte.
            </TextReveal>
          </div>
        )}
      </Scene>

      {/* 5. CompareSlider */}
      <Scene duration="200vh">
        {() => (
          <div
            style={{
              height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <span className="section-label">{"<CompareSlider>"}</span>
            <div style={{ width: "80%", maxWidth: "600px", aspectRatio: "16/9" }}>
              <CompareSlider
                scrollDriven
                before={
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background: "#1a1a1a",
                      display: "grid",
                      placeItems: "center",
                      fontSize: "24px",
                      fontWeight: 700,
                    }}
                  >
                    Before
                  </div>
                }
                after={
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background: "#dc2626",
                      display: "grid",
                      placeItems: "center",
                      fontSize: "24px",
                      fontWeight: 700,
                    }}
                  >
                    After
                  </div>
                }
              />
            </div>
          </div>
        )}
      </Scene>

      {/* 6. HorizontalScroll */}
      <HorizontalScroll>
        {["Panel One", "Panel Two", "Panel Three", "Panel Four"].map((title, i) => (
          <Panel key={title}>
            <div
              style={{
                height: "100%",
                background: `hsl(${i * 30}, 10%, ${8 + i * 3}%)`,
                display: "grid",
                placeItems: "center",
                position: "relative",
              }}
            >
              {i === 0 && <span className="section-label">{"<HorizontalScroll>"}</span>}
              <h2 style={{ fontSize: "48px", fontWeight: 800 }}>{title}</h2>
            </div>
          </Panel>
        ))}
      </HorizontalScroll>

      {/* 7. Marquee */}
      <div style={{ padding: "40px 0", borderTop: "1px solid #1a1a1a", borderBottom: "1px solid #1a1a1a", position: "relative" }}>
        <span className="section-label">{"<Marquee>"}</span>
        <Marquee speed={40}>
          {["Scene", "Reveal", "Parallax", "Counter", "TextReveal", "CompareSlider", "HorizontalScroll", "Progress", "VideoScroll", "Marquee", "StickyHeader"].map(
            (name) => (
              <span
                key={name}
                style={{
                  padding: "8px 24px",
                  fontSize: "14px",
                  fontFamily: "monospace",
                  color: "#666",
                  whiteSpace: "nowrap",
                }}
              >
                {"<"}{name}{" />"}
              </span>
            )
          )}
        </Marquee>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "80px 24px",
          textAlign: "center",
          color: "#444",
          fontSize: "14px",
        }}
      >
        <p>
          All components rendered from{" "}
          <code style={{ color: "#dc2626" }}>react-kino@0.1.2</code> installed
          via npm.
        </p>
      </div>
    </Kino>
  );
}

export default App;
