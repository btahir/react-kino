"use client";
import { useState, useEffect } from "react";
import { useScrollTracker } from "./use-scroll-tracker";

export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);
  const { tracker, isOwned } = useScrollTracker();

  useEffect(() => {
    const unsub = tracker.subscribe((data) => setProgress(data.progress));
    if (isOwned) tracker.start();
    return () => {
      unsub();
      if (isOwned) tracker.stop();
    };
  }, [tracker, isOwned]);

  return progress;
}
