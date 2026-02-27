import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useScrollProgress } from "../hooks/use-scroll-progress";

let mockSubscriber: ((data: { progress: number }) => void) | null = null;

vi.mock("@kino/core", () => ({
  ScrollTracker: class MockScrollTracker {
    subscribe(cb: (data: { progress: number }) => void) {
      mockSubscriber = cb;
      return vi.fn();
    }
    start = vi.fn();
    stop = vi.fn();
  },
}));

describe("useScrollProgress", () => {
  beforeEach(() => {
    mockSubscriber = null;
  });

  it("returns 0 initially", () => {
    const { result } = renderHook(() => useScrollProgress());
    expect(result.current).toBe(0);
  });

  it("returns updated value when ScrollTracker calls subscriber", () => {
    const { result } = renderHook(() => useScrollProgress());
    expect(result.current).toBe(0);

    act(() => {
      mockSubscriber?.({ progress: 0.65 });
    });

    expect(result.current).toBe(0.65);
  });
});
