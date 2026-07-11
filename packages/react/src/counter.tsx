"use client";
import React, { type ReactNode } from "react";
import { lerp, clamp, EASINGS, type EasingFn, type EasingName } from "@react-kino/core";
import { useSceneContextOptional } from "./scene";
import { usePrefersReducedMotion } from "./hooks/use-prefers-reduced-motion";

export interface CounterProps {
  /** Starting value */
  from: number;
  /** Ending value */
  to: number;
  /** Progress value (0-1) when counting begins */
  at?: number;
  /** How much of the progress range the count spans */
  span?: number;
  /** Formatting function */
  format?: (value: number) => string;
  /** Easing preset name or custom function */
  easing?: EasingName | EasingFn;
  /** Direct progress override (if not inside a Scene) */
  progress?: number;
  className?: string;
}

function useProgress(propProgress?: number): number {
  const ctx = useSceneContextOptional();
  return propProgress ?? ctx?.progress ?? 0;
}

function resolveEasing(easing?: EasingName | EasingFn): EasingFn {
  if (typeof easing === "function") return easing;
  if (typeof easing === "string" && EASINGS[easing]) return EASINGS[easing];
  return EASINGS["ease-out"];
}

function isInteger(n: number): boolean {
  return Number.isInteger(n);
}

const defaultFormat = (n: number): string => n.toLocaleString();

export function Counter({
  from,
  to,
  at = 0,
  span = 0.3,
  format = defaultFormat,
  easing,
  progress: progressProp,
  className,
}: CounterProps) {
  const progress = useProgress(progressProp);
  const reducedMotion = usePrefersReducedMotion();
  const easingFn = resolveEasing(easing);

  // If reduced motion and progress has reached the trigger, show final value
  if (reducedMotion && progress >= at) {
    return <span className={className}>{format(to)}</span>;
  }

  // Map progress in [at, at+span] to t in [0, 1]
  const rawT = span > 0 ? (progress - at) / span : progress >= at ? 1 : 0;
  const t = clamp(rawT, 0, 1);
  const easedT = easingFn(t);
  let value = lerp(from, to, easedT);

  // Round to integer if both from and to are integers
  if (isInteger(from) && isInteger(to)) {
    value = Math.round(value);
  }

  return <span className={className}>{format(value)}</span>;
}
