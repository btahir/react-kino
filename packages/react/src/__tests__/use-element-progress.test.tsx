import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, cleanup } from "@testing-library/react";
import type { ProgressData } from "@react-kino/core";
import {
  useElementProgressValue,
  useElementProgress,
} from "../hooks/use-element-progress";

// Real core math (calcElementProgress, ProgressValue), but a capturing
// ScrollTracker so we can drive scroll deterministically.
let captured: ((d: ProgressData) => void) | null = null;
vi.mock("@react-kino/core", async () => {
  const actual = await vi.importActual<typeof import("@react-kino/core")>(
    "@react-kino/core"
  );
  return {
    ...actual,
    ScrollTracker: class {
      subscribe(cb: (d: ProgressData) => void) {
        captured = cb;
        return () => {
          captured = null;
        };
      }
      start() {}
      stop() {}
    },
  };
});

let currentScrollY = 0;

function makeElement(documentTop: number, height: number) {
  const el = document.createElement("div");
  el.getBoundingClientRect = () =>
    ({
      top: documentTop - currentScrollY,
      height,
      left: 0,
      right: 0,
      bottom: 0,
      width: 0,
      x: 0,
      y: 0,
      toJSON() {},
    }) as DOMRect;
  return el;
}

function scrollTo(y: number) {
  currentScrollY = y;
  act(() =>
    captured?.({
      scrollY: y,
      viewportHeight: 768,
      scrollHeight: 3000,
      progress: 0,
    })
  );
}

beforeEach(() => {
  captured = null;
  currentScrollY = 0;
});

afterEach(() => cleanup());

describe("useElementProgressValue", () => {
  it("maps viewport entry/exit to 0→1 with the default offset", () => {
    // elementTop 1000, height 500, viewport 768:
    //   'start end' target = 1000 + 0 - 768 = 232
    //   'end start' target = 1000 + 500 - 0 = 1500
    const ref = { current: makeElement(1000, 500) };
    const { result } = renderHook(() => useElementProgressValue(ref));

    const pv = result.current;

    scrollTo(232);
    expect(pv.get()).toBeCloseTo(0);

    scrollTo(866); // midpoint
    expect(pv.get()).toBeCloseTo(0.5);

    scrollTo(1500);
    expect(pv.get()).toBeCloseTo(1);

    scrollTo(5000);
    expect(pv.get()).toBe(1);
  });

  it("honors a custom offset", () => {
    // ['start end','start center']: targets 232 and (1000 - 0.5*768 = 616)
    const ref = { current: makeElement(1000, 500) };
    const { result } = renderHook(() =>
      useElementProgressValue(ref, { offset: ["start end", "start center"] })
    );
    const pv = result.current;

    scrollTo(232);
    expect(pv.get()).toBeCloseTo(0);
    scrollTo(424); // midpoint of 232..616
    expect(pv.get()).toBeCloseTo(0.5);
    scrollTo(616);
    expect(pv.get()).toBeCloseTo(1);
  });

  it("does not subscribe when disabled", () => {
    const ref = { current: makeElement(1000, 500) };
    renderHook(() => useElementProgressValue(ref, { enabled: false }));
    expect(captured).toBeNull();
  });

  it("reflects reality on mount when the element is already scrolled past (not stuck at 0)", () => {
    // Real IntersectionObserver fires its callback once immediately on
    // observe() with the element's CURRENT state. If the page loads already
    // scrolled past this element (deep link, restored scroll position, a
    // <Scene> mounted below the fold), that first callback reports
    // `isIntersecting: false` directly — it never reports `true` first.
    class OffscreenIO {
      constructor(private cb: (entries: unknown[]) => void) {}
      observe() {
        // Element is already fully passed and outside the rootMargin: the
        // very first (and only) callback says "not intersecting".
        this.cb([{ isIntersecting: false }]);
      }
      unobserve() {}
      disconnect() {}
    }
    const originalIO = global.IntersectionObserver;
    global.IntersectionObserver =
      OffscreenIO as unknown as typeof IntersectionObserver;

    try {
      currentScrollY = 5000; // deep in the page already
      const ref = { current: makeElement(1000, 500) };
      const { result } = renderHook(() => useElementProgressValue(ref));

      // Without a mount-time sync this would be stuck at the constructor
      // default (0) forever, since a never-activated element never receives
      // a scroll tick to correct it.
      expect(result.current.get()).toBe(1);
    } finally {
      global.IntersectionObserver = originalIO;
    }
  });
});

describe("useElementProgress (numeric)", () => {
  it("returns a live number that updates on scroll", () => {
    const ref = { current: makeElement(1000, 500) };
    const { result } = renderHook(() => useElementProgress(ref));

    scrollTo(866);
    expect(result.current).toBeCloseTo(0.5);
  });
});
