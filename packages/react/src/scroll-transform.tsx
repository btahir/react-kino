"use client";
import React, { useEffect, useState, type ReactNode, type CSSProperties } from "react";
import { lerp, clamp, EASINGS, type EasingFn } from "@react-kino/core";
import { useSceneContext } from "./scene";

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
  easing?: string | ((t: number) => number);
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

function useProgress(propProgress?: number): number {
  try {
    const ctx = useSceneContext();
    return propProgress ?? ctx.progress;
  } catch {
    return propProgress ?? 0;
  }
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);
  return reduced;
}

function resolveEasing(easing?: string | EasingFn): EasingFn {
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

  // Order: translateX/Y/Z -> scale/scaleX/scaleY -> rotateX/Y/Z -> skewX/Y
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
  const progress = useProgress(progressProp);
  const reducedMotion = usePrefersReducedMotion();
  const easingFn = resolveEasing(easing);

  // Determine which state to use for interpolation
  const targetState = reducedMotion && progress >= at ? to : null;

  // Map progress in [at, at+span] to t in [0, 1]
  const rawT = span > 0 ? (progress - at) / span : progress >= at ? 1 : 0;
  const t = clamp(rawT, 0, 1);
  const easedT = easingFn(t);

  // Interpolate each defined transform key
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
      // If only one side defined, treat undefined as identity
      const f = fromVal ?? getIdentity(key);
      const t2 = toVal ?? getIdentity(key);
      interpolated[key] = targetState ? t2 : lerp(f, t2, easedT);
    }
  }

  // Handle opacity separately
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

  const transformStr = buildTransformString(interpolated, perspective);
  const is3D = has3D(from, to, perspective);

  const computedStyle: CSSProperties = {
    ...(transformStr ? { transform: transformStr } : {}),
    ...(opacity != null ? { opacity } : {}),
    transformOrigin,
    willChange: "transform, opacity",
    ...(is3D ? { backfaceVisibility: "hidden" as const } : {}),
    ...style,
  };

  return (
    <div className={className} style={computedStyle}>
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
