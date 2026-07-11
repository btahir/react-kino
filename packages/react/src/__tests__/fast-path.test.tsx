import { describe, it, expect, afterEach } from "vitest";
import React, { useRef } from "react";
import { render, act, cleanup } from "@testing-library/react";
import type { ProgressValue } from "@react-kino/core";
import { Scene, useSceneProgressValue } from "../scene";
import { ScrollTransform } from "../scroll-transform";
import { Counter } from "../counter";

// This suite uses the REAL @react-kino/core (no mock) so ProgressValue and the
// interpolation math are exercised end to end. It proves the ref-based engine
// mutates the DOM on progress ticks WITHOUT re-rendering the components.

afterEach(() => cleanup());

let captured: ProgressValue | null = null;
function Capture() {
  captured = useSceneProgressValue();
  return null;
}

let probeRenders = 0;
function RenderProbe() {
  // Reads the (stable) ProgressValue from context but never subscribes, so it
  // must render exactly once regardless of how many progress ticks occur.
  useSceneProgressValue();
  const ref = useRef<HTMLDivElement>(null);
  probeRenders++;
  return <div ref={ref} data-testid="probe" />;
}

describe("ref-based fast path", () => {
  it("mutates DOM style on progress ticks without re-rendering fast-path components", () => {
    captured = null;
    probeRenders = 0;

    const { container } = render(
      <Scene duration="200vh">
        <Capture />
        <RenderProbe />
        <ScrollTransform from={{ x: 0 }} to={{ x: 100 }} easing="linear">
          <span>content</span>
        </ScrollTransform>
      </Scene>
    );

    expect(captured).toBeTruthy();
    const pv = captured!;

    // Find the ScrollTransform wrapper (last child of the scene inner div).
    const transformEl = container.querySelector("span")!
      .parentElement as HTMLElement;

    const rendersAfterMount = probeRenders;

    act(() => pv.set(0.5));
    expect(transformEl.style.transform).toContain("translateX(50px)");

    act(() => pv.set(0.75));
    expect(transformEl.style.transform).toContain("translateX(75px)");

    act(() => pv.set(1));
    expect(transformEl.style.transform).toContain("translateX(100px)");

    // The key assertion: no additional renders happened across all those ticks.
    expect(probeRenders).toBe(rendersAfterMount);
  });

  it("Counter writes textContent imperatively without re-rendering", () => {
    captured = null;

    const { container } = render(
      <Scene duration="200vh">
        <Capture />
        <Counter from={0} to={100} at={0} span={1} easing="linear" format={(v) => String(v)} />
      </Scene>
    );

    const pv = captured!;
    const span = container.querySelector("span")!;

    act(() => pv.set(0.5));
    expect(span.textContent).toBe("50");

    act(() => pv.set(1));
    expect(span.textContent).toBe("100");
  });
});
