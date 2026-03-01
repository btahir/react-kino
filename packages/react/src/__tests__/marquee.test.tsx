import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { Marquee } from "../marquee";

// Mock ResizeObserver
class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

beforeEach(() => {
  vi.stubGlobal("ResizeObserver", MockResizeObserver);
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("Marquee", () => {
  it("renders children", () => {
    render(
      <Marquee>
        <span data-testid="item">Hello</span>
      </Marquee>
    );
    expect(screen.getAllByTestId("item").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Hello").length).toBeGreaterThanOrEqual(1);
  });

  it("duplicates children for infinite scroll loop", () => {
    render(
      <Marquee>
        <span data-testid="item">A</span>
        <span data-testid="item">B</span>
      </Marquee>
    );
    // Children are rendered twice (original + duplicate)
    expect(screen.getAllByTestId("item").length).toBe(4);
  });

  it("applies overflow hidden on container", () => {
    const { container } = render(
      <Marquee>
        <span>Item</span>
      </Marquee>
    );
    const outer = container.firstElementChild as HTMLElement;
    expect(outer.style.overflow).toBe("hidden");
  });

  it("accepts className prop", () => {
    const { container } = render(
      <Marquee className="my-marquee">
        <span>Item</span>
      </Marquee>
    );
    const outer = container.firstElementChild as HTMLElement;
    expect(outer.className).toBe("my-marquee");
  });

  it("accepts gap prop", () => {
    const { container } = render(
      <Marquee gap={16}>
        <span>Item</span>
      </Marquee>
    );
    const track = container.querySelector("[style]")!
      .firstElementChild as HTMLElement;
    expect(track.style.gap).toBe("16px");
  });

  it("applies left animation by default", () => {
    const { container } = render(
      <Marquee>
        <span>Item</span>
      </Marquee>
    );
    const track = (container.firstElementChild as HTMLElement)
      .firstElementChild as HTMLElement;
    expect(track.style.animation).toContain("kino-marquee-left");
  });

  it("applies right animation when direction is right", () => {
    const { container } = render(
      <Marquee direction="right">
        <span>Item</span>
      </Marquee>
    );
    const track = (container.firstElementChild as HTMLElement)
      .firstElementChild as HTMLElement;
    expect(track.style.animation).toContain("kino-marquee-right");
  });

  it("pauses animation on mouse enter when pauseOnHover is true", () => {
    const { container } = render(
      <Marquee pauseOnHover>
        <span>Item</span>
      </Marquee>
    );
    const track = (container.firstElementChild as HTMLElement)
      .firstElementChild as HTMLElement;
    fireEvent.mouseEnter(track);
    expect(track.style.animationPlayState).toBe("paused");
  });

  it("resumes animation on mouse leave", () => {
    const { container } = render(
      <Marquee pauseOnHover>
        <span>Item</span>
      </Marquee>
    );
    const track = (container.firstElementChild as HTMLElement)
      .firstElementChild as HTMLElement;
    fireEvent.mouseEnter(track);
    fireEvent.mouseLeave(track);
    expect(track.style.animationPlayState).toBe("running");
  });

  it("does not pause on hover when pauseOnHover is false", () => {
    const { container } = render(
      <Marquee pauseOnHover={false}>
        <span>Item</span>
      </Marquee>
    );
    const track = (container.firstElementChild as HTMLElement)
      .firstElementChild as HTMLElement;
    fireEvent.mouseEnter(track);
    expect(track.style.animationPlayState).not.toBe("paused");
  });

  it("renders track with display flex and max-content width", () => {
    const { container } = render(
      <Marquee>
        <span>Item</span>
      </Marquee>
    );
    const track = (container.firstElementChild as HTMLElement)
      .firstElementChild as HTMLElement;
    expect(track.style.display).toBe("flex");
    expect(track.style.width).toBe("max-content");
  });

  it("renders static flex layout with prefers-reduced-motion", () => {
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

    const { container, unmount } = render(
      <Marquee>
        <span data-testid="item">A</span>
        <span data-testid="item">B</span>
      </Marquee>
    );

    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.style.display).toBe("flex");
    // In reduced-motion mode, children are NOT duplicated
    expect(wrapper.querySelectorAll('[data-testid="item"]').length).toBe(2);

    unmount();

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: originalMatchMedia,
    });
  });
});
