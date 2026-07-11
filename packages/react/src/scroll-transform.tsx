"use client";
import React, {
  useEffect,
  useRef,
  type ReactNode,
  type CSSProperties,
} from "react";
import { lerp, clamp, EASINGS, type EasingFn, type EasingName } from "@react-kino/core";
import { useSceneProgressValueOptional } from "./scene";
import { usePrefersReducedMotion } from "./hooks/use-prefers-reduced-motion";

export interface TransformState {
  /** translateX (px) */
  x?: number;
  /** translateY (px) */
  y?: number;
  /** translateZ (px) */
  z?: number;
  /** uniform scale */
  scale?: number;
  /** horizontal scale */
  scaleX?: number;
  /** vertical scale */
  scaleY?: number;
  /** rotateZ (deg) */
  rotate?: number;
  /** 3D rotateX (deg) */
  rotateX?: number;
  /** 3D rotateY (deg) */
  rotateY?: number;
  /** skewX (deg) */
  skewX?: number;
  /** skewY (deg) */
  skewY?: number;
  /** opacity 0-1 */
  opacity?: number;
}

export interface ScrollTransformProps {
  /** Starting transform state */
  from: TransformState;
  /** Ending transform state */
  to: TransformState;
  /** Progress value (0-1) when the transform begins */
  at?: number;
  /** How much of the progress range the transform spans */
  span?: number;
  /** Easing preset name or custom function */
  easing?: EasingName | EasingFn;
  /** Perspective in px, prepended to the transform string */
  perspective?: number;
  /** CSS transform-origin */
  transformOrigin?: string;
  /** Direct progress override (if not inside a Scene) */
  progress?: number;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

function resolveEasing(easing?: EasingName | EasingFn): EasingFn {
  if (typeof easing === "function") return easing;
  if (typeof easing === "string" && EASINGS[easing]) return EASINGS[easing];
  return EASINGS["ease-out"];
}

/** All transform keys (excluding opacity which is a separate CSS property) */
const TRANSFORM_KEYS = [
  "x",
  "y",
  "z",
  "scale",
  "scaleX",
  "scaleY",
  "rotate",
  "rotateX",
  "rotateY",
  "skewX",
  "skewY",
] as const;

type TransformKey = (typeof TRANSFORM_KEYS)[number];

function has3D(from: TransformState, to: TransformState, perspective?: number): boolean {
  if (perspective != null) return true;
  return (
    from.rotateX != null ||
    to.rotateX != null ||
    from.rotateY != null ||
    to.rotateY != null ||
    from.z != null ||
    to.z != null
  );
}

function buildTransformString(
  values: Record<TransformKey, number | undefined>,
  perspective?: number
): string {
  const parts: string[] = [];

  if (perspective != null) {
    parts.push(`perspective(${perspective}px)`);
  }

  if (values.x != null) parts.push(`translateX(${values.x}px)`);
  if (values.y != null) parts.push(`translateY(${values.y}px)`);
  if (values.z != null) parts.push(`translateZ(${values.z}px)`);
  if (values.scale != null) parts.push(`scale(${values.scale})`);
  if (values.scaleX != null) parts.push(`scaleX(${values.scaleX})`);
  if (values.scaleY != null) parts.push(`scaleY(${values.scaleY})`);
  if (values.rotateX != null) parts.push(`rotateX(${values.rotateX}deg)`);
  if (values.rotateY != null) parts.push(`rotateY(${values.rotateY}deg)`);
  if (values.rotate != null) parts.push(`rotateZ(${values.rotate}deg)`);
  if (values.skewX != null) parts.push(`skewX(${values.skewX}deg)`);
  if (values.skewY != null) parts.push(`skewY(${values.skewY}deg)`);

  return parts.join(" ");
}

interface TransformConfig {
  from: TransformState;
  to: TransformState;
  at: number;
  span: number;
  easingFn: EasingFn;
  perspective?: number;
  reducedMotion: boolean;
}

/**
 * Pure computation shared by the initial React render and the imperative
 * scroll-frame updates, so both paths produce identical output.
 */
function computeTransform(
  progress: number,
  cfg: TransformConfig
): { transform: string; opacity: number | undefined } {
  const { from, to, at, span, easingFn, perspective, reducedMotion } = cfg;

  const targetState = reducedMotion && progress >= at ? to : null;

  const rawT = span > 0 ? (progress - at) / span : progress >= at ? 1 : 0;
  const t = clamp(rawT, 0, 1);
  const easedT = easingFn(t);

  const interpolated: Record<TransformKey, number | undefined> = {} as Record<
    TransformKey,
    number | undefined
  >;

  for (const key of TRANSFORM_KEYS) {
    const fromVal = targetState ? targetState[key] : from[key];
    const toVal = targetState ? targetState[key] : to[key];

    if (fromVal != null && toVal != null) {
      interpolated[key] = targetState ? toVal : lerp(fromVal, toVal, easedT);
    } else if (fromVal != null || toVal != null) {
      const f = fromVal ?? getIdentity(key);
      const t2 = toVal ?? getIdentity(key);
      interpolated[key] = targetState ? t2 : lerp(f, t2, easedT);
    }
  }

  let opacity: number | undefined;
  const fromOpacity = targetState ? targetState.opacity : from.opacity;
  const toOpacity = targetState ? targetState.opacity : to.opacity;
  if (fromOpacity != null && toOpacity != null) {
    opacity = targetState ? toOpacity : lerp(fromOpacity, toOpacity, easedT);
  } else if (fromOpacity != null || toOpacity != null) {
    const f = fromOpacity ?? 1;
    const t2 = toOpacity ?? 1;
    opacity = targetState ? t2 : lerp(f, t2, easedT);
  }

  return { transform: buildTransformString(interpolated, perspective), opacity };
}

export function ScrollTransform({
  from,
  to,
  at = 0,
  span = 1,
  easing,
  perspective,
  transformOrigin = "center center",
  progress: progressProp,
  children,
  className,
  style,
}: ScrollTransformProps) {
  const elRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const easingFn = resolveEasing(easing);
  const pv = useSceneProgressValueOptional();

  const cfg: TransformConfig = {
    from,
    to,
    at,
    span,
    easingFn,
    perspective,
    reducedMotion,
  };

  // Controlled (progress prop) renders statically; otherwise we start from the
  // current ProgressValue (or 0) so SSR/first paint is correct, then update
  // imperatively on scroll.
  const controlled = progressProp != null;
  const initialProgress = controlled ? progressProp : pv ? pv.get() : 0;
  const initial = computeTransform(initialProgress, cfg);

  const is3D = has3D(from, to, perspective);

  // Imperative fast path: subscribe to the ProgressValue and write style
  // directly, never re-rendering. Skipped when controlled (no pv to read).
  useEffect(() => {
    if (controlled || !pv) return;
    const el = elRef.current;
    if (!el) return;
    const apply = (p: number) => {
      const { transform, opacity } = computeTransform(p, cfg);
      el.style.transform = transform;
      if (opacity != null) el.style.opacity = String(opacity);
    };
    apply(pv.get());
    return pv.on(apply);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pv,
    controlled,
    reducedMotion,
    at,
    span,
    perspective,
    easing,
    JSON.stringify(from),
    JSON.stringify(to),
  ]);

  const computedStyle: CSSProperties = {
    ...(initial.transform ? { transform: initial.transform } : {}),
    ...(initial.opacity != null ? { opacity: initial.opacity } : {}),
    transformOrigin,
    willChange: "transform, opacity",
    ...(is3D ? { backfaceVisibility: "hidden" as const } : {}),
    ...style,
  };

  return (
    <div ref={elRef} className={className} style={computedStyle}>
      {children}
    </div>
  );
}

/** Identity values for transform properties (value that causes no visual change) */
function getIdentity(key: TransformKey): number {
  switch (key) {
    case "scale":
    case "scaleX":
    case "scaleY":
      return 1;
    default:
      return 0;
  }
}
