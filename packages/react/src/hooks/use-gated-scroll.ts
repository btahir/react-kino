"use client";
import { useEffect, useRef, type RefObject } from "react";
import type { ProgressData, ScrollTracker } from "@react-kino/core";

/** Generous default margin so scenes activate well before they scroll in. */
export const DEFAULT_ROOT_MARGIN = "100% 0px 100% 0px";

export interface GatedScrollParams {
  /** Element observed for viewport proximity. Gating is skipped if null. */
  ref: RefObject<HTMLElement | null>;
  tracker: ScrollTracker;
  /** Whether this hook owns the tracker lifecycle (start/stop). */
  isOwned: boolean;
  /** When false, no subscription is created (e.g. reduced motion / controlled). */
  enabled: boolean;
  /** Called on every scroll tick while active, and once on enter/leave. */
  compute: (data: ProgressData) => void;
  /** IntersectionObserver rootMargin. Defaults to {@link DEFAULT_ROOT_MARGIN}. */
  rootMargin?: string;
  /** Re-run the effect (re-sync + re-subscribe) when any of these change. */
  deps: unknown[];
}

/**
 * Subscribe to a {@link ScrollTracker}, but only do per-frame work while the
 * observed element is near the viewport. An IntersectionObserver with a
 * generous rootMargin gates the subscription so off-screen scenes cost zero per
 * frame. On every gate transition the value is recomputed synchronously from
 * the live `window` position, so on fast re-entry the value is exact — never
 * stale — and on exit it snaps to its final (clamped) boundary value.
 *
 * The `compute` callback is read through a ref so it always sees the latest
 * props without forcing a re-subscribe on every render. Pass config values that
 * should trigger a re-sync via `deps`.
 */
export function useGatedScroll({
  ref,
  tracker,
  isOwned,
  enabled,
  compute,
  rootMargin = DEFAULT_ROOT_MARGIN,
  deps,
}: GatedScrollParams): void {
  const computeRef = useRef(compute);
  computeRef.current = compute;

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;

    const onTick = (data: ProgressData) => computeRef.current(data);

    // Synchronously compute from the live window position — used on enter/leave
    // so the value is always exact regardless of whether the tracker has
    // emitted a tick yet.
    const syncNow = () => {
      onTick({
        scrollY: window.scrollY,
        viewportHeight: window.innerHeight,
        scrollHeight: document.documentElement.scrollHeight,
        progress: 0,
      });
    };

    let unsub: (() => void) | null = null;

    const activate = () => {
      if (unsub) return;
      unsub = tracker.subscribe(onTick);
      syncNow();
    };

    const deactivate = () => {
      if (unsub) {
        unsub();
        unsub = null;
      }
      // Always snap to the exact current value, even the very first time this
      // fires with no prior subscription. IntersectionObserver invokes its
      // callback once immediately after `observe()` with the element's
      // *current* state — if a scene mounts already scrolled past (or a page
      // loads mid-scroll / restores scroll position), that first callback
      // reports `isIntersecting: false` and, without this unconditional sync,
      // the value would stay frozen at its construction-time default (0)
      // forever, since no scroll tick is ever delivered to an element that
      // never activates. Snapping here also covers the fast scroll-past case:
      // a scroll-past doesn't leave the element in a mid-animation state.
      syncNow();
    };

    if (isOwned) tracker.start();

    const el = ref.current;
    let io: IntersectionObserver | null = null;

    if (el && typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => {
          const entry = entries[entries.length - 1];
          if (entry && entry.isIntersecting) activate();
          else deactivate();
        },
        { rootMargin }
      );
      io.observe(el);
    } else {
      // No element to observe or no IO support: stay always-active.
      activate();
    }

    return () => {
      if (io) io.disconnect();
      if (unsub) unsub();
      if (isOwned) tracker.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, tracker, isOwned, rootMargin, ...deps]);
}
