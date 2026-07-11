import { vi } from "vitest";

// Mock IntersectionObserver. On observe(), synchronously invoke the callback
// with `isIntersecting: true` so that IO-gated scroll subscriptions activate in
// jsdom (jsdom has no real intersection reporting). Tests that need to simulate
// leaving the viewport can override this per-test.
class MockIntersectionObserver {
  cb: (entries: unknown[], observer: unknown) => void;
  constructor(cb: (entries: unknown[], observer: unknown) => void) {
    this.cb = cb;
  }
  observe(el: Element) {
    this.cb(
      [{ isIntersecting: true, target: el, intersectionRatio: 1 }],
      this
    );
  }
  unobserve() {}
  disconnect() {}
}
global.IntersectionObserver =
  MockIntersectionObserver as unknown as typeof IntersectionObserver;

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn((cb) => {
  cb(0);
  return 0;
});

global.cancelAnimationFrame = vi.fn();

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
