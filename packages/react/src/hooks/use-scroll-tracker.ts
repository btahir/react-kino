"use client";
import { useRef } from "react";
import { ScrollTracker } from "@react-kino/core";
import { useKinoOptional } from "../kino";

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
  const kino = useKinoOptional();

  if (kino) {
    return { tracker: kino.tracker, isOwned: false };
  }

  if (!fallbackRef.current) {
    fallbackRef.current = new ScrollTracker();
  }
  return { tracker: fallbackRef.current, isOwned: true };
}
