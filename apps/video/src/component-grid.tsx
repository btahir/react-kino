import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { BRAND, FONT_DISPLAY, FONT_CODE, FONT_BODY } from "./theme";

const COMPONENTS = [
  { name: "<Scene>", desc: "Pinned scroll sections" },
  { name: "<Reveal>", desc: "Scroll-triggered entrances" },
  { name: "<Parallax>", desc: "Depth-based motion" },
  { name: "<Counter>", desc: "Animated number counters" },
  { name: "<CompareSlider>", desc: "Before / after views" },
  { name: "<HorizontalScroll>", desc: "Vertical → horizontal" },
  { name: "<Progress>", desc: "Scroll progress indicator" },
  { name: "<VideoScroll>", desc: "Frame-by-frame scrubbing" },
  { name: "<TextReveal>", desc: "Word-by-word reveal" },
  { name: "<Marquee>", desc: "Infinite looping ticker" },
  { name: "<StickyHeader>", desc: "Scroll-aware header" },
  { name: "<Kino>", desc: "Root scroll provider" },
];

const HOOKS = [
  "useScrollProgress",
  "useSceneProgress",
  "useIsClient",
  "useSceneContext",
  "useKino",
];

const COLS = 4;
const CARD_W = 350;
const CARD_H = 100;
const GAP = 18;

export const ComponentGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame: frame - 1,
    fps,
    config: { damping: 200 },
  });

  const unlocked = Math.min(
    COMPONENTS.length,
    Math.floor(
      interpolate(frame, [3, 28], [0, COMPONENTS.length], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
    ),
  );

  const gridWidth = COLS * CARD_W + (COLS - 1) * GAP;
  const rows = Math.ceil(COMPONENTS.length / COLS);
  const gridHeight = rows * CARD_H + (rows - 1) * GAP;
  const startX = (1920 - gridWidth) / 2;
  const startY = (1080 - gridHeight) / 2 - 20;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BRAND.bg,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 70,
          fontFamily: FONT_DISPLAY,
          fontSize: 20,
          fontWeight: 600,
          color: BRAND.textDim,
          letterSpacing: 5,
          textTransform: "uppercase",
          opacity: titleSpring,
        }}
      >
        Everything You Need
      </div>

      {COMPONENTS.map((comp, i) => {
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        const x = startX + col * (CARD_W + GAP);
        const y = startY + row * (CARD_H + GAP);

        const isUnlocked = i < unlocked;
        const isJustUnlocked = i === unlocked - 1;

        const cardSpring = spring({
          frame: frame - (3 + i * 2),
          fps,
          config: { damping: 18, stiffness: 160 },
        });
        const cardScale = interpolate(cardSpring, [0, 1], [0.7, 1]);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: CARD_W,
              height: CARD_H,
              backgroundColor: isUnlocked ? BRAND.bgCard : "#0c0c0c",
              border: `1px solid ${isJustUnlocked ? BRAND.red : BRAND.border}`,
              borderRadius: 10,
              padding: "14px 20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 6,
              transform: `scale(${cardScale})`,
              opacity: cardSpring,
              boxShadow: isJustUnlocked
                ? `0 0 25px ${BRAND.redGlow}, 0 0 50px ${BRAND.red}15`
                : "none",
            }}
          >
            <div
              style={{
                fontFamily: FONT_CODE,
                fontSize: 17,
                fontWeight: 500,
                color: isUnlocked ? BRAND.red : BRAND.textDimmer,
              }}
            >
              {comp.name}
            </div>
            <div
              style={{
                fontFamily: FONT_BODY,
                fontSize: 13,
                fontWeight: 400,
                color: isUnlocked ? BRAND.textDim : BRAND.textDimmer,
              }}
            >
              {comp.desc}
            </div>
          </div>
        );
      })}

      <div
        style={{
          position: "absolute",
          bottom: 75,
          fontFamily: FONT_DISPLAY,
          fontSize: 28,
          fontWeight: 700,
          color: BRAND.text,
          opacity: titleSpring,
        }}
      >
        <span style={{ color: BRAND.red }}>{unlocked}</span>
        <span style={{ color: BRAND.textDim }}> / {COMPONENTS.length}</span>
        <span
          style={{
            fontFamily: FONT_BODY,
            fontSize: 16,
            fontWeight: 400,
            color: BRAND.textDim,
            marginLeft: 16,
          }}
        >
          components
        </span>
        <span
          style={{
            color: BRAND.textDimmer,
            margin: "0 12px",
            fontSize: 16,
          }}
        >
          &middot;
        </span>
        <span style={{ color: BRAND.red }}>{HOOKS.length}</span>
        <span
          style={{
            fontFamily: FONT_BODY,
            fontSize: 16,
            fontWeight: 400,
            color: BRAND.textDim,
            marginLeft: 8,
          }}
        >
          hooks
        </span>
      </div>
    </AbsoluteFill>
  );
};
