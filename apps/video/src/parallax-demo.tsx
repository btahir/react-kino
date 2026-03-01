import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { BRAND, FONT_CODE, FONT_DISPLAY } from "./theme";

const LAYERS = [
  {
    label: "Background",
    speed: 0.3,
    width: 900,
    height: 500,
    color: `${BRAND.redDark}30`,
    border: `${BRAND.redDark}50`,
    x: 510,
    startY: 600,
  },
  {
    label: "Midground",
    speed: 0.6,
    width: 700,
    height: 380,
    color: `${BRAND.red}25`,
    border: `${BRAND.red}45`,
    x: 610,
    startY: 650,
  },
  {
    label: "Foreground",
    speed: 1.2,
    width: 500,
    height: 280,
    color: `${BRAND.redLight}20`,
    border: `${BRAND.redLight}40`,
    x: 710,
    startY: 720,
  },
];

export const ParallaxDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tagSpring = spring({
    frame: frame - 2,
    fps,
    config: { damping: 200 },
  });

  const scrollAmount = interpolate(frame, [3, 33], [0, 400], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.bg, overflow: "hidden" }}>
      <AbsoluteFill style={{ opacity: 0.04 }}>
        <svg width={1920} height={1080}>
          {Array.from({ length: 33 }, (_, i) => (
            <line
              key={`v${i}`}
              x1={i * 60}
              y1={0}
              x2={i * 60}
              y2={1080}
              stroke={BRAND.red}
              strokeWidth={0.5}
            />
          ))}
          {Array.from({ length: 19 }, (_, i) => (
            <line
              key={`h${i}`}
              x1={0}
              y1={i * 60}
              x2={1920}
              y2={i * 60}
              stroke={BRAND.red}
              strokeWidth={0.5}
            />
          ))}
        </svg>
      </AbsoluteFill>

      {LAYERS.map((layer, i) => {
        const y = layer.startY - scrollAmount * layer.speed;
        const layerOpacity = interpolate(
          frame,
          [2 + i * 3, 8 + i * 3],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: layer.x,
              top: 0,
              width: layer.width,
              height: layer.height,
              backgroundColor: layer.color,
              border: `1px solid ${layer.border}`,
              borderRadius: 12,
              transform: `translateY(${y}px)`,
              opacity: layerOpacity,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: FONT_DISPLAY,
                fontSize: 22,
                fontWeight: 600,
                color: BRAND.textDim,
                letterSpacing: 3,
                textTransform: "uppercase",
              }}
            >
              {layer.label}
            </span>
            <span
              style={{
                position: "absolute",
                bottom: 16,
                right: 20,
                fontFamily: FONT_CODE,
                fontSize: 13,
                color: BRAND.textDimmer,
              }}
            >
              speed: {layer.speed}×
            </span>
          </div>
        );
      })}

      {[200, 400, 600, 800, 1000, 1200, 1400].map((x, i) => {
        const lineY = interpolate(frame, [0, 37], [-100, 1200], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const offset = (i * 180) % 1300;
        return (
          <div
            key={`line-${i}`}
            style={{
              position: "absolute",
              left: x,
              top: ((lineY + offset) % 1300) - 200,
              width: 1,
              height: 60,
              background: `linear-gradient(to bottom, transparent, ${BRAND.red}15, transparent)`,
            }}
          />
        );
      })}

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
        {"<Parallax>"}
      </div>

      <div
        style={{
          position: "absolute",
          top: 80,
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
        Depth & Motion
      </div>
    </AbsoluteFill>
  );
};
