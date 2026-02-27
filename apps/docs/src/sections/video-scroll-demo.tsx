import { Scene } from "react-kino";

export function VideoScrollDemo() {
  return (
    <section style={{ padding: "80px 0 0" }}>
      <div
        style={{
          textAlign: "center",
          maxWidth: "600px",
          margin: "0 auto",
          padding: "0 24px 60px",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(40px, 5vw, 72px)",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
            marginBottom: "16px",
          }}
        >
          Scroll-driven video.
        </h2>
        <p style={{ fontSize: "18px", lineHeight: 1.7, color: "#888888" }}>
          Scrub through video frames as the user scrolls. Like the AirPods Pro
          product page.
        </p>
      </div>

      <Scene duration="300vh">
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
              gap: "32px",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "800px",
                aspectRatio: "16/9",
                background: "#1a1a1a",
                border: "1px solid #2a2a2a",
                borderRadius: "12px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
                padding: "32px",
              }}
            >
              <div
                style={{
                  fontSize: "48px",
                  lineHeight: 1,
                }}
              >
                VideoScroll
              </div>
              <div
                style={{
                  fontSize: "clamp(24px, 4vw, 48px)",
                  fontWeight: 700,
                  color: "#a78bfa",
                }}
              >
                {(progress * 100).toFixed(1)}%
              </div>
              <div style={{ fontSize: "15px", color: "#888888" }}>
                currentTime would be: {(progress * 30).toFixed(2)}s of 30s video
              </div>
            </div>

            <div
              style={{
                maxWidth: "600px",
                width: "100%",
                background: "#1a1a1a",
                border: "1px solid #2a2a2a",
                borderRadius: "8px",
                padding: "16px 20px",
                fontFamily: "'SF Mono', 'Fira Code', monospace",
                fontSize: "13px",
                color: "#a78bfa",
                lineHeight: 1.6,
                whiteSpace: "pre",
                overflow: "auto",
              }}
            >
              {`<VideoScroll src="/product.mp4" duration="300vh">\n  {(progress) => <HeroText progress={progress} />}\n</VideoScroll>`}
            </div>
          </div>
        )}
      </Scene>
    </section>
  );
}
