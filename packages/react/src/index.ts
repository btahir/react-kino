// Components
export { Kino, useKino, useKinoOptional } from "./kino";
export type { SceneProps } from "./scene";
export { Scene, useSceneContext, useSceneContextOptional } from "./scene";
export { Reveal } from "./reveal";
export type { RevealProps } from "./reveal";
export { Parallax } from "./parallax";
export type { ParallaxProps } from "./parallax";
export { Counter } from "./counter";
export type { CounterProps } from "./counter";
export { CompareSlider } from "./compare-slider";
export type { CompareSliderProps } from "./compare-slider";
export { HorizontalScroll, Panel } from "./horizontal-scroll";
export type { HorizontalScrollProps, PanelProps } from "./horizontal-scroll";
export { Progress } from "./progress";
export type { ProgressProps } from "./progress";
export { VideoScroll } from "./video-scroll";
export type { VideoScrollProps } from "./video-scroll";
export { TextReveal } from "./text-reveal";
export type { TextRevealProps } from "./text-reveal";
export { Marquee } from "./marquee";
export type { MarqueeProps } from "./marquee";
export { StickyHeader } from "./sticky-header";
export type { StickyHeaderProps } from "./sticky-header";
export { ScrollTransform } from "./scroll-transform";
export type { ScrollTransformProps, TransformState } from "./scroll-transform";

// Hooks
export { useScrollProgress } from "./hooks/use-scroll-progress";
export { useSceneProgress } from "./hooks/use-scene-progress";
export { useIsClient } from "./hooks/use-is-client";

// Re-exported core types useful when working with react-kino's public API
export type { EasingFn, EasingName, ProgressData } from "@react-kino/core";
