import { useEffect, useState } from "react";
import { AbsoluteFill, Audio, continueRender, delayRender, staticFile } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";

import { Intro } from "./intro";
import { Tagline } from "./tagline";
import { TextRevealDemo } from "./text-reveal-demo";
import { ParallaxDemo } from "./parallax-demo";
import { CompareDemo } from "./compare-demo";
import { HorizontalScrollDemo } from "./horizontal-scroll-demo";
import { ProgressDemo } from "./progress-demo";
import { CounterDemo } from "./counter-demo";
import { ComponentGrid } from "./component-grid";
import { Stats } from "./stats";
import { Outro } from "./outro";
import { SCENES, waitForFonts } from "./theme";

const T = SCENES.TRANSITION;

export const LaunchVideo: React.FC = () => {
  const [handle] = useState(() => delayRender("Loading fonts..."));

  useEffect(() => {
    waitForFonts()
      .then(() => continueRender(handle))
      .catch((err) => {
        console.error("Font loading failed", err);
        continueRender(handle);
      });
  }, [handle]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Audio src={staticFile("binary-eclipse.mp3")} />
      <TransitionSeries>
        {/* ── 1. Intro — Logo reveal ── */}
        <TransitionSeries.Sequence durationInFrames={SCENES.INTRO}>
          <Intro />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: T })}
        />

        {/* ── 2. Tagline — Word-by-word value prop ── */}
        <TransitionSeries.Sequence durationInFrames={SCENES.TAGLINE}>
          <Tagline />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe()}
          timing={linearTiming({ durationInFrames: T })}
        />

        {/* ── 3. TextReveal demo ── */}
        <TransitionSeries.Sequence durationInFrames={SCENES.TEXT_REVEAL}>
          <TextRevealDemo />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: T })}
        />

        {/* ── 4. Parallax demo ── */}
        <TransitionSeries.Sequence durationInFrames={SCENES.PARALLAX}>
          <ParallaxDemo />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: T })}
        />

        {/* ── 5. CompareSlider demo ── */}
        <TransitionSeries.Sequence durationInFrames={SCENES.COMPARE}>
          <CompareDemo />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-left" })}
          timing={linearTiming({ durationInFrames: T })}
        />

        {/* ── 6. HorizontalScroll demo ── */}
        <TransitionSeries.Sequence durationInFrames={SCENES.HORIZONTAL_SCROLL}>
          <HorizontalScrollDemo />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: T })}
        />

        {/* ── 7. Progress demo ── */}
        <TransitionSeries.Sequence durationInFrames={SCENES.PROGRESS}>
          <ProgressDemo />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe()}
          timing={linearTiming({ durationInFrames: T })}
        />

        {/* ── 8. Counter demo ── */}
        <TransitionSeries.Sequence durationInFrames={SCENES.COUNTER}>
          <CounterDemo />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={linearTiming({ durationInFrames: T })}
        />

        {/* ── 9. Component grid — everything unlocks ── */}
        <TransitionSeries.Sequence durationInFrames={SCENES.GRID}>
          <ComponentGrid />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: T })}
        />

        {/* ── 10. Stats — the numbers ── */}
        <TransitionSeries.Sequence durationInFrames={SCENES.STATS}>
          <Stats />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: T })}
        />

        {/* ── 11. Outro — CTA ── */}
        <TransitionSeries.Sequence durationInFrames={SCENES.OUTRO}>
          <Outro />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
