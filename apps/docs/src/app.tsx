import "./app.css";
import { Kino, Progress } from "react-kino";
import { Hero } from "./sections/hero";
import { SceneDemo } from "./sections/scene-demo";
import { RevealDemo } from "./sections/reveal-demo";
import { TextRevealDemo } from "./sections/text-reveal-demo";
import { ParallaxDemo } from "./sections/parallax-demo";
import { CounterDemo } from "./sections/counter-demo";
import { VideoScrollDemo } from "./sections/video-scroll-demo";
import { CompareDemo } from "./sections/compare-demo";
import { HorizontalDemo } from "./sections/horizontal-demo";
import { Footer } from "./sections/footer";

export function App() {
  return (
    <Kino>
      <Progress type="bar" position="top" color="#7c3aed" />
      <Hero />
      <SceneDemo />
      <RevealDemo />
      <TextRevealDemo />
      <ParallaxDemo />
      <CounterDemo />
      <VideoScrollDemo />
      <CompareDemo />
      <HorizontalDemo />
      <Footer />
    </Kino>
  );
}
