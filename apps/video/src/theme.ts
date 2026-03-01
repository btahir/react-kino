import { loadFont as loadRajdhani } from "@remotion/google-fonts/Rajdhani";
import { loadFont as loadOutfit } from "@remotion/google-fonts/Outfit";
import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";

const rajdhani = loadRajdhani("normal", {
  weights: ["500", "600", "700"],
  subsets: ["latin"],
});

const outfit = loadOutfit("normal", {
  weights: ["300", "400", "500", "600"],
  subsets: ["latin"],
});

const jetbrains = loadJetBrainsMono("normal", {
  weights: ["400", "500"],
  subsets: ["latin"],
});

export const FONT_DISPLAY = rajdhani.fontFamily;
export const FONT_BODY = outfit.fontFamily;
export const FONT_CODE = jetbrains.fontFamily;

export const waitForFonts = () =>
  Promise.all([
    rajdhani.waitUntilDone(),
    outfit.waitUntilDone(),
    jetbrains.waitUntilDone(),
  ]);

export const BRAND = {
  red: "#dc2626",
  redDark: "#991b1b",
  redLight: "#ef4444",
  redGlow: "rgba(220, 38, 38, 0.4)",
  bg: "#080808",
  bgCard: "#111111",
  text: "#e8e8e8",
  textDim: "#777777",
  textDimmer: "#333333",
  border: "#1a1a1a",
} as const;

/* Scene durations (frames at 30fps) — balanced pacing */
export const SCENES = {
  INTRO: 70,
  TAGLINE: 78,
  TEXT_REVEAL: 64,
  PARALLAX: 64,
  COMPARE: 64,
  HORIZONTAL_SCROLL: 64,
  PROGRESS: 64,
  COUNTER: 64,
  GRID: 64,
  STATS: 70,
  OUTRO: 72,
  TRANSITION: 8,
} as const;

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
