import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { BRAND, FONT_DISPLAY, FONT_BODY } from "./theme";

const STATS = [
  { value: "< 1 KB", label: "Core engine, gzipped", delay: 3 },
  { value: "Zero", label: "Runtime dependencies", delay: 8 },
  { value: "12", label: "Ready-made components", delay: 13 },
  { value: "SSR", label: "Next.js & server-ready", delay: 18 },
];

export const Stats: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame: frame - 1,
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
      <div
        style={{
          position: "absolute",
          width: 1000,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(220,38,38,0.05), transparent 70%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 80,
          fontFamily: FONT_DISPLAY,
          fontSize: 20,
          fontWeight: 600,
          color: BRAND.textDim,
          letterSpacing: 5,
          textTransform: "uppercase",
          opacity: titleSpring,
        }}
      >
        Built Different
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 60,
          maxWidth: 900,
        }}
      >
        {STATS.map((stat, i) => {
          const s = spring({
            frame: frame - stat.delay,
            fps,
            config: { damping: 18, stiffness: 120, mass: 0.8 },
          });
          const scale = interpolate(s, [0, 1], [0.6, 1]);
          const y = interpolate(s, [0, 1], [30, 0]);

          const lineWidth = interpolate(
            frame,
            [stat.delay + 4, stat.delay + 12],
            [0, 100],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );

          return (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: i % 2 === 0 ? "flex-end" : "flex-start",
                opacity: s,
                transform: `scale(${scale}) translateY(${y}px)`,
                minWidth: 320,
              }}
            >
              <div
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: 80,
                  fontWeight: 700,
                  color: BRAND.text,
                  lineHeight: 1,
                  letterSpacing: -2,
                }}
              >
                {stat.value}
              </div>

              <div
                style={{
                  width: `${lineWidth}%`,
                  height: 3,
                  backgroundColor: BRAND.red,
                  borderRadius: 2,
                  marginTop: 8,
                  marginBottom: 10,
                  /* no glow */
                }}
              />

              <div
                style={{
                  fontFamily: FONT_BODY,
                  fontSize: 18,
                  fontWeight: 400,
                  color: BRAND.textDim,
                }}
              >
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
