import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { BRAND, FONT_BODY, FONT_CODE } from "./theme";

const WORDS = ["Cinematic", "scroll-driven", "storytelling", "for", "React."];
const REVEAL_START = 4;
const PER_WORD = 6;

export const Tagline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const allWordsEnd = REVEAL_START + WORDS.length * PER_WORD;
  const subSpring = spring({
    frame: frame - allWordsEnd - 2,
    fps,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BRAND.bg,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Subtle ambient glow */}
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(220,38,38,0.08), transparent 70%)",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 22,
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: 1300,
          }}
        >
          {WORDS.map((word, i) => {
            const wordStart = REVEAL_START + i * PER_WORD;
            const progress = interpolate(
              frame,
              [wordStart, wordStart + PER_WORD],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );

            /* Clean dim → bright, no red flash */
            const opacity = interpolate(progress, [0, 0.4, 1], [0.08, 0.6, 1]);
            const scale = interpolate(progress, [0, 0.5, 1], [0.94, 1.03, 1]);

            return (
              <span
                key={i}
                style={{
                  fontFamily: FONT_BODY,
                  fontSize: 76,
                  fontWeight: 500,
                  color: BRAND.text,
                  opacity,
                  transform: `scale(${scale})`,
                  display: "inline-block",
                  whiteSpace: "nowrap",
                }}
              >
                {word}
              </span>
            );
          })}
        </div>

        <div
          style={{
            fontFamily: FONT_CODE,
            fontSize: 20,
            fontWeight: 400,
            color: BRAND.textDim,
            marginTop: 44,
            opacity: subSpring,
            transform: `translateY(${interpolate(subSpring, [0, 1], [16, 0])}px)`,
            letterSpacing: 0.5,
          }}
        >
          Core engine under 1 KB gzipped &middot; zero dependencies
        </div>
      </div>
    </AbsoluteFill>
  );
};
