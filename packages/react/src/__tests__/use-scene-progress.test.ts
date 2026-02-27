import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useSceneProgress } from "../hooks/use-scene-progress";

vi.mock("@kino/core", () => ({
  ScrollTracker: class MockScrollTracker {
    subscribe = vi.fn(() => vi.fn());
    start = vi.fn();
    stop = vi.fn();
  },
  calcSceneProgress: vi.fn(() => 0),
}));

describe("useSceneProgress", () => {
  it("returns 0 initially", () => {
    const spacerRef = { current: document.createElement("div") };
    const { result } = renderHook(() => useSceneProgress(spacerRef, 1600));
    expect(result.current).toBe(0);
  });

  it("accepts spacerRef and durationPx params", () => {
    const spacerRef = { current: document.createElement("div") };
    const { result } = renderHook(() => useSceneProgress(spacerRef, 2400));
    expect(result.current).toBe(0);
  });
});
