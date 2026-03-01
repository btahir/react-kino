"use client";
import { useRef } from "react";
import { ScrollTracker } from "@kino/core";
import { useKino } from "../kino";

interface ScrollTrackerHandle {
  tracker: ScrollTracker;
  isOwned: boolean;
}

/**
 * Reuse the shared tracker from <Kino> when available.
 * Falls back to a local tracker for standalone usage.
 */
export function useScrollTracker(): ScrollTrackerHandle {
  const fallbackRef = useRef<ScrollTracker | null>(null);

  try {
    const { tracker } = useKino();
    return { tracker, isOwned: false };
  } catch {
    if (!fallbackRef.current) {
      fallbackRef.current = new ScrollTracker();
    }
    return { tracker: fallbackRef.current, isOwned: true };
  }
}
