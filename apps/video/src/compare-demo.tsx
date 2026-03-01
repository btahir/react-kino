import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { BRAND, FONT_CODE, FONT_DISPLAY, FONT_BODY } from "./theme";

export const CompareDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tagSpring = spring({
    frame: frame - 2,
    fps,
    config: { damping: 200 },
  });

  const dividerPos = interpolate(frame, [4, 30], [0.12, 0.88], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  const leftPct = `${dividerPos * 100}%`;

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.bg }}>
      {/* BEFORE side */}
      <AbsoluteFill>
        <div
          style={{
            width: "100%",
            height: "100%",
            background: `linear-gradient(135deg, #0a0a0a, #1a1a1a)`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 24,
          }}
        >
          {[280, 380, 480, 580].map((_, i) => (
            <div
              key={i}
              style={{
                width: 500 - i * 60,
                height: 16,
                backgroundColor: "#1f1f1f",
                borderRadius: 8,
              }}
            />
          ))}
          <div
            style={{
              fontFamily: FONT_BODY,
              fontSize: 22,
              color: "#2a2a2a",
              marginTop: 20,
              textTransform: "uppercase",
              letterSpacing: 6,
            }}
          >
            Static Content
          </div>
        </div>
      </AbsoluteFill>

      {/* AFTER side */}
      <AbsoluteFill style={{ clipPath: `inset(0 0 0 ${leftPct})` }}>
        <div
          style={{
            width: "100%",
            height: "100%",
            background: `linear-gradient(135deg, ${BRAND.bg}, #1a0a0a)`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 20,
          }}
        >
          {[0, 1, 2, 3].map((i) => {
            const barProgress = interpolate(
              frame,
              [6 + i * 4, 18 + i * 4],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );
            return (
              <div
                key={i}
                style={{
                  width: 500 - i * 60,
                  height: 16,
                  backgroundColor: BRAND.border,
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${barProgress * 100}%`,
                    height: "100%",
                    background: `linear-gradient(90deg, ${BRAND.redDark}, ${BRAND.red})`,
                    borderRadius: 8,
                    boxShadow: `0 0 16px ${BRAND.redGlow}`,
                  }}
                />
              </div>
            );
          })}
          <div
            style={{
              fontFamily: FONT_BODY,
              fontSize: 22,
              color: BRAND.red,
              marginTop: 20,
              textTransform: "uppercase",
              letterSpacing: 6,
            }}
          >
            Scroll-Driven
          </div>
        </div>
      </AbsoluteFill>

      {/* Divider */}
      <div
        style={{
          position: "absolute",
          left: leftPct,
          top: 0,
          width: 3,
          height: "100%",
          backgroundColor: "#ffffff",
          boxShadow: "0 0 20px rgba(255,255,255,0.3)",
          transform: "translateX(-1.5px)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 44,
            height: 44,
            borderRadius: "50%",
            backgroundColor: "#ffffff",
            border: `3px solid ${BRAND.bg}`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 2px 12px rgba(0,0,0,0.5)",
          }}
        >
          <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
            <path
              d="M6 10L2 10M2 10L4.5 7.5M2 10L4.5 12.5M14 10L18 10M18 10L15.5 7.5M18 10L15.5 12.5"
              stroke={BRAND.bg}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div
        style={{
          position: "absolute",
          top: 45,
          left: 80,
          fontFamily: FONT_DISPLAY,
          fontSize: 16,
          fontWeight: 600,
          color: BRAND.textDimmer,
          letterSpacing: 5,
          textTransform: "uppercase",
          opacity: tagSpring,
        }}
      >
        Before
      </div>
      <div
        style={{
          position: "absolute",
          top: 45,
          right: 80,
          fontFamily: FONT_DISPLAY,
          fontSize: 16,
          fontWeight: 600,
          color: BRAND.red,
          letterSpacing: 5,
          textTransform: "uppercase",
          opacity: tagSpring,
        }}
      >
        After
      </div>

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
          background: `${BRAND.red}12`,
          padding: "6px 16px",
          borderRadius: 6,
          border: `1px solid ${BRAND.red}30`,
        }}
      >
        {"<CompareSlider>"}
      </div>
    </AbsoluteFill>
  );
};
