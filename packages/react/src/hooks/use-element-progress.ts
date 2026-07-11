"use client";
import { useEffect, useRef, useState, type RefObject } from "react";
import {
  ProgressValue,
  calcElementProgress,
  DEFAULT_ELEMENT_OFFSET,
  type OffsetEntry,
} from "@react-kino/core";
import { useScrollTracker } from "./use-scroll-tracker";
import { useGatedScroll } from "./use-gated-scroll";

export interface ElementProgressOptions {
  /**
   * Motion-style offset pairs describing when the element enters/exits.
   * Defaults to `["start end", "end start"]` (0 as it starts entering, 1 once
   * it has fully passed through).
   */
  offset?: readonly OffsetEntry[];
  /** When false, no scroll work is performed. Default: true. */
  enabled?: boolean;
}

/**
 * Fast-path element-relative scroll progress. Maps an element's viewport
 * entry/exit to a 0→1 {@link ProgressValue} without pinning, gated behind an
 * IntersectionObserver so it costs nothing while off-screen. Subscribe to the
 * returned value imperatively.
 */
export function useElementProgressValue(
  ref: RefObject<HTMLElement | null>,
  options: ElementProgressOptions = {}
): ProgressValue {
  const { offset = DEFAULT_ELEMENT_OFFSET, enabled = true } = options;

  const pvRef = useRef<ProgressValue | null>(null);
  if (pvRef.current === null) {
    pvRef.current = new ProgressValue(0);
  }
  const pv = pvRef.current;

  const { tracker, isOwned } = useScrollTracker();

  // Stringify the offset so a fresh array literal each render doesn't re-run
  // the effect, but a genuine change does.
  const offsetKey = JSON.stringify(offset);
  const offsetRef = useRef(offset);
  offsetRef.current = offset;

  useGatedScroll({
    ref,
    tracker,
    isOwned,
    enabled,
    deps: [offsetKey, enabled],
    compute: ({ scrollY, viewportHeight }) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const elementTop = rect.top + scrollY;
      pv.set(
        calcElementProgress(offsetRef.current, {
          elementTop,
          elementHeight: rect.height,
          viewportHeight,
          scrollY,
        })
      );
    },
  });

  return pv;
}

/**
 * Re-rendering variant of {@link useElementProgressValue}: returns a numeric
 * 0→1 value that updates the component on each frame. Convenient for simple
 * cases; prefer the value variant for hot animations.
 */
export function useElementProgress(
  ref: RefObject<HTMLElement | null>,
  options: ElementProgressOptions = {}
): number {
  const pv = useElementProgressValue(ref, options);
  const [progress, setProgress] = useState(() => pv.get());
  useEffect(() => {
    setProgress(pv.get());
    return pv.on(setProgress);
  }, [pv]);
  return progress;
}
