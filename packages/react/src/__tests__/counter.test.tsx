import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import { render, cleanup } from "@testing-library/react";
import { Counter } from "../counter";

// Mock @react-kino/core with real implementations for math functions
vi.mock("@react-kino/core", async () => {
  const actual = await vi.importActual<typeof import("@react-kino/core")>(
    "@react-kino/core"
  );
  return {
    ...actual,
  };
});

// Mock the scene context so Counter works outside a Scene
vi.mock("../scene", () => ({
  useSceneContext: vi.fn(() => {
    throw new Error("Not inside Scene");
  }),
  useSceneContextOptional: vi.fn(() => null),
}));

afterEach(() => {
  cleanup();
});

describe("Counter", () => {
  it("renders the from value when progress is 0", () => {
    const { container } = render(
      <Counter from={0} to={100} progress={0} format={(v) => String(v)} />
    );
    expect(container.textContent).toBe("0");
  });

  it("renders the to value when progress >= at + span", () => {
    const { container } = render(
      <Counter
        from={0}
        to={100}
        at={0}
        span={0.3}
        progress={0.5}
        format={(v) => String(v)}
      />
    );
    expect(container.textContent).toBe("100");
  });

  it("renders an intermediate value during counting", () => {
    const { container } = render(
      <Counter
        from={0}
        to={100}
        at={0}
        span={1}
        progress={0.5}
        easing="linear"
        format={(v) => String(v)}
      />
    );
    expect(container.textContent).toBe("50");
  });

  it("uses custom format function", () => {
    const { container } = render(
      <Counter
        from={0}
        to={1000}
        at={0}
        span={0.3}
        progress={0.5}
        format={(v) => `$${v}`}
      />
    );
    expect(container.textContent).toBe("$1000");
  });

  it("applies className", () => {
    const { container } = render(
      <Counter
        from={0}
        to={100}
        progress={0}
        className="counter-class"
        format={(v) => String(v)}
      />
    );
    const span = container.querySelector("span");
    expect(span).toBeTruthy();
    expect(span!.className).toBe("counter-class");
  });

  it("renders final value with prefers-reduced-motion when progress >= at", () => {
    // Mock matchMedia to return reduced motion
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === "(prefers-reduced-motion: reduce)",
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    const { container } = render(
      <Counter
        from={0}
        to={100}
        at={0}
        span={0.3}
        progress={0.1}
        format={(v) => String(v)}
      />
    );
    expect(container.textContent).toBe("100");

    // Restore default matchMedia mock
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });
});
