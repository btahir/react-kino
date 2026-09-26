"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import {
  Kino,
  Scene,
  Reveal,
  Parallax,
  Counter,
  TextReveal,
  CompareSlider,
  HorizontalScroll,
  Panel,
  VideoScroll,
} from "react-kino";
import { createRecipeComponents } from "react-kino/recipe-kit";
import { Story } from "react-kino/story";
import { createStoryRecipe } from "react-kino/recipes";
import "../landing.css";
const components = createRecipeComponents();
const panel = {
  padding: 28,
  background: "#203c34",
  color: "#f4efdf",
  borderRadius: 14,
};
export default function Playground() {
  const root = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0.5);
  const [reading, setReading] = useState(false);
  return (
    <main className="kino-landing kino-lab">
      <nav className="kl-nav">
        <Link href="/">
          kino<span> / component lab</span>
        </Link>
        <Link href="/studio">Open Storyboard ↗</Link>
      </nav>
      <section style={{ maxWidth: 1100, margin: "auto", padding: "60px 24px" }}>
        <p className="kl-eyebrow">Small experiments. Real components.</p>
        <h1
          style={{
            fontSize: "clamp(38px,6vw,76px)",
            lineHeight: 1.05,
            letterSpacing: "-.05em",
          }}
        >
          Feel how a story moves.
        </h1>
        <p style={{ maxWidth: 620, lineHeight: 1.7 }}>
          Adjust a document, scroll a contained scene, compare two layouts, and
          see the reading fallback. These examples use the same public
          components your application imports.
        </p>
        <h2 style={{ marginTop: 60 }}>A story you can scrub</h2>
        <label
          style={{
            display: "flex",
            gap: 16,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          Scene progress{" "}
          <input
            aria-label="Story progress"
            type="range"
            min="0"
            max="1"
            step=".01"
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            style={{ flex: 1 }}
          />
          <output>{Math.round(progress * 100)}%</output>
        </label>
        <label style={{ display: "block", margin: "16px 0" }}>
          <input
            type="checkbox"
            checked={reading}
            onChange={(e) => setReading(e.target.checked)}
          />{" "}
          Reading layout: keep every layer visible
        </label>
        <Story
          document={createStoryRecipe("launch")}
          components={components}
          sceneId="introduce"
          progress={progress}
          reading={reading}
        />
        <p>
          <Link href="/docs/authoring">Document and renderer API ↗</Link>
        </p>
        <h2 style={{ marginTop: 60 }}>Scroll inside this frame</h2>
        <p>
          The frame owns its scroll position. The scene, reveals, counter and
          local parallax all read that root.
        </p>
        <div
          ref={root}
          tabIndex={0}
          aria-label="Scrollable runtime example"
          style={{
            height: 440,
            overflow: "auto",
            border: "2px solid #647563",
            borderRadius: 16,
            background: "#173b31",
            color: "#f3eedc",
          }}
        >
          <Kino root={root}>
            <div style={{ padding: 36 }}>Scroll this frame ↓</div>
            <Scene duration="250vh">
              <div style={{ padding: 32 }}>
                <h3 style={{ fontSize: 38 }}>
                  <TextReveal>The details come into focus.</TextReveal>
                </h3>
                <Reveal at={0.2}>
                  <p style={{ fontSize: 20 }}>
                    A late reveal stays readable when a scene becomes too tall.
                  </p>
                </Reveal>
                <div style={{ fontSize: 52 }}>
                  <Counter
                    from={0}
                    to={100}
                    format={(n) => `${Math.round(n)}%`}
                  />
                </div>
                <Parallax from={-15} to={15}>
                  <div
                    style={{
                      marginTop: 24,
                      padding: 18,
                      border: "1px solid #9aac89",
                      borderRadius: 12,
                    }}
                  >
                    A small, local parallax movement.
                  </div>
                </Parallax>
              </div>
            </Scene>
            <div style={{ padding: 36 }}>End of the contained story.</div>
          </Kino>
        </div>
        <h2 style={{ marginTop: 60 }}>A real comparison</h2>
        <p>Drag the divider, or focus it and use the arrow keys.</p>
        <CompareSlider
          before={components.Before}
          after={components.After}
          ariaLabel="Compare original and revised layout"
        />
        <h2 style={{ marginTop: 60 }}>Horizontal chapters</h2>
        <p>
          Scroll the page. With reduced motion enabled, these panels become an
          ordinary vertical reading flow.
        </p>
        <HorizontalScroll>
          <Panel>
            <div style={panel}>
              <h3>01 / Context</h3>
              <p>Start with something worth understanding.</p>
            </div>
          </Panel>
          <Panel>
            <div style={panel}>
              <h3>02 / Detail</h3>
              <p>Bring the important detail into view.</p>
            </div>
          </Panel>
          <Panel>
            <div style={panel}>
              <h3>03 / Outcome</h3>
              <p>Leave your reader with a clear next step.</p>
            </div>
          </Panel>
        </HorizontalScroll>
        <h2>Scroll a real video</h2>
        <p>
          Original, four-second schematic interface animation. Scroll through
          the scene to seek the clip; reduced motion keeps its poster and
          caption.
        </p>
        <VideoScroll
          src="/examples/workspace.mp4"
          poster="/examples/workspace-poster.jpg"
          label="A camera moving across an original schematic workspace"
          duration="220vh"
        >
          <p
            style={{
              padding: 24,
              background: "#173b31",
              color: "#fff",
              maxWidth: 420,
            }}
          >
            The interface moves. Its explanation remains ordinary text.
          </p>
        </VideoScroll>
        <h2>Media failure is a readable state</h2>
        <p>
          This deliberately missing local file demonstrates an actual error
          path. Replace the source with your own optimized, licensed video.
        </p>
        <VideoScroll
          src="/examples/missing-video.mp4"
          label="Sample video"
          fallback={
            <p style={panel}>
              This sample has no video file. The story continues with its
              caption.
            </p>
          }
        >
          <p style={{ padding: 24 }}>
            Essential text stays available when media fails or motion is
            reduced.
          </p>
        </VideoScroll>
        <p>
          <Link href="/docs/recipes/video-story">
            Build a video story with your own footage ↗
          </Link>
        </p>
      </section>
    </main>
  );
}
