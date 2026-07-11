import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React, { useRef, useEffect } from "react";
import { render, act, cleanup } from "@testing-library/react";
import type { ProgressData } from "@react-kino/core";
import { Reveal } from "../reveal";

// Real element-progress math with a capturing tracker so a standalone Reveal
// (no <Scene>) can be driven by its own viewport position.
let subscriber: ((d: ProgressData) => void) | null = null;
vi.mock("@react-kino/core", async () => {
  const actual = await vi.importActual<typeof import("@react-kino/core")>(
    "@react-kino/core"
  );
  return {
    ...actual,
    ScrollTracker: class {
      subscribe(cb: (d: ProgressData) => void) {
        subscriber = cb;
        return () => {
          subscriber = null;
        };
      }
      start() {}
      stop() {}
    },
  };
});

let currentScrollY = 0;

beforeEach(() => {
  subscriber = null;
  currentScrollY = 0;
});
afterEach(() => cleanup());

function drive(y: number) {
  currentScrollY = y;
  act(() =>
    subscriber?.({
      scrollY: y,
      viewportHeight: 768,
      scrollHeight: 5000,
      progress: 0,
    })
  );
}

/** Reveal wrapper whose element reports a fixed document position. */
function StubbedReveal(props: React.ComponentProps<typeof Reveal>) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current?.querySelector("div");
    if (el) {
      (el as HTMLElement).getBoundingClientRect = () =>
        ({
          top: 2000 - currentScrollY,
          height: 400,
          left: 0,
          right: 0,
          bottom: 0,
          width: 0,
          x: 0,
          y: 0,
          toJSON() {},
        }) as DOMRect;
    }
  });
  return (
    <div ref={ref}>
      <Reveal {...props} />
    </div>
  );
}

describe("Reveal trigger=visibility", () => {
  it("animates based on the element's own viewport position (no Scene)", () => {
    // elementTop 2000, height 400, viewport 768:
    //   'start end' target = 2000 - 768 = 1232 (progress 0)
    //   'end start' target = 2000 + 400 = 2400 (progress 1)
    const { container } = render(
      <StubbedReveal trigger="visibility" animation="fade" at={0.5}>
        <span>content</span>
      </StubbedReveal>
    );
    const revealEl = container.querySelector("span")!
      .parentElement as HTMLElement;

    drive(1232); // progress 0 → below at=0.5 → hidden
    expect(revealEl.style.opacity).toBe("0");

    drive(1816); // midpoint → progress ~0.5 → visible (>= at)
    expect(revealEl.style.opacity).toBe("1");
  });
});
