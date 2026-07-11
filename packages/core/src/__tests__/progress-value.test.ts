import { describe, it, expect, vi } from "vitest";
import { ProgressValue } from "../progress-value";

describe("ProgressValue", () => {
  it("returns the initial value", () => {
    expect(new ProgressValue().get()).toBe(0);
    expect(new ProgressValue(0.42).get()).toBe(0.42);
  });

  it("updates the value with set()", () => {
    const pv = new ProgressValue();
    pv.set(0.5);
    expect(pv.get()).toBe(0.5);
  });

  it("notifies subscribers on change", () => {
    const pv = new ProgressValue();
    const fn = vi.fn();
    pv.on(fn);
    pv.set(0.25);
    pv.set(0.75);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenNthCalledWith(1, 0.25);
    expect(fn).toHaveBeenNthCalledWith(2, 0.75);
  });

  it("does NOT notify when the value is unchanged (no-op set)", () => {
    const pv = new ProgressValue(0.3);
    const fn = vi.fn();
    pv.on(fn);
    pv.set(0.3); // same value
    expect(fn).not.toHaveBeenCalled();
    expect(pv.get()).toBe(0.3);
  });

  it("does not call subscribers immediately on subscribe", () => {
    const pv = new ProgressValue(0.9);
    const fn = vi.fn();
    pv.on(fn);
    expect(fn).not.toHaveBeenCalled();
  });

  it("stops notifying after unsubscribe", () => {
    const pv = new ProgressValue();
    const fn = vi.fn();
    const unsub = pv.on(fn);
    pv.set(0.1);
    unsub();
    pv.set(0.2);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(0.1);
  });

  it("supports multiple subscribers", () => {
    const pv = new ProgressValue();
    const a = vi.fn();
    const b = vi.fn();
    pv.on(a);
    pv.on(b);
    pv.set(0.5);
    expect(a).toHaveBeenCalledWith(0.5);
    expect(b).toHaveBeenCalledWith(0.5);
  });

  it("tracks listenerCount", () => {
    const pv = new ProgressValue();
    expect(pv.listenerCount).toBe(0);
    const unsub = pv.on(() => {});
    expect(pv.listenerCount).toBe(1);
    unsub();
    expect(pv.listenerCount).toBe(0);
  });

  it("does not skip siblings when a listener unsubscribes during notify", () => {
    const pv = new ProgressValue();
    const order: string[] = [];
    let unsubB: () => void;
    pv.on(() => {
      order.push("a");
      unsubB();
    });
    unsubB = pv.on(() => {
      order.push("b");
    });
    pv.set(1);
    expect(order).toEqual(["a", "b"]);
  });
});
