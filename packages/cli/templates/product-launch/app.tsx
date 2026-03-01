import { Kino, Scene, Reveal, CompareSlider } from "react-kino";

export default function __PROJECT_NAME__() {
  return (
    <Kino>
      {/* Hero section — fades in on scroll */}
      <Scene duration="200vh">
        <Reveal animation="fade" at={0.05}>
          <div style={{ textAlign: "center", padding: "20vh 2rem" }}>
            <h1 style={{ fontSize: "4rem", fontWeight: 700 }}>
              Introducing __PROJECT_NAME__
            </h1>
            <p style={{ fontSize: "1.25rem", opacity: 0.7, maxWidth: 600, margin: "1rem auto" }}>
              A cinematic scroll experience built with react-kino.
            </p>
          </div>
        </Reveal>
      </Scene>

      {/* Features section — each feature reveals on scroll */}
      <Scene duration="300vh">
        <Reveal animation="fade-up" at={0.15}>
          <div style={{ display: "grid", gap: "4rem", padding: "10vh 2rem", maxWidth: 800, margin: "0 auto" }}>
            <Feature title="Blazing Fast" description="Built on a tiny RAF-driven scroll engine for smooth performance." />
            <Feature title="Framework Ready" description="Works with Next.js, Vite, and any React setup." />
            <Feature title="Accessible" description="Respects prefers-reduced-motion out of the box." />
          </div>
        </Reveal>
      </Scene>

      {/* Before / After comparison */}
      <Scene duration="200vh">
        <CompareSlider
          before={<div style={{ background: "#1a1a2e", width: "100%", height: "100vh", display: "grid", placeItems: "center", color: "#fff" }}>Before</div>}
          after={<div style={{ background: "#e94560", width: "100%", height: "100vh", display: "grid", placeItems: "center", color: "#fff" }}>After</div>}
        />
      </Scene>
    </Kino>
  );
}

function Feature({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h2 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{title}</h2>
      <p style={{ fontSize: "1.125rem", opacity: 0.7 }}>{description}</p>
    </div>
  );
}
