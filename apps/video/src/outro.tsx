import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { BRAND, FONT_DISPLAY, FONT_BODY, FONT_CODE } from "./theme";

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* Logo entrance */
  const logoSpring = spring({
    frame: frame - 3,
    fps,
    config: { damping: 200 },
  });
  const logoY = interpolate(logoSpring, [0, 1], [20, 0]);

  /* Install command typewriter */
  const INSTALL_CMD = "npm install react-kino";
  const typeStart = 12;
  const typeEnd = 28;
  const charsVisible = Math.floor(
    interpolate(frame, [typeStart, typeEnd], [0, INSTALL_CMD.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const typedText = INSTALL_CMD.slice(0, charsVisible);
  const cursorVisible = frame > typeStart && frame % 10 < 6;

  /* Tagline */
  const taglineSpring = spring({
    frame: frame - 25,
    fps,
    config: { damping: 200 },
  });

  /* Glow */
  const glowOpacity = interpolate(frame, [6, 18], [0, 0.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.bg }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "40%",
          transform: "translate(-50%, -50%)",
          width: 800,
          height: 350,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(220,38,38,0.12), transparent 70%)",
          opacity: glowOpacity,
        }}
      />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 0,
        }}
      >
        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 90,
            fontWeight: 700,
            letterSpacing: -3,
            color: BRAND.text,
            opacity: logoSpring,
            transform: `translateY(${logoY}px)`,
          }}
        >
          react-<span style={{ color: BRAND.red }}>kino</span>
        </div>

        <div
          style={{
            marginTop: 40,
            fontFamily: FONT_CODE,
            fontSize: 22,
            fontWeight: 400,
            color: BRAND.textDim,
            backgroundColor: BRAND.bgCard,
            border: `1px solid ${BRAND.border}`,
            padding: "14px 32px",
            borderRadius: 10,
            opacity: interpolate(frame, [typeStart - 3, typeStart], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <span style={{ color: BRAND.textDimmer }}>$ </span>
          <span style={{ color: BRAND.text }}>{typedText}</span>
          <span
            style={{
              color: BRAND.red,
              opacity: cursorVisible ? 1 : 0,
            }}
          >
            |
          </span>
        </div>

        <div
          style={{
            marginTop: 36,
            fontFamily: FONT_BODY,
            fontSize: 24,
            fontWeight: 300,
            color: BRAND.textDim,
            letterSpacing: 3,
            textTransform: "uppercase",
            opacity: taglineSpring,
            transform: `translateY(${interpolate(taglineSpring, [0, 1], [12, 0])}px)`,
          }}
        >
          Built for the scroll era
        </div>
      </AbsoluteFill>

    </AbsoluteFill>
  );
};
