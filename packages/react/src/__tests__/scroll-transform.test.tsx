import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import { render, cleanup } from "@testing-library/react";
import { ScrollTransform } from "../scroll-transform";

// Mock @react-kino/core with real implementations for math functions
vi.mock("@react-kino/core", async () => {
  const actual = await vi.importActual<typeof import("@react-kino/core")>(
    "@react-kino/core"
  );
  return {
    ...actual,
  };
});

// Mock the scene context so ScrollTransform works outside a Scene
vi.mock("../scene", () => ({
  useSceneContext: vi.fn(() => {
    throw new Error("Not inside Scene");
  }),
}));

afterEach(() => {
  cleanup();
});

describe("ScrollTransform", () => {
  it("renders children", () => {
    const { container } = render(
      <ScrollTransform
        from={{ x: 0 }}
        to={{ x: 100 }}
        progress={0}
      >
        <span>Hello</span>
      </ScrollTransform>
    );
    expect(container.textContent).toBe("Hello");
  });

  it("applies from transforms at progress 0", () => {
    const { container } = render(
      <ScrollTransform
        from={{ x: 50, opacity: 0.5 }}
        to={{ x: 100, opacity: 1 }}
        progress={0}
        easing="linear"
      >
        <span>Content</span>
      </ScrollTransform>
    );
    const div = container.firstElementChild as HTMLElement;
    expect(div.style.transform).toContain("translateX(50px)");
    expect(div.style.opacity).toBe("0.5");
  });

  it("applies to transforms at progress >= at + span", () => {
    const { container } = render(
      <ScrollTransform
        from={{ x: 0, scale: 0.5 }}
        to={{ x: 200, scale: 1 }}
        at={0}
        span={0.5}
        progress={0.8}
        easing="linear"
      >
        <span>Content</span>
      </ScrollTransform>
    );
    const div = container.firstElementChild as HTMLElement;
    expect(div.style.transform).toContain("translateX(200px)");
    expect(div.style.transform).toContain("scale(1)");
  });

  it("applies intermediate transforms at mid-progress with linear easing", () => {
    const { container } = render(
      <ScrollTransform
        from={{ x: 0, opacity: 0 }}
        to={{ x: 100, opacity: 1 }}
        at={0}
        span={1}
        progress={0.5}
        easing="linear"
      >
        <span>Content</span>
      </ScrollTransform>
    );
    const div = container.firstElementChild as HTMLElement;
    expect(div.style.transform).toContain("translateX(50px)");
    expect(div.style.opacity).toBe("0.5");
  });

  it("handles perspective prop", () => {
    const { container } = render(
      <ScrollTransform
        from={{ rotateY: 45 }}
        to={{ rotateY: 0 }}
        perspective={1200}
        progress={0}
        easing="linear"
      >
        <span>Content</span>
      </ScrollTransform>
    );
    const div = container.firstElementChild as HTMLElement;
    expect(div.style.transform).toContain("perspective(1200px)");
    expect(div.style.backfaceVisibility).toBe("hidden");
  });

  it("handles transformOrigin prop", () => {
    const { container } = render(
      <ScrollTransform
        from={{ scale: 0 }}
        to={{ scale: 1 }}
        transformOrigin="top left"
        progress={0}
      >
        <span>Content</span>
      </ScrollTransform>
    );
    const div = container.firstElementChild as HTMLElement;
    expect(div.style.transformOrigin).toBe("top left");
  });

  it("applies className and merges style", () => {
    const { container } = render(
      <ScrollTransform
        from={{ x: 0 }}
        to={{ x: 100 }}
        progress={0}
        className="my-class"
        style={{ color: "red", padding: "10px" }}
      >
        <span>Content</span>
      </ScrollTransform>
    );
    const div = container.firstElementChild as HTMLElement;
    expect(div.className).toBe("my-class");
    expect(div.style.color).toBe("red");
    expect(div.style.padding).toBe("10px");
  });

  it("shows to state immediately with prefers-reduced-motion", () => {
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
      <ScrollTransform
        from={{ x: 0, opacity: 0 }}
        to={{ x: 200, opacity: 1 }}
        at={0}
        span={1}
        progress={0.1}
        easing="linear"
      >
        <span>Content</span>
      </ScrollTransform>
    );
    const div = container.firstElementChild as HTMLElement;
    // Should show final (to) state, not interpolated
    expect(div.style.transform).toContain("translateX(200px)");
    expect(div.style.opacity).toBe("1");

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

  it("applies opacity as a separate CSS property, not in transform string", () => {
    const { container } = render(
      <ScrollTransform
        from={{ x: 0, opacity: 0.3 }}
        to={{ x: 100, opacity: 1 }}
        progress={0}
        easing="linear"
      >
        <span>Content</span>
      </ScrollTransform>
    );
    const div = container.firstElementChild as HTMLElement;
    // opacity should NOT appear in the transform string
    expect(div.style.transform).not.toContain("opacity");
    // opacity should be a separate CSS property
    expect(div.style.opacity).toBe("0.3");
  });
});
