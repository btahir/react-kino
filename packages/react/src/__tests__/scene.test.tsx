import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { Scene } from "../scene";

// Mock @kino/core to avoid real scroll tracking in tests
vi.mock("@kino/core", () => ({
  ScrollTracker: class MockScrollTracker {
    subscribe = vi.fn(() => vi.fn());
    start = vi.fn();
    stop = vi.fn();
  },
  calcSceneProgress: vi.fn(() => 0),
  parseDuration: vi.fn(() => 1600),
}));

describe("Scene", () => {
  it("renders static children", () => {
    render(
      <Scene duration="200vh">
        <div data-testid="child">Hello</div>
      </Scene>
    );
    expect(screen.getByTestId("child")).toBeTruthy();
    expect(screen.getByText("Hello")).toBeTruthy();
  });

  it("renders children as render prop", () => {
    render(
      <Scene duration="200vh">
        {(progress) => (
          <div data-testid="render-prop">Progress: {progress}</div>
        )}
      </Scene>
    );
    expect(screen.getByTestId("render-prop")).toBeTruthy();
  });

  it("passes progress 0 initially to render prop", () => {
    render(
      <Scene duration="200vh">
        {(progress) => <div data-testid="progress">{progress}</div>}
      </Scene>
    );
    expect(screen.getByTestId("progress").textContent).toBe("0");
  });

  it("renders a spacer div with height", () => {
    const { container } = render(
      <Scene duration="200vh">
        <div>Content</div>
      </Scene>
    );
    const spacer = container.firstElementChild as HTMLElement;
    expect(spacer).toBeTruthy();
    expect(spacer.style.position).toBe("relative");
    // Height is set from parseDuration mock (1600px)
    expect(spacer.style.height).toBe("1600px");
  });

  it("renders a sticky inner div when pin is true (default)", () => {
    const { container } = render(
      <Scene duration="200vh">
        <div>Content</div>
      </Scene>
    );
    const spacer = container.firstElementChild as HTMLElement;
    const sticky = spacer.firstElementChild as HTMLElement;
    expect(sticky.style.position).toBe("sticky");
    expect(sticky.style.top).toBe("0px");
    expect(sticky.style.height).toBe("100vh");
  });

  it("does not apply sticky styles when pin is false", () => {
    const { container } = render(
      <Scene duration="200vh" pin={false}>
        <div>Content</div>
      </Scene>
    );
    const spacer = container.firstElementChild as HTMLElement;
    const inner = spacer.firstElementChild as HTMLElement;
    expect(inner.style.position).not.toBe("sticky");
  });

  it("applies custom className to the spacer", () => {
    const { container } = render(
      <Scene duration="200vh" className="custom-scene">
        <div>Content</div>
      </Scene>
    );
    const spacer = container.firstElementChild as HTMLElement;
    expect(spacer.className).toBe("custom-scene");
  });
});
