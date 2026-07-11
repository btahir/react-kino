import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ScrollTracker } from "../scroll-tracker";

// Mock browser globals for node environment
const mockWindow = {
  scrollY: 0,
  innerHeight: 768,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
};

const mockDocument = {
  documentElement: {
    scrollHeight: 3000,
  },
};

beforeEach(() => {
  // Set up globals
  (globalThis as any).window = mockWindow;
  (globalThis as any).document = mockDocument;
  (globalThis as any).requestAnimationFrame = vi.fn((cb: Function) => {
    cb(0);
    return 1;
  });
  (globalThis as any).cancelAnimationFrame = vi.fn();

  // Reset mocks
  mockWindow.scrollY = 0;
  mockWindow.innerHeight = 768;
  mockWindow.addEventListener.mockClear();
  mockWindow.removeEventListener.mockClear();
});

afterEach(() => {
  delete (globalThis as any).window;
  delete (globalThis as any).document;
  delete (globalThis as any).requestAnimationFrame;
  delete (globalThis as any).cancelAnimationFrame;
});

describe("ScrollTracker", () => {
  it("does not start automatically on construction", () => {
    new ScrollTracker();
    expect(mockWindow.addEventListener).not.toHaveBeenCalled();
  });

  it("adds scroll listener on start()", () => {
    const tracker = new ScrollTracker();
    tracker.start();
    expect(mockWindow.addEventListener).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
      { passive: true }
    );
    tracker.stop();
  });

  it("removes scroll listener on stop()", () => {
    const tracker = new ScrollTracker();
    tracker.start();
    tracker.stop();
    expect(mockWindow.removeEventListener).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function)
    );
  });

  it("subscribe() returns an unsubscribe function", () => {
    const tracker = new ScrollTracker();
    const callback = vi.fn();
    const unsub = tracker.subscribe(callback);
    expect(typeof unsub).toBe("function");
    tracker.stop();
  });

  it("calls subscriber on start() with initial state", () => {
    const tracker = new ScrollTracker();
    const callback = vi.fn();
    tracker.subscribe(callback);
    tracker.start();

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(
      expect.objectContaining({
        scrollY: expect.any(Number),
        viewportHeight: expect.any(Number),
        scrollHeight: expect.any(Number),
        progress: expect.any(Number),
      })
    );
    tracker.stop();
  });

  it("does not call subscriber after unsubscribe", () => {
    const tracker = new ScrollTracker();
    const callback = vi.fn();
    const unsub = tracker.subscribe(callback);
    unsub();
    tracker.start();

    expect(callback).not.toHaveBeenCalled();
    tracker.stop();
  });

  it("start() is idempotent — calling twice does not double-add listeners", () => {
    const tracker = new ScrollTracker();
    tracker.start();
    tracker.start();
    // scroll + resize listeners added once, second start() is a no-op
    expect(mockWindow.addEventListener).toHaveBeenCalledTimes(2);
    tracker.stop();
  });

  it("stop() is idempotent — calling twice does not error", () => {
    const tracker = new ScrollTracker();
    tracker.start();
    tracker.stop();
    tracker.stop();
    // scroll + resize listeners removed once, second stop() is a no-op
    expect(mockWindow.removeEventListener).toHaveBeenCalledTimes(2);
  });

  it("emits ProgressData with correct shape", () => {
    mockWindow.scrollY = 100;
    mockDocument.documentElement.scrollHeight = 3000;

    const tracker = new ScrollTracker();
    const callback = vi.fn();
    tracker.subscribe(callback);
    tracker.start();

    const data = callback.mock.calls[0][0];
    expect(data).toHaveProperty("scrollY");
    expect(data).toHaveProperty("viewportHeight");
    expect(data).toHaveProperty("scrollHeight");
    expect(data).toHaveProperty("progress");
    expect(typeof data.scrollY).toBe("number");
    expect(typeof data.viewportHeight).toBe("number");
    expect(typeof data.scrollHeight).toBe("number");
    expect(typeof data.progress).toBe("number");
    expect(data.progress).toBeGreaterThanOrEqual(0);
    expect(data.progress).toBeLessThanOrEqual(1);
    tracker.stop();
  });

  describe("resize handling", () => {
    it("adds a resize listener on start()", () => {
      const tracker = new ScrollTracker();
      tracker.start();
      expect(mockWindow.addEventListener).toHaveBeenCalledWith(
        "resize",
        expect.any(Function),
        { passive: true }
      );
      tracker.stop();
    });

    it("removes the resize listener on stop()", () => {
      const tracker = new ScrollTracker();
      tracker.start();
      tracker.stop();
      expect(mockWindow.removeEventListener).toHaveBeenCalledWith(
        "resize",
        expect.any(Function)
      );
    });

    it("re-emits on resize even when scrollY is unchanged (debounced)", async () => {
      vi.useFakeTimers();
      try {
        const tracker = new ScrollTracker();
        const callback = vi.fn();
        tracker.subscribe(callback);
        tracker.start();
        expect(callback).toHaveBeenCalledTimes(1);

        // Grab the resize handler registered with addEventListener
        const resizeCall = mockWindow.addEventListener.mock.calls.find(
          (call) => call[0] === "resize"
        );
        expect(resizeCall).toBeTruthy();
        const resizeHandler = resizeCall![1] as () => void;

        // Simulate a viewport height change (e.g. mobile URL bar) with no
        // scroll position change.
        mockWindow.innerHeight = 600;
        resizeHandler();

        // Should be debounced — not emitted immediately.
        expect(callback).toHaveBeenCalledTimes(1);

        vi.advanceTimersByTime(150);

        expect(callback).toHaveBeenCalledTimes(2);
        const lastCall = callback.mock.calls[1][0];
        expect(lastCall.viewportHeight).toBe(600);

        tracker.stop();
      } finally {
        vi.useRealTimers();
      }
    });

    it("coalesces bursts of resize events into a single emit", () => {
      vi.useFakeTimers();
      try {
        const tracker = new ScrollTracker();
        const callback = vi.fn();
        tracker.subscribe(callback);
        tracker.start();
        expect(callback).toHaveBeenCalledTimes(1);

        const resizeCall = mockWindow.addEventListener.mock.calls.find(
          (call) => call[0] === "resize"
        );
        const resizeHandler = resizeCall![1] as () => void;

        resizeHandler();
        vi.advanceTimersByTime(50);
        resizeHandler();
        vi.advanceTimersByTime(50);
        resizeHandler();
        vi.advanceTimersByTime(150);

        expect(callback).toHaveBeenCalledTimes(2);
        tracker.stop();
      } finally {
        vi.useRealTimers();
      }
    });
  });
});
