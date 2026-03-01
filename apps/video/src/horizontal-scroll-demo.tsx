import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { BRAND, FONT_DISPLAY, FONT_CODE, FONT_BODY } from "./theme";

const PANELS = [
  { label: "Hero", color: "rgba(220,38,38,0.12)", border: "rgba(220,38,38,0.25)" },
  { label: "Features", color: "rgba(153,27,27,0.12)", border: "rgba(153,27,27,0.25)" },
  { label: "Pricing", color: "rgba(239,68,68,0.10)", border: "rgba(239,68,68,0.22)" },
  { label: "Contact", color: "rgba(220,38,38,0.08)", border: "rgba(220,38,38,0.18)" },
];

const PANEL_W = 1920;
const TOTAL_W = PANELS.length * PANEL_W;

export const HorizontalScrollDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tagSpring = spring({
    frame: frame - 2,
    fps,
    config: { damping: 200 },
  });

  /* Simulated scroll drives horizontal translation */
  const scrollProgress = interpolate(frame, [8, 56], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  const translateX = interpolate(scrollProgress, [0, 1], [0, -(TOTAL_W - PANEL_W)]);

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.bg, overflow: "hidden" }}>
      {/* Scrolling panel strip */}
      <div
        style={{
          position: "absolute",
          top: 140,
          left: 0,
          width: TOTAL_W,
          height: 700,
          display: "flex",
          transform: `translateX(${translateX}px)`,
        }}
      >
        {PANELS.map((panel, i) => (
          <div
            key={i}
            style={{
              width: PANEL_W,
              height: "100%",
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 20,
              backgroundColor: panel.color,
              borderRight: `1px solid ${panel.border}`,
            }}
          >
            <div
              style={{
                fontFamily: FONT_DISPLAY,
                fontSize: 64,
                fontWeight: 700,
                color: BRAND.text,
                letterSpacing: -2,
              }}
            >
              {panel.label}
            </div>
            <div
              style={{
                fontFamily: FONT_CODE,
                fontSize: 16,
                color: BRAND.textDim,
              }}
            >
              Panel {i + 1} of {PANELS.length}
            </div>
            {/* Decorative content bars */}
            {[0, 1, 2].map((j) => (
              <div
                key={j}
                style={{
                  width: 400 - j * 80,
                  height: 8,
                  backgroundColor: BRAND.border,
                  borderRadius: 4,
                  marginTop: j === 0 ? 30 : 0,
                }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Scroll direction indicator */}
      <div
        style={{
          position: "absolute",
          top: 870,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: 12,
          opacity: tagSpring,
        }}
      >
        <div
          style={{
            fontFamily: FONT_BODY,
            fontSize: 14,
            color: BRAND.textDim,
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          Scroll ↓
        </div>
        <svg width={60} height={2}>
          <line x1={0} y1={1} x2={60} y2={1} stroke={BRAND.textDimmer} strokeWidth={1} />
        </svg>
        <div
          style={{
            fontFamily: FONT_BODY,
            fontSize: 14,
            color: BRAND.textDim,
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          Moves →
        </div>
      </div>

      {/* Section label */}
      <div
        style={{
          position: "absolute",
          top: 50,
          width: "100%",
          textAlign: "center",
          fontFamily: FONT_DISPLAY,
          fontSize: 18,
          fontWeight: 600,
          color: BRAND.textDim,
          letterSpacing: 5,
          textTransform: "uppercase",
          opacity: tagSpring,
        }}
      >
        Horizontal Navigation
      </div>

      {/* Panel indicator dots */}
      <div
        style={{
          position: "absolute",
          top: 100,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          gap: 10,
          opacity: tagSpring,
        }}
      >
        {PANELS.map((_, i) => {
          const activeAt = i / (PANELS.length - 1);
          const isActive = Math.abs(scrollProgress - activeAt) < 0.15;
          return (
            <div
              key={i}
              style={{
                width: isActive ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: isActive ? BRAND.red : BRAND.border,
              }}
            />
          );
        })}
      </div>

      {/* Component tag */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
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
        {"<HorizontalScroll>"}
      </div>
    </AbsoluteFill>
  );
};
