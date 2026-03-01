import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { BRAND, FONT_BODY, FONT_CODE, FONT_DISPLAY } from "./theme";

const TEXT = "Every pixel tells a story";
const WORDS = TEXT.split(" ");
const REVEAL_START = 4;
const REVEAL_SPAN = 22;

export const TextRevealDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tagSpring = spring({
    frame: frame - 2,
    fps,
    config: { damping: 200 },
  });

  const progress = interpolate(
    frame,
    [REVEAL_START, REVEAL_START + REVEAL_SPAN],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  /* How many words are fully revealed — integer, no flickering */
  const revealedCount = Math.floor(progress * WORDS.length);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BRAND.bg,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Ambient glow — no filter:blur */}
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 300,
          borderRadius: "50%",
          background: `radial-gradient(ellipse, rgba(220,38,38,0.07), transparent 70%)`,
        }}
      />

      {/* Component tag */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: 80,
          fontFamily: FONT_CODE,
          fontSize: 16,
          fontWeight: 500,
          color: BRAND.red,
          opacity: tagSpring,
          backgroundColor: "rgba(220,38,38,0.07)",
          padding: "6px 16px",
          borderRadius: 6,
          border: "1px solid rgba(220,38,38,0.19)",
        }}
      >
        {"<TextReveal>"}
      </div>

      <div
        style={{
          position: "absolute",
          top: 80,
          fontFamily: FONT_DISPLAY,
          fontSize: 18,
          fontWeight: 600,
          color: BRAND.textDim,
          letterSpacing: 5,
          textTransform: "uppercase",
          opacity: tagSpring,
        }}
      >
        Component Showcase
      </div>

      {/* All words always in the DOM — only color changes */}
      <div
        style={{
          display: "flex",
          gap: 24,
          flexWrap: "wrap",
          justifyContent: "center",
          maxWidth: 1100,
        }}
      >
        {WORDS.map((word, i) => (
          <span
            key={word}
            style={{
              fontFamily: FONT_BODY,
              fontSize: 88,
              fontWeight: 600,
              color: i < revealedCount ? BRAND.text : BRAND.textDimmer,
              display: "inline-block",
            }}
          >
            {word}
          </span>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 60,
          right: 80,
          fontFamily: FONT_CODE,
          fontSize: 14,
          color: BRAND.textDim,
          opacity: tagSpring,
        }}
      >
        progress: {Math.round(progress * 100)}%
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: 80,
          right: 80,
          height: 2,
          backgroundColor: BRAND.border,
          borderRadius: 1,
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: "100%",
            backgroundColor: BRAND.red,
            borderRadius: 1,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
