import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { Reveal } from "../reveal";
import { Scene } from "../scene";

vi.mock("@kino/core", () => ({
  ScrollTracker: class MockScrollTracker {
    subscribe = vi.fn(() => vi.fn());
    start = vi.fn();
    stop = vi.fn();
  },
  calcSceneProgress: vi.fn(() => 0),
  parseDuration: vi.fn(() => 1600),
}));

describe("Reveal", () => {
  it("renders children", () => {
    render(
      <Reveal progress={0}>
        <span data-testid="child">Hello</span>
      </Reveal>
    );
    expect(screen.getByTestId("child")).toBeTruthy();
  });

  it("applies hidden styles when progress < at", () => {
    const { container } = render(
      <Reveal progress={0} at={0.5} animation="fade">
        <span>Content</span>
      </Reveal>
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.style.opacity).toBe("0");
  });

  it("applies visible styles when progress >= at", () => {
    const { container } = render(
      <Reveal progress={0.6} at={0.5} animation="fade">
        <span>Content</span>
      </Reveal>
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.style.opacity).toBe("1");
  });

  it("does NOT animate when prefers-reduced-motion is true", () => {
    const originalMatchMedia = window.matchMedia;
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
      <Reveal progress={0} at={0.5} animation="fade-up">
        <span>Content</span>
      </Reveal>
    );
    const wrapper = container.firstElementChild as HTMLElement;
    // When reduced motion, renders VISIBLE styles without transition
    expect(wrapper.style.opacity).toBe("1");
    expect(wrapper.style.willChange).toBe("");

    // Restore
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: originalMatchMedia,
    });
  });

  it("accepts className prop", () => {
    const { container } = render(
      <Reveal progress={0} className="custom-reveal">
        <span>Content</span>
      </Reveal>
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toBe("custom-reveal");
  });

  it("works with fade animation preset (hidden)", () => {
    const { container } = render(
      <Reveal progress={0} at={0.5} animation="fade">
        <span>Content</span>
      </Reveal>
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.style.opacity).toBe("0");
  });

  it("works with fade-up animation preset (hidden)", () => {
    const { container } = render(
      <Reveal progress={0} at={0.5} animation="fade-up">
        <span>Content</span>
      </Reveal>
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.style.opacity).toBe("0");
    expect(wrapper.style.transform).toBe("translateY(40px)");
  });

  it("works with fade-down animation preset (hidden)", () => {
    const { container } = render(
      <Reveal progress={0} at={0.5} animation="fade-down">
        <span>Content</span>
      </Reveal>
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.style.opacity).toBe("0");
    expect(wrapper.style.transform).toBe("translateY(-40px)");
  });

  it("works with scale animation preset (hidden)", () => {
    const { container } = render(
      <Reveal progress={0} at={0.5} animation="scale">
        <span>Content</span>
      </Reveal>
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.style.opacity).toBe("0");
    expect(wrapper.style.transform).toBe("scale(0.9)");
  });

  it("works with blur animation preset (hidden)", () => {
    const { container } = render(
      <Reveal progress={0} at={0.5} animation="blur">
        <span>Content</span>
      </Reveal>
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.style.opacity).toBe("0");
    expect(wrapper.style.filter).toBe("blur(12px)");
  });

  it("reads progress from SceneContext when no progress prop given", () => {
    const { container } = render(
      <Scene duration="200vh">
        <Reveal at={0} animation="fade">
          <span data-testid="reveal-child">Content</span>
        </Reveal>
      </Scene>
    );
    // Scene provides progress=0 by default (from mock), which satisfies at=0
    expect(screen.getByTestId("reveal-child")).toBeTruthy();
  });
});
