import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { CompareSlider } from "../compare-slider";

vi.mock("@react-kino/core", () => ({
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

  describe("accessibility", () => {
    it("exposes the handle with role=slider and aria value attributes", () => {
      const { container } = render(
        <CompareSlider
          before={<div>Before</div>}
          after={<div>After</div>}
          initialPosition={0.5}
        />
      );
      const wrapper = container.firstElementChild as HTMLElement;
      const handle = wrapper.children[2] as HTMLElement;

      expect(handle.getAttribute("role")).toBe("slider");
      expect(handle.getAttribute("aria-valuenow")).toBe("50");
      expect(handle.getAttribute("aria-valuemin")).toBe("0");
      expect(handle.getAttribute("aria-valuemax")).toBe("100");
      expect(handle.getAttribute("aria-label")).toBe("Comparison slider");
      expect(handle.getAttribute("tabindex")).toBe("0");
    });

    it("accepts a custom ariaLabel", () => {
      const { container } = render(
        <CompareSlider
          before={<div>Before</div>}
          after={<div>After</div>}
          ariaLabel="Before and after image slider"
        />
      );
      const wrapper = container.firstElementChild as HTMLElement;
      const handle = wrapper.children[2] as HTMLElement;
      expect(handle.getAttribute("aria-label")).toBe("Before and after image slider");
    });

    it("is not keyboard-focusable when scrollDriven", () => {
      const { container } = render(
        <CompareSlider
          before={<div>Before</div>}
          after={<div>After</div>}
          scrollDriven
          progress={0.5}
        />
      );
      const wrapper = container.firstElementChild as HTMLElement;
      const handle = wrapper.children[2] as HTMLElement;
      expect(handle.getAttribute("tabindex")).toBe("-1");
      expect(handle.getAttribute("aria-disabled")).toBe("true");
    });
  });

  describe("keyboard interaction", () => {
    it("moves left on ArrowLeft", () => {
      const { container } = render(
        <CompareSlider
          before={<div>Before</div>}
          after={<div>After</div>}
          initialPosition={0.5}
        />
      );
      const wrapper = container.firstElementChild as HTMLElement;
      const handle = wrapper.children[2] as HTMLElement;

      fireEvent.keyDown(handle, { key: "ArrowLeft" });

      expect(handle.style.left).toBe("45%");
    });

    it("moves right on ArrowRight", () => {
      const { container } = render(
        <CompareSlider
          before={<div>Before</div>}
          after={<div>After</div>}
          initialPosition={0.5}
        />
      );
      const wrapper = container.firstElementChild as HTMLElement;
      const handle = wrapper.children[2] as HTMLElement;

      fireEvent.keyDown(handle, { key: "ArrowRight" });

      expect(parseFloat(handle.style.left)).toBeCloseTo(55);
    });

    it("jumps to 0% on Home", () => {
      const { container } = render(
        <CompareSlider
          before={<div>Before</div>}
          after={<div>After</div>}
          initialPosition={0.5}
        />
      );
      const wrapper = container.firstElementChild as HTMLElement;
      const handle = wrapper.children[2] as HTMLElement;

      fireEvent.keyDown(handle, { key: "Home" });

      expect(handle.style.left).toBe("0%");
    });

    it("jumps to 100% on End", () => {
      const { container } = render(
        <CompareSlider
          before={<div>Before</div>}
          after={<div>After</div>}
          initialPosition={0.5}
        />
      );
      const wrapper = container.firstElementChild as HTMLElement;
      const handle = wrapper.children[2] as HTMLElement;

      fireEvent.keyDown(handle, { key: "End" });

      expect(handle.style.left).toBe("100%");
    });

    it("clamps at 0% and does not go below it", () => {
      const { container } = render(
        <CompareSlider
          before={<div>Before</div>}
          after={<div>After</div>}
          initialPosition={0.02}
        />
      );
      const wrapper = container.firstElementChild as HTMLElement;
      const handle = wrapper.children[2] as HTMLElement;

      fireEvent.keyDown(handle, { key: "ArrowLeft" });

      expect(handle.style.left).toBe("0%");
    });

    it("ignores arrow keys when scrollDriven", () => {
      const { container } = render(
        <CompareSlider
          before={<div>Before</div>}
          after={<div>After</div>}
          scrollDriven
          progress={0.5}
        />
      );
      const wrapper = container.firstElementChild as HTMLElement;
      const handle = wrapper.children[2] as HTMLElement;

      fireEvent.keyDown(handle, { key: "ArrowRight" });

      expect(handle.style.left).toBe("50%");
    });
  });

  describe("pointer cancel", () => {
    it("stops dragging on pointercancel", () => {
      const { container } = render(
        <CompareSlider before={<div>Before</div>} after={<div>After</div>} />
      );
      const wrapper = container.firstElementChild as HTMLElement;

      // Should not throw, and the wrapper should still be draggable
      // afterward (isDragging reset to false).
      fireEvent.pointerCancel(wrapper);
      expect(wrapper.style.cursor).toBe("ew-resize");
    });
  });
});
