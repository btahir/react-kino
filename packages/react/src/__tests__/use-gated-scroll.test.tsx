import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React, { useRef } from "react";
import { render, act, cleanup } from "@testing-library/react";
import { useGatedScroll } from "../hooks/use-gated-scroll";
import type { ProgressData } from "@react-kino/core";

// A controllable IntersectionObserver that does NOT auto-fire, so we can drive
// enter/leave transitions explicitly (overrides the auto-intersecting mock from
// setup.ts for this file).
type IOEntry = { isIntersecting: boolean; target: Element };
let ioInstances: ControllableIO[] = [];
class ControllableIO {
  cb: (entries: IOEntry[], observer: unknown) => void;
  el: Element | null = null;
  constructor(cb: (entries: IOEntry[], observer: unknown) => void) {
    this.cb = cb;
    ioInstances.push(this);
  }
  observe(el: Element) {
    this.el = el;
  }
  unobserve() {}
  disconnect() {}
  enter() {
    this.cb([{ isIntersecting: true, target: this.el! }], this);
  }
  leave() {
    this.cb([{ isIntersecting: false, target: this.el! }], this);
  }
}

let originalIO: typeof IntersectionObserver;

beforeEach(() => {
  ioInstances = [];
  originalIO = global.IntersectionObserver;
  global.IntersectionObserver =
    ControllableIO as unknown as typeof IntersectionObserver;
});

afterEach(() => {
  cleanup();
  global.IntersectionObserver = originalIO;
});

function makeTracker() {
  let subscriber: ((d: ProgressData) => void) | null = null;
  const unsub = vi.fn();
  const tracker = {
    subscribe: vi.fn((cb: (d: ProgressData) => void) => {
      subscriber = cb;
      return unsub;
    }),
    start: vi.fn(),
    stop: vi.fn(),
  };
  return {
    tracker,
    unsub,
    emit: (d: Partial<ProgressData>) =>
      subscriber?.({
        scrollY: 0,
        viewportHeight: 800,
        scrollHeight: 3000,
        progress: 0,
        ...d,
      }),
    hasSubscriber: () => subscriber !== null,
  };
}

function Harness({
  tracker,
  compute,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tracker: any;
  compute: (d: ProgressData) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useGatedScroll({
    ref,
    tracker,
    isOwned: true,
    enabled: true,
    compute,
    deps: [],
  });
  return <div ref={ref} data-testid="el" />;
}

describe("useGatedScroll", () => {
  it("does not subscribe until the element intersects", () => {
    const { tracker } = makeTracker();
    const compute = vi.fn();

    render(<Harness tracker={tracker} compute={compute} />);

    // Owned tracker is started, but no subscription/compute before intersecting.
    expect(tracker.start).toHaveBeenCalled();
    expect(tracker.subscribe).not.toHaveBeenCalled();
    expect(compute).not.toHaveBeenCalled();
  });

  it("subscribes and syncs immediately on enter", () => {
    const { tracker, emit } = makeTracker();
    const compute = vi.fn();

    render(<Harness tracker={tracker} compute={compute} />);

    act(() => ioInstances[0].enter());

    expect(tracker.subscribe).toHaveBeenCalledTimes(1);
    // syncNow fires exactly one immediate compute from the live window position.
    expect(compute).toHaveBeenCalledTimes(1);

    // Subsequent scroll ticks flow through.
    act(() => emit({ scrollY: 200 }));
    expect(compute).toHaveBeenCalledTimes(2);
    expect(compute.mock.calls[1][0].scrollY).toBe(200);
  });

  it("unsubscribes and does one final exact sync on leave", () => {
    const { tracker, unsub } = makeTracker();
    const compute = vi.fn();

    render(<Harness tracker={tracker} compute={compute} />);

    act(() => ioInstances[0].enter());
    compute.mockClear();

    act(() => ioInstances[0].leave());

    expect(unsub).toHaveBeenCalledTimes(1);
    // One final synchronous compute so the value snaps to its exact boundary.
    expect(compute).toHaveBeenCalledTimes(1);
  });

  it("re-subscribes with an exact fresh sync on re-entry (not stale)", () => {
    const { tracker, emit } = makeTracker();
    const seen: number[] = [];
    const compute = vi.fn((d: ProgressData) => seen.push(d.scrollY));

    render(<Harness tracker={tracker} compute={compute} />);

    act(() => ioInstances[0].enter());
    act(() => emit({ scrollY: 500 }));
    act(() => ioInstances[0].leave());
    act(() => ioInstances[0].enter());

    // On re-entry the immediate sync reads the live window (scrollY 0 in jsdom),
    // proving the value is recomputed fresh rather than left at the stale 500.
    expect(seen[seen.length - 1]).toBe(0);
    expect(tracker.subscribe).toHaveBeenCalledTimes(2);
  });

  it("syncs to the correct value even when the element mounts already out of view", () => {
    // Real IntersectionObserver invokes its callback once immediately after
    // observe(), reporting the element's CURRENT intersection state — it does
    // not wait for a transition. If a page loads mid-scroll (or restores
    // scroll position, or a <Scene> mounts already scrolled past), that first
    // callback can report `isIntersecting: false` without ever having fired
    // `true`. Regression test for the bug where `deactivate()` no-op'd when
    // there was no prior subscription, leaving the value frozen at its
    // construction-time default (0) forever, since a never-activated element
    // never receives a scroll tick.
    const { tracker } = makeTracker();
    const compute = vi.fn();

    render(<Harness tracker={tracker} compute={compute} />);

    // Simulate the real IO firing its first (and only, since nothing crosses
    // the threshold afterwards) callback with isIntersecting: false — the
    // element was already fully scrolled past when it mounted.
    act(() => ioInstances[0].leave());

    // Never subscribed for continuous ticks (off-screen stays free of
    // per-frame work)...
    expect(tracker.subscribe).not.toHaveBeenCalled();
    // ...but the value was still synced once from the live window position,
    // so it reflects reality instead of being stuck at the default.
    expect(compute).toHaveBeenCalledTimes(1);
  });

  it("does nothing when disabled", () => {
    const { tracker } = makeTracker();
    const compute = vi.fn();

    function DisabledHarness() {
      const ref = useRef<HTMLDivElement>(null);
      useGatedScroll({
        ref,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        tracker: tracker as any,
        isOwned: true,
        enabled: false,
        compute,
        deps: [],
      });
      return <div ref={ref} />;
    }

    render(<DisabledHarness />);
    act(() => ioInstances[0]?.enter());

    expect(tracker.subscribe).not.toHaveBeenCalled();
    expect(compute).not.toHaveBeenCalled();
  });
});
