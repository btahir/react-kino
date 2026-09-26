"use client";
import { useRef, useState } from "react";
import {
  Kino,
  Scene,
  Reveal,
  Parallax,
  HorizontalScroll,
  Panel,
  VideoScroll,
} from "react-kino";
import { Story } from "react-kino/story";
import { createStoryRecipe } from "react-kino/recipes";
export default function RuntimeCheck() {
  const root = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(650);
  const [expanded, setExpanded] = useState(false);
  const story = createStoryRecipe();
  story.scenes = story.scenes.slice(0, 1);
  story.scenes[0].layers[0].track!.to.opacity = 0;
  story.scenes[0].layers.push({
    id: "tall",
    kind: "component",
    content: "Tall",
  });
  return (
    <main style={{ padding: 24 }}>
      <h1>Runtime verification fixtures</h1>
      <button onClick={() => setHeight((h) => (h === 650 ? 300 : 650))}>
        Resize root
      </button>
      <button onClick={() => setExpanded((v) => !v)}>Expand content</button>
      <div
        ref={root}
        data-testid="scroll-root"
        style={{
          height,
          overflow: "auto",
          border: "1px solid",
          position: "relative",
        }}
      >
        <Kino root={root}>
          <div style={{ height: 100 }}>Root intro</div>
          <Scene duration="300vh">
            <div
              data-testid="dynamic-content"
              style={{ height: expanded ? 1000 : 180 }}
            >
              Dynamic content
            </div>
            <Reveal at={0.95}>
              <p data-testid="late-reveal">Late essential copy</p>
            </Reveal>
          </Scene>
          <div style={{ height: 200 }}>Spacing</div>
          <Parallax from={200} to={-100}>
            <p data-testid="local-parallax">Local parallax text</p>
          </Parallax>
          <div style={{ height: 1000 }}>Room to scroll</div>
        </Kino>
      </div>
      <div data-testid="tall-story">
        <Story
          document={story}
          components={{
            Tall: <div style={{ height: 1500 }}>Tall registered component</div>,
          }}
        />
      </div>
      <HorizontalScroll>
        <Panel>First horizontal panel</Panel>
        <Panel>Second horizontal panel</Panel>
        <Panel>Third horizontal panel</Panel>
      </HorizontalScroll>
      <VideoScroll src="/unavailable-video.mp4" label="Unavailable fixture">
        <p>Readable media caption</p>
      </VideoScroll>
    </main>
  );
}
