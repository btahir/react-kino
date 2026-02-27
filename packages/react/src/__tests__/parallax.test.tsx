import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { Parallax } from "../parallax";

vi.mock("@kino/core", () => ({
  ScrollTracker: class MockScrollTracker {
    subscribe = vi.fn(() => vi.fn());
    start = vi.fn();
    stop = vi.fn();
  },
}));

describe("Parallax", () => {
  it("renders children", () => {
    render(
      <Parallax>
        <div data-testid="child">Hello</div>
      </Parallax>
    );
    expect(screen.getByTestId("child")).toBeTruthy();
    expect(screen.getByText("Hello")).toBeTruthy();
  });

  it("applies translateY(0px) when offset is 0", () => {
    const { container } = render(
      <Parallax>
        <div>Content</div>
      </Parallax>
    );
    const wrapper = container.firstElementChild as HTMLElement;
    // After useEffect fires, offset=0 but transform is still applied
    expect(wrapper.style.transform).toBe("translateY(0px)");
  });

  it("accepts speed prop", () => {
    const { container } = render(
      <Parallax speed={0.8}>
        <div>Content</div>
      </Parallax>
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper).toBeTruthy();
  });

  it("accepts direction prop", () => {
    const { container } = render(
      <Parallax direction="horizontal">
        <div>Content</div>
      </Parallax>
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper).toBeTruthy();
  });

  it("accepts className prop", () => {
    const { container } = render(
      <Parallax className="custom-parallax">
        <div>Content</div>
      </Parallax>
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toBe("custom-parallax");
  });

  it("accepts style prop and merges it", () => {
    const { container } = render(
      <Parallax style={{ backgroundColor: "red" }}>
        <div>Content</div>
      </Parallax>
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.style.backgroundColor).toBe("red");
  });
});
