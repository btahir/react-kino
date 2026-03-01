"use client";
import { RefObject, useState, useEffect } from "react";
import { calcSceneProgress } from "@kino/core";
import { useScrollTracker } from "./use-scroll-tracker";

export function useSceneProgress(
  spacerRef: RefObject<HTMLElement | null>,
  durationPx: number
): number {
  const [progress, setProgress] = useState(0);
  const { tracker, isOwned } = useScrollTracker();

  useEffect(() => {
    const unsub = tracker.subscribe(({ scrollY }) => {
      if (!spacerRef.current) return;
      const offsetTop =
        spacerRef.current.getBoundingClientRect().top + scrollY;
      setProgress(calcSceneProgress(scrollY, offsetTop, durationPx));
    });
    if (isOwned) tracker.start();
    return () => {
      unsub();
      if (isOwned) tracker.stop();
    };
  }, [spacerRef, durationPx, tracker, isOwned]);

  return progress;
}
