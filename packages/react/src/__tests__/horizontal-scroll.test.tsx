import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { HorizontalScroll, Panel } from "../horizontal-scroll";

vi.mock("@react-kino/core", () => ({
  ScrollTracker: class MockScrollTracker {
    subscribe = vi.fn(() => vi.fn());
    start = vi.fn();
    stop = vi.fn();
  },
  calcSceneProgress: vi.fn(() => 0),
}));

describe("HorizontalScroll", () => {
  it("renders children (Panel components)", () => {
    render(
      <HorizontalScroll>
        <Panel>
          <div data-testid="panel-1">Panel 1</div>
        </Panel>
        <Panel>
          <div data-testid="panel-2">Panel 2</div>
        </Panel>
      </HorizontalScroll>
    );
    expect(screen.getByTestId("panel-1")).toBeTruthy();
    expect(screen.getByTestId("panel-2")).toBeTruthy();
  });

  it("accepts className prop", () => {
    const { container } = render(
      <HorizontalScroll className="custom-scroll">
        <Panel>
          <div>Panel</div>
        </Panel>
      </HorizontalScroll>
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toBe("custom-scroll");
  });
});

describe("HorizontalScroll reduced motion", () => {
  it("omits the scroll-linked translate when prefers-reduced-motion is set", () => {
    const originalMatchMedia = window.matchMedia;
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === "(prefers-reduced-motion: reduce)",
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    const { container } = render(
      <HorizontalScroll>
        <Panel>
          <div>Panel 1</div>
        </Panel>
      </HorizontalScroll>
    );

    const spacer = container.firstElementChild as HTMLElement;
    const sticky = spacer.firstElementChild as HTMLElement;
    const strip = sticky.firstElementChild as HTMLElement;
    expect(strip.style.transform).toBe("");

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: originalMatchMedia,
    });
  });

  it("applies the scroll-linked translate when reduced motion is not preferred", () => {
    const { container } = render(
      <HorizontalScroll>
        <Panel>
          <div>Panel 1</div>
        </Panel>
      </HorizontalScroll>
    );

    const spacer = container.firstElementChild as HTMLElement;
    const sticky = spacer.firstElementChild as HTMLElement;
    const strip = sticky.firstElementChild as HTMLElement;
    expect(strip.style.transform).toBe("translateX(-0px)");
  });
});

describe("Panel", () => {
  it("renders its children", () => {
    render(
      <Panel>
        <div data-testid="panel-child">Hello</div>
      </Panel>
    );
    expect(screen.getByTestId("panel-child")).toBeTruthy();
    expect(screen.getByText("Hello")).toBeTruthy();
  });

  it("accepts className prop", () => {
    const { container } = render(
      <Panel className="custom-panel">
        <div>Content</div>
      </Panel>
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toBe("custom-panel");
  });

  it("accepts style prop and merges with default panel styles", () => {
    const { container } = render(
      <Panel style={{ backgroundColor: "blue" }}>
        <div>Content</div>
      </Panel>
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.style.backgroundColor).toBe("blue");
    // Default styles should still be applied
    expect(wrapper.style.width).toBe("100vw");
    expect(wrapper.style.height).toBe("var(--kino-panel-height, 100vh)");
  });
});
