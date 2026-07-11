import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import { VideoScroll } from "../video-scroll";

let capturedSubscriber: ((data: { scrollY: number; viewportHeight: number }) => void) | null =
  null;

// Mock @react-kino/core to avoid real scroll tracking in tests
vi.mock("@react-kino/core", () => ({
  ScrollTracker: class {
    subscribe(cb: (data: { scrollY: number; viewportHeight: number }) => void) {
      capturedSubscriber = cb;
      return () => {};
    }
    start() {}
    stop() {}
  },
  calcSceneProgress: vi.fn(() => 0.5),
  parseDuration: vi.fn(() => 2400),
}));

describe("VideoScroll", () => {
  it("renders the spacer div", () => {
    const { container } = render(
      <VideoScroll src="/test-video.mp4" />
    );
    const spacer = container.firstElementChild as HTMLElement;
    expect(spacer).toBeTruthy();
    expect(spacer.style.position).toBe("relative");
    expect(spacer.style.height).toBe("2400px");
  });

  it("renders a video element", () => {
    const { container } = render(
      <VideoScroll src="/test-video.mp4" />
    );
    const video = container.querySelector("video");
    expect(video).toBeTruthy();
    expect(video!.getAttribute("src")).toBe("/test-video.mp4");
    expect(video!.muted).toBe(true);
  });

  it("does not autoplay", () => {
    const { container } = render(
      <VideoScroll src="/test-video.mp4" />
    );
    const video = container.querySelector("video");
    expect(video).toBeTruthy();
    expect(video!.autoplay).toBe(false);
  });

  it("accepts poster prop", () => {
    const { container } = render(
      <VideoScroll src="/test-video.mp4" poster="/poster.jpg" />
    );
    const video = container.querySelector("video");
    expect(video).toBeTruthy();
    expect(video!.getAttribute("poster")).toBe("/poster.jpg");
  });

  it("renders overlay children", () => {
    const { container } = render(
      <VideoScroll src="/test-video.mp4">
        <div data-testid="overlay">Overlay content</div>
      </VideoScroll>
    );
    const overlay = container.querySelector("[data-testid='overlay']");
    expect(overlay).toBeTruthy();
    expect(overlay!.textContent).toBe("Overlay content");
  });

  it("applies custom className to the spacer", () => {
    const { container } = render(
      <VideoScroll src="/test-video.mp4" className="custom-video" />
    );
    const spacer = container.firstElementChild as HTMLElement;
    expect(spacer.className).toBe("custom-video");
  });

  it("seeks to progress * duration once video metadata loads", () => {
    capturedSubscriber = null;
    const { container } = render(<VideoScroll src="/test-video.mp4" />);
    const video = container.querySelector("video") as HTMLVideoElement;

    // Make currentTime a plain read/write property so we can observe the
    // seek — jsdom's real HTMLMediaElement implementation doesn't persist it.
    let currentTimeValue = 0;
    Object.defineProperty(video, "currentTime", {
      get: () => currentTimeValue,
      set: (v: number) => {
        currentTimeValue = v;
      },
      configurable: true,
    });
    Object.defineProperty(video, "duration", {
      value: 10,
      configurable: true,
    });

    // Drive progress to 0.5 via the (mocked) scroll tracker subscription,
    // as the real ScrollTracker would on scroll/resize.
    act(() => {
      capturedSubscriber?.({ scrollY: 100, viewportHeight: 800 });
    });

    // The scrub effect runs first, but bails out because duration was
    // NaN/0 when it last ran (before we defined it above / before
    // metadata "loaded"). Firing loadedmetadata should sync the video to
    // the current progress.
    fireEvent(video, new Event("loadedmetadata"));

    expect(video.currentTime).toBeCloseTo(5);
  });

  it("does not seek on loadedmetadata when reduced motion is preferred", () => {
    capturedSubscriber = null;
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

    const { container } = render(<VideoScroll src="/test-video.mp4" />);
    const video = container.querySelector("video") as HTMLVideoElement;

    let currentTimeValue = 0;
    Object.defineProperty(video, "currentTime", {
      get: () => currentTimeValue,
      set: (v: number) => {
        currentTimeValue = v;
      },
      configurable: true,
    });
    Object.defineProperty(video, "duration", {
      value: 10,
      configurable: true,
    });

    act(() => {
      capturedSubscriber?.({ scrollY: 100, viewportHeight: 800 });
    });

    fireEvent(video, new Event("loadedmetadata"));

    expect(video.currentTime).toBe(0);

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: originalMatchMedia,
    });
  });
});
