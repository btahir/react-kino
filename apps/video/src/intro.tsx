import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { BRAND, FONT_DISPLAY, FONT_BODY } from "./theme";

const GRID_SPACING = 60;
const GRID_COLS = Math.ceil(1920 / GRID_SPACING) + 1;
const GRID_ROWS = Math.ceil(1080 / GRID_SPACING) + 1;

const ORBS = [
  { x: 280, y: 750, dx: 50, dy: -180, size: 320, delay: 10 },
  { x: 1520, y: 180, dx: -70, dy: 160, size: 280, delay: 16 },
  { x: 850, y: 880, dx: 25, dy: -260, size: 360, delay: 8 },
];

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* ── Red dot expands (f0→18) ── */
  const dotScale = interpolate(frame, [2, 8, 18], [0, 1.2, 60], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const dotOpacity = interpolate(frame, [2, 6, 14, 20], [0, 0.9, 0.5, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* ── Grid fades in (f8→22) then holds ── */
  const gridOpacity = interpolate(frame, [8, 22], [0, 0.08], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* ── Logo springs in (f16+) ── */
  const logoSpring = spring({
    frame: frame - 16,
    fps,
    config: { damping: 20, stiffness: 120, mass: 0.8 },
  });
  const logoScale = interpolate(logoSpring, [0, 1], [0.55, 1]);
  const logoOpacity = interpolate(frame, [16, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* ── Subtitle entrance (f26+) ── */
  const subSpring = spring({
    frame: frame - 26,
    fps,
    config: { damping: 200 },
  });
  const subY = interpolate(subSpring, [0, 1], [24, 0]);

  /* ── Glow — smooth fade in, then holds steady ── */
  const glowOpacity = interpolate(frame, [18, 40], [0, 0.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.bg }}>
      {/* Grid */}
      <AbsoluteFill style={{ opacity: gridOpacity }}>
        <svg width={1920} height={1080}>
          {Array.from({ length: GRID_COLS }, (_, i) => (
            <line
              key={`v${i}`}
              x1={i * GRID_SPACING}
              y1={0}
              x2={i * GRID_SPACING}
              y2={1080}
              stroke={BRAND.red}
              strokeWidth={0.5}
              opacity={0.35}
            />
          ))}
          {Array.from({ length: GRID_ROWS }, (_, i) => (
            <line
              key={`h${i}`}
              x1={0}
              y1={i * GRID_SPACING}
              x2={1920}
              y2={i * GRID_SPACING}
              stroke={BRAND.red}
              strokeWidth={0.5}
              opacity={0.35}
            />
          ))}
        </svg>
      </AbsoluteFill>

      {/* Expanding dot */}
      <AbsoluteFill
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            backgroundColor: BRAND.red,
            transform: `scale(${dotScale})`,
            opacity: dotOpacity,
          }}
        />
      </AbsoluteFill>

      {/* Floating orbs — large soft gradients, no filter:blur */}
      {ORBS.map((orb, i) => {
        const o = interpolate(
          frame,
          [orb.delay, orb.delay + 12, 95],
          [0, 0.15, 0.12],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: orb.x + interpolate(frame, [0, 95], [0, orb.dx]),
              top: orb.y + interpolate(frame, [0, 95], [0, orb.dy]),
              width: orb.size,
              height: orb.size,
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(220,38,38,0.2), transparent 70%)`,
              opacity: o,
            }}
          />
        );
      })}

      {/* Logo + subtitle */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
        }}
      >
        {/* Steady glow behind logo — no filter:blur, no pulsing */}
        <div
          style={{
            position: "absolute",
            width: 800,
            height: 300,
            borderRadius: "50%",
            background: `radial-gradient(ellipse, rgba(220,38,38,0.15), transparent 70%)`,
            opacity: glowOpacity,
          }}
        />

        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 150,
            fontWeight: 700,
            letterSpacing: -4,
            color: BRAND.text,
            position: "relative",
          }}
        >
          react-
          <span style={{ color: BRAND.red }}>kino</span>
        </div>

        <div
          style={{
            fontFamily: FONT_BODY,
            fontSize: 26,
            fontWeight: 300,
            color: BRAND.textDim,
            marginTop: 18,
            letterSpacing: 6,
            textTransform: "uppercase",
            opacity: subSpring,
            transform: `translateY(${subY}px)`,
          }}
        >
          Scroll-Driven Storytelling
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
