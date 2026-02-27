import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { CompareSlider } from "../compare-slider";

vi.mock("@kino/core", () => ({
  ScrollTracker: class MockScrollTracker {
    subscribe = vi.fn(() => vi.fn());
    start = vi.fn();
    stop = vi.fn();
  },
  calcSceneProgress: vi.fn(() => 0),
  parseDuration: vi.fn(() => 1600),
}));

describe("CompareSlider", () => {
  it("renders before and after content", () => {
    render(
      <CompareSlider
        before={<div data-testid="before">Before</div>}
        after={<div data-testid="after">After</div>}
      />
    );
    expect(screen.getByTestId("before")).toBeTruthy();
    expect(screen.getByTestId("after")).toBeTruthy();
  });

  it("renders in drag mode by default", () => {
    const { container } = render(
      <CompareSlider
        before={<div>Before</div>}
        after={<div>After</div>}
      />
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.style.cursor).toBe("ew-resize");
  });

  it("renders in scrollDriven mode", () => {
    const { container } = render(
      <CompareSlider
        before={<div>Before</div>}
        after={<div>After</div>}
        scrollDriven
        progress={0.3}
      />
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.style.cursor).toBe("default");
  });

  it("accepts initialPosition prop", () => {
    const { container } = render(
      <CompareSlider
        before={<div>Before</div>}
        after={<div>After</div>}
        initialPosition={0.75}
      />
    );
    // The handle position should reflect initialPosition (75%)
    const wrapper = container.firstElementChild as HTMLElement;
    // The handle container is the 3rd child div
    const handle = wrapper.children[2] as HTMLElement;
    expect(handle.style.left).toBe("75%");
  });

  it("accepts className prop", () => {
    const { container } = render(
      <CompareSlider
        before={<div>Before</div>}
        after={<div>After</div>}
        className="custom-slider"
      />
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toBe("custom-slider");
  });
});
