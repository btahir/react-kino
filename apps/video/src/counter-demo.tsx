import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { BRAND, FONT_DISPLAY, FONT_CODE, FONT_BODY } from "./theme";

const COUNTERS = [
  { from: 0, to: 1, label: "KB gzipped", prefix: "<", suffix: "", delay: 4 },
  { from: 0, to: 12, label: "Components", prefix: "", suffix: "", delay: 10 },
  { from: 0, to: 5, label: "Hooks", prefix: "", suffix: "", delay: 16 },
  { from: 0, to: 30, label: "FPS target", prefix: "", suffix: "", delay: 22 },
];

export const CounterDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tagSpring = spring({
    frame: frame - 2,
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
      {/* Section label */}
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
        Animated Counters
      </div>

      <div
        style={{
          display: "flex",
          gap: 80,
          alignItems: "flex-end",
        }}
      >
        {COUNTERS.map((counter, i) => {
          const counterProgress = interpolate(
            frame,
            [counter.delay, counter.delay + 20],
            [0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.quad),
            },
          );

          const value = Math.round(
            interpolate(counterProgress, [0, 1], [counter.from, counter.to]),
          );

          const entrySpring = spring({
            frame: frame - counter.delay,
            fps,
            config: { damping: 18, stiffness: 120, mass: 0.8 },
          });
          const scale = interpolate(entrySpring, [0, 1], [0.7, 1]);
          const y = interpolate(entrySpring, [0, 1], [40, 0]);

          return (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                opacity: entrySpring,
                transform: `scale(${scale}) translateY(${y}px)`,
                minWidth: 180,
              }}
            >
              <div
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: 100,
                  fontWeight: 700,
                  color: BRAND.text,
                  lineHeight: 1,
                  letterSpacing: -3,
                }}
              >
                {counter.prefix}
                {value}
                {counter.suffix}
              </div>
              <div
                style={{
                  width: 40,
                  height: 3,
                  backgroundColor: BRAND.red,
                  borderRadius: 2,
                }}
              />
              <div
                style={{
                  fontFamily: FONT_BODY,
                  fontSize: 18,
                  fontWeight: 400,
                  color: BRAND.textDim,
                  textTransform: "uppercase",
                  letterSpacing: 2,
                }}
              >
                {counter.label}
              </div>
            </div>
          );
        })}
      </div>

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
        {"<Counter>"}
      </div>
    </AbsoluteFill>
  );
};
