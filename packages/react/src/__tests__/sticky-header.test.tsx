import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { render, act, cleanup } from "@testing-library/react";
import { StickyHeader } from "../sticky-header";

describe("StickyHeader", () => {
  let scrollHandlers: Array<() => void>;
  let origAddEventListener: typeof window.addEventListener;
  let origRemoveEventListener: typeof window.removeEventListener;

  beforeEach(() => {
    scrollHandlers = [];
    origAddEventListener = window.addEventListener;
    origRemoveEventListener = window.removeEventListener;

    window.addEventListener = vi.fn((event: string, handler: any) => {
      if (event === "scroll") {
        scrollHandlers.push(handler);
      } else {
        origAddEventListener.call(window, event, handler);
      }
    }) as any;

    window.removeEventListener = vi.fn((event: string, handler: any) => {
      if (event === "scroll") {
        scrollHandlers = scrollHandlers.filter((h) => h !== handler);
      } else {
        origRemoveEventListener.call(window, event, handler);
      }
    }) as any;

    Object.defineProperty(window, "scrollY", { value: 0, writable: true, configurable: true });
  });

  afterEach(() => {
    cleanup();
    window.addEventListener = origAddEventListener;
    window.removeEventListener = origRemoveEventListener;
    vi.restoreAllMocks();
  });

  it("renders a header element with children", () => {
    const { container } = render(
      <StickyHeader>
        <nav data-testid="nav">Nav</nav>
      </StickyHeader>
    );
    const header = container.querySelector("header")!;
    expect(header).toBeTruthy();
    expect(header.querySelector('[data-testid="nav"]')).toBeTruthy();
    expect(header.textContent).toContain("Nav");
  });

  it("applies position fixed, top 0, z-index 50", () => {
    const { container } = render(
      <StickyHeader>
        <span>Logo</span>
      </StickyHeader>
    );
    const header = container.querySelector("header")!;
    expect(header.style.position).toBe("fixed");
    expect(header.style.top).toBe("0px");
    expect(header.style.zIndex).toBe("50");
  });

  it("starts with transparent background", () => {
    const { container } = render(
      <StickyHeader>
        <span>Logo</span>
      </StickyHeader>
    );
    const header = container.querySelector("header")!;
    expect(header.style.background).toBe("transparent");
  });

  it("applies background when scrolled past threshold", () => {
    const { container } = render(
      <StickyHeader threshold={50} background="red">
        <span>Logo</span>
      </StickyHeader>
    );

    Object.defineProperty(window, "scrollY", { value: 100, writable: true, configurable: true });
    act(() => {
      scrollHandlers.forEach((fn) => fn());
    });

    const header = container.querySelector("header")!;
    expect(header.style.background).toBe("red");
  });

  it("uses default threshold of 80", () => {
    const { container } = render(
      <StickyHeader>
        <span>Logo</span>
      </StickyHeader>
    );
    const header = container.querySelector("header")!;

    // Scroll to 50 (below default threshold of 80)
    Object.defineProperty(window, "scrollY", { value: 50, writable: true, configurable: true });
    act(() => {
      scrollHandlers.forEach((fn) => fn());
    });
    expect(header.style.background).toBe("transparent");

    // Scroll to 100 (above threshold)
    Object.defineProperty(window, "scrollY", { value: 100, writable: true, configurable: true });
    act(() => {
      scrollHandlers.forEach((fn) => fn());
    });
    expect(header.style.background).toContain("rgba");
    expect(header.style.background).toContain("0.8");
  });

  it("accepts className prop", () => {
    const { container } = render(
      <StickyHeader className="my-header">
        <span>Logo</span>
      </StickyHeader>
    );
    const header = container.querySelector("header")!;
    expect(header.className).toBe("my-header");
  });

  it("accepts style prop and merges with internal styles", () => {
    const { container } = render(
      <StickyHeader style={{ padding: "16px" }}>
        <span>Logo</span>
      </StickyHeader>
    );
    const header = container.querySelector("header")!;
    expect(header.style.padding).toBe("16px");
    expect(header.style.position).toBe("fixed");
  });

  it("accepts custom background prop", () => {
    const { container } = render(
      <StickyHeader background="rgba(255,0,0,0.9)">
        <span>Logo</span>
      </StickyHeader>
    );

    Object.defineProperty(window, "scrollY", { value: 100, writable: true, configurable: true });
    act(() => {
      scrollHandlers.forEach((fn) => fn());
    });

    const header = container.querySelector("header")!;
    expect(header.style.background).toContain("rgba");
    expect(header.style.background).toContain("0.9");
  });

  it("applies backdrop blur when scrolled and blur is true (default)", () => {
    const { container } = render(
      <StickyHeader>
        <span>Logo</span>
      </StickyHeader>
    );

    Object.defineProperty(window, "scrollY", { value: 100, writable: true, configurable: true });
    act(() => {
      scrollHandlers.forEach((fn) => fn());
    });

    const header = container.querySelector("header")!;
    expect(header.style.backdropFilter).toBe("blur(12px)");
  });

  it("does not apply backdrop blur when blur is false", () => {
    const { container } = render(
      <StickyHeader blur={false}>
        <span>Logo</span>
      </StickyHeader>
    );

    Object.defineProperty(window, "scrollY", { value: 100, writable: true, configurable: true });
    act(() => {
      scrollHandlers.forEach((fn) => fn());
    });

    const header = container.querySelector("header")!;
    expect(header.style.backdropFilter).toBe("none");
  });

  it("disables transitions with prefers-reduced-motion", () => {
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
      <StickyHeader>
        <span>Logo</span>
      </StickyHeader>
    );

    const header = container.querySelector("header")!;
    expect(header.style.transition).toBe("none");

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: originalMatchMedia,
    });
  });

  it("applies left 0 and right 0 for full width", () => {
    const { container } = render(
      <StickyHeader>
        <span>Logo</span>
      </StickyHeader>
    );
    const header = container.querySelector("header")!;
    expect(header.style.left).toBe("0px");
    expect(header.style.right).toBe("0px");
  });
});
