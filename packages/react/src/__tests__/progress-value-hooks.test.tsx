import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { renderHook, render, act, cleanup } from "@testing-library/react";
import type { ProgressData } from "@react-kino/core";
import { useScrollProgressValue } from "../hooks/use-scroll-progress-value";
import { Scene, useSceneProgressValue, useSceneContextOptional } from "../scene";

// Real ProgressValue + math, capturing ScrollTracker for deterministic driving.
let pageSubscriber: ((d: ProgressData) => void) | null = null;
vi.mock("@react-kino/core", async () => {
  const actual = await vi.importActual<typeof import("@react-kino/core")>(
    "@react-kino/core"
  );
  return {
    ...actual,
    ScrollTracker: class {
      subscribe(cb: (d: ProgressData) => void) {
        pageSubscriber = cb;
        return () => {
          pageSubscriber = null;
        };
      }
      start() {}
      stop() {}
    },
  };
});

beforeEach(() => {
  pageSubscriber = null;
});
afterEach(() => cleanup());

describe("useScrollProgressValue", () => {
  it("returns a stable ProgressValue that tracks page progress", () => {
    const { result, rerender } = renderHook(() => useScrollProgressValue());
    const pv = result.current;
    expect(pv.get()).toBe(0);

    act(() =>
      pageSubscriber?.({
        scrollY: 0,
        viewportHeight: 800,
        scrollHeight: 3000,
        progress: 0.42,
      })
    );
    expect(pv.get()).toBeCloseTo(0.42);

    rerender();
    // Identity is stable across renders.
    expect(result.current).toBe(pv);
  });
});

describe("Scene dual-path context", () => {
  it("keeps the numeric useSceneContextOptional path re-rendering (compat)", () => {
    let captured: ReturnType<typeof useSceneProgressValue> | null = null;
    let numericRenders = 0;
    let lastNumeric = -1;

    function Capture() {
      captured = useSceneProgressValue();
      return null;
    }
    function NumericConsumer() {
      const ctx = useSceneContextOptional();
      numericRenders++;
      lastNumeric = ctx ? ctx.progress : -1;
      return <div data-testid="num">{ctx?.progress}</div>;
    }

    render(
      <Scene duration="200vh">
        <Capture />
        <NumericConsumer />
      </Scene>
    );

    const pv = captured!;
    const rendersBefore = numericRenders;

    act(() => pv.set(0.6));

    // The legacy numeric consumer re-rendered off the numeric progress.
    expect(numericRenders).toBeGreaterThan(rendersBefore);
    expect(lastNumeric).toBeCloseTo(0.6);
  });
});
