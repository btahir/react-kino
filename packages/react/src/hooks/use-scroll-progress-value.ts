"use client";
import { useEffect, useRef } from "react";
import { ProgressValue } from "@react-kino/core";
import { useScrollTracker } from "./use-scroll-tracker";

/**
 * Fast-path equivalent of {@link useScrollProgress} for whole-page scroll.
 * Returns a stable {@link ProgressValue} (0→1 page progress) that you subscribe
 * to imperatively — it never re-renders the calling component on scroll.
 *
 * ```tsx
 * const progress = useScrollProgressValue();
 * const ref = useRef<HTMLDivElement>(null);
 * useEffect(() => progress.on((p) => {
 *   ref.current!.style.setProperty("--kino-progress", String(p));
 * }), [progress]);
 * ```
 */
export function useScrollProgressValue(): ProgressValue {
  const pvRef = useRef<ProgressValue | null>(null);
  if (pvRef.current === null) {
    pvRef.current = new ProgressValue(0);
  }
  const { tracker, isOwned } = useScrollTracker();

  useEffect(() => {
    const pv = pvRef.current!;
    const unsub = tracker.subscribe((data) => pv.set(data.progress));
    if (isOwned) tracker.start();
    return () => {
      unsub();
      if (isOwned) tracker.stop();
    };
  }, [tracker, isOwned]);

  return pvRef.current;
}
