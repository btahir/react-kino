import { Scene, TextReveal } from "react-kino";

export function TextRevealDemo() {
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
          Words that appear.
        </h2>
        <p style={{ fontSize: "18px", lineHeight: 1.7, color: "#888888" }}>
          Reveal text word-by-word, character-by-character, or line-by-line as
          you scroll.
        </p>
      </div>

      <Scene duration="200vh">
        {(progress) => (
          <div
            style={{
              width: "100%",
              height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 24px",
            }}
          >
            <div
              style={{
                maxWidth: "700px",
                fontSize: "clamp(24px, 4vw, 42px)",
                fontWeight: 600,
                lineHeight: 1.4,
                letterSpacing: "-0.02em",
                textAlign: "center",
              }}
            >
              <TextReveal progress={progress} mode="word" at={0.1} span={0.7}>
                Scroll-driven storytelling components for React. Build cinematic
                experiences without the complexity.
              </TextReveal>
            </div>
          </div>
        )}
      </Scene>
    </section>
  );
}
