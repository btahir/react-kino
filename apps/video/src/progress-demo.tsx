import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { BRAND, FONT_DISPLAY, FONT_CODE, FONT_BODY } from "./theme";

const RING_SIZE = 200;
const RING_STROKE = 6;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export const ProgressDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tagSpring = spring({
    frame: frame - 2,
    fps,
    config: { damping: 200 },
  });

  /* Main progress drives all three indicators */
  const progress = interpolate(frame, [6, 54], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  const dashOffset = RING_CIRCUMFERENCE * (1 - progress);

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
        Scroll Indicators
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 140,
        }}
      >
        {/* ── Bar indicator ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              fontFamily: FONT_CODE,
              fontSize: 14,
              color: BRAND.textDim,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Bar
          </div>
          <div
            style={{
              width: 8,
              height: 300,
              backgroundColor: BRAND.border,
              borderRadius: 4,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column-reverse",
            }}
          >
            <div
              style={{
                width: "100%",
                height: `${progress * 100}%`,
                backgroundColor: BRAND.red,
                borderRadius: 4,
              }}
            />
          </div>
          <div
            style={{
              fontFamily: FONT_CODE,
              fontSize: 13,
              color: BRAND.textDimmer,
            }}
          >
            {Math.round(progress * 100)}%
          </div>
        </div>

        {/* ── Ring indicator ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              fontFamily: FONT_CODE,
              fontSize: 14,
              color: BRAND.textDim,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Ring
          </div>
          <div style={{ position: "relative", width: RING_SIZE, height: RING_SIZE }}>
            <svg width={RING_SIZE} height={RING_SIZE}>
              {/* Track */}
              <circle
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                r={RING_RADIUS}
                fill="none"
                stroke={BRAND.border}
                strokeWidth={RING_STROKE}
              />
              {/* Progress arc */}
              <circle
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                r={RING_RADIUS}
                fill="none"
                stroke={BRAND.red}
                strokeWidth={RING_STROKE}
                strokeDasharray={RING_CIRCUMFERENCE}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
              />
            </svg>
            {/* Center percentage */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontFamily: FONT_DISPLAY,
                fontSize: 36,
                fontWeight: 700,
                color: BRAND.text,
              }}
            >
              {Math.round(progress * 100)}
            </div>
          </div>
        </div>

        {/* ── Dots indicator ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              fontFamily: FONT_CODE,
              fontSize: 14,
              color: BRAND.textDim,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Dots
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {Array.from({ length: 10 }, (_, i) => {
              const dotActive = progress >= (i + 1) / 10;
              return (
                <div
                  key={i}
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: dotActive ? BRAND.red : BRAND.border,
                  }}
                />
              );
            })}
          </div>
          <div
            style={{
              fontFamily: FONT_CODE,
              fontSize: 13,
              color: BRAND.textDimmer,
            }}
          >
            {Math.round(progress * 10)}/10
          </div>
        </div>
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
        {"<Progress>"}
      </div>
    </AbsoluteFill>
  );
};
