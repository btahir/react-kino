import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render } from "@testing-library/react";
import { Progress } from "../progress";

vi.mock("@kino/core", () => ({
  ScrollTracker: class MockScrollTracker {
    subscribe = vi.fn(() => vi.fn());
    start = vi.fn();
    stop = vi.fn();
  },
}));

describe("Progress", () => {
  it("renders with default props (bar type)", () => {
    const { container } = render(<Progress progress={0.5} />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper).toBeTruthy();
    // Bar track should be inside
    const track = wrapper.firstElementChild as HTMLElement;
    expect(track).toBeTruthy();
    expect(track.style.position).toBe("fixed");
  });

  it("renders dots type", () => {
    const { container } = render(
      <Progress type="dots" progress={0.5} dotCount={5} />
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper).toBeTruthy();
    const dotsContainer = wrapper.firstElementChild as HTMLElement;
    expect(dotsContainer).toBeTruthy();
    // Should have 5 dot children
    expect(dotsContainer.children.length).toBe(5);
  });

  it("renders ring type", () => {
    const { container } = render(
      <Progress type="ring" progress={0.5} />
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper).toBeTruthy();
    const ringContainer = wrapper.firstElementChild as HTMLElement;
    const svg = ringContainer.querySelector("svg");
    expect(svg).toBeTruthy();
    // Should have 2 circle elements (track + fill)
    const circles = svg!.querySelectorAll("circle");
    expect(circles.length).toBe(2);
  });

  it("accepts color and trackColor props", () => {
    const { container } = render(
      <Progress progress={0.5} color="red" trackColor="gray" />
    );
    const wrapper = container.firstElementChild as HTMLElement;
    const track = wrapper.firstElementChild as HTMLElement;
    expect(track.style.backgroundColor).toBe("gray");
    const fill = track.firstElementChild as HTMLElement;
    expect(fill.style.backgroundColor).toBe("red");
  });

  it("accepts progress prop", () => {
    const { container } = render(<Progress progress={0.75} />);
    const wrapper = container.firstElementChild as HTMLElement;
    const track = wrapper.firstElementChild as HTMLElement;
    const fill = track.firstElementChild as HTMLElement;
    expect(fill.style.width).toBe("75%");
  });

  it("accepts className prop", () => {
    const { container } = render(
      <Progress progress={0.5} className="custom-progress" />
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toBe("custom-progress");
  });
});
