import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderHook } from "@testing-library/react";
import { useScrollTracker } from "../hooks/use-scroll-tracker";
import { Kino } from "../kino";

vi.mock("@react-kino/core", () => ({
  ScrollTracker: class MockScrollTracker {
    subscribe = vi.fn(() => vi.fn());
    start = vi.fn();
    stop = vi.fn();
  },
}));

describe("useScrollTracker", () => {
  it("falls back to an owned local tracker when used outside <Kino>", () => {
    const { result } = renderHook(() => useScrollTracker());
    expect(result.current.isOwned).toBe(true);
    expect(result.current.tracker).toBeTruthy();
  });

  it("returns a stable fallback tracker across re-renders", () => {
    const { result, rerender } = renderHook(() => useScrollTracker());
    const first = result.current.tracker;
    rerender();
    expect(result.current.tracker).toBe(first);
  });

  it("reuses the shared <Kino> tracker when available, and is not owned", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(Kino, null, children);

    const { result } = renderHook(() => useScrollTracker(), { wrapper });
    expect(result.current.isOwned).toBe(false);
    expect(result.current.tracker).toBeTruthy();
  });

  it("does not throw when rendered outside a <Kino> provider", () => {
    expect(() => renderHook(() => useScrollTracker())).not.toThrow();
  });
});
