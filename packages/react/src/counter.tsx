"use client";
import React, { useEffect, useRef } from "react";
import { lerp, clamp, EASINGS, type EasingFn, type EasingName } from "@react-kino/core";
import { useSceneProgressValueOptional } from "./scene";
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

function resolveEasing(easing?: EasingName | EasingFn): EasingFn {
  if (typeof easing === "function") return easing;
  if (typeof easing === "string" && EASINGS[easing]) return EASINGS[easing];
  return EASINGS["ease-out"];
}

function isInteger(n: number): boolean {
  return Number.isInteger(n);
}

const defaultFormat = (n: number): string => n.toLocaleString();

interface CounterConfig {
  from: number;
  to: number;
  at: number;
  span: number;
  easingFn: EasingFn;
  format: (value: number) => string;
  reducedMotion: boolean;
}

/** Shared computation for both the initial render and imperative updates. */
function computeCounterText(progress: number, cfg: CounterConfig): string {
  const { from, to, at, span, easingFn, format, reducedMotion } = cfg;
  if (reducedMotion && progress >= at) return format(to);

  const rawT = span > 0 ? (progress - at) / span : progress >= at ? 1 : 0;
  const t = clamp(rawT, 0, 1);
  const easedT = easingFn(t);
  let value = lerp(from, to, easedT);
  if (isInteger(from) && isInteger(to)) value = Math.round(value);
  return format(value);
}

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
  const spanRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const easingFn = resolveEasing(easing);
  const pv = useSceneProgressValueOptional();

  const cfg: CounterConfig = { from, to, at, span, easingFn, format, reducedMotion };

  const controlled = progressProp != null;
  const initialProgress = controlled ? progressProp : pv ? pv.get() : 0;
  const initialText = computeCounterText(initialProgress, cfg);

  // Imperative fast path: write textContent directly, no re-render per frame.
  useEffect(() => {
    if (controlled || !pv) return;
    const el = spanRef.current;
    if (!el) return;
    const apply = (p: number) => {
      el.textContent = computeCounterText(p, cfg);
    };
    apply(pv.get());
    return pv.on(apply);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pv, controlled, reducedMotion, from, to, at, span, easing, format]);

  return (
    <span ref={spanRef} className={className}>
      {initialText}
    </span>
  );
}
