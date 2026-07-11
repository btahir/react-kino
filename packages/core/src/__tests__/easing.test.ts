import { describe, it, expect } from "vitest";
import {
  linear,
  easeIn,
  easeOut,
  easeInOut,
  easeInCubic,
  easeOutCubic,
  easeInOutCubic,
  easeInQuart,
  easeOutQuart,
  easeInOutQuart,
  EASINGS,
  type EasingName,
} from "../easing";

const easingFns = [
  { name: "linear", fn: linear },
  { name: "easeIn", fn: easeIn },
  { name: "easeOut", fn: easeOut },
  { name: "easeInOut", fn: easeInOut },
  { name: "easeInCubic", fn: easeInCubic },
  { name: "easeOutCubic", fn: easeOutCubic },
  { name: "easeInOutCubic", fn: easeInOutCubic },
  { name: "easeInQuart", fn: easeInQuart },
  { name: "easeOutQuart", fn: easeOutQuart },
  { name: "easeInOutQuart", fn: easeInOutQuart },
];

describe("easing functions", () => {
  for (const { name, fn } of easingFns) {
    describe(name, () => {
      it("returns 0 at t=0", () => {
        expect(fn(0)).toBe(0);
      });

      it("returns 1 at t=1", () => {
        expect(fn(1)).toBe(1);
      });

      it("returns a value between 0 and 1 at t=0.5", () => {
        const result = fn(0.5);
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThanOrEqual(1);
      });

      it("is monotonically increasing across [0,1]", () => {
        const steps = 10;
        let prev = fn(0);
        for (let i = 1; i <= steps; i++) {
          const t = i / steps;
          const curr = fn(t);
          expect(curr).toBeGreaterThanOrEqual(prev);
          prev = curr;
        }
      });
    });
  }
});

describe("EASINGS lookup", () => {
  it("contains all expected keys", () => {
    const expectedKeys: EasingName[] = [
      "linear",
      "ease-in",
      "ease-out",
      "ease-in-out",
      "ease-in-cubic",
      "ease-out-cubic",
      "ease-in-out-cubic",
      "ease-in-quart",
      "ease-out-quart",
      "ease-in-out-quart",
    ];
    for (const key of expectedKeys) {
      expect(EASINGS).toHaveProperty(key);
      expect(typeof EASINGS[key]).toBe("function");
    }
  });

  it("has no extra keys", () => {
    expect(Object.keys(EASINGS)).toHaveLength(10);
  });

  it("EasingName is a valid key of EASINGS for every entry (type-level check)", () => {
    // This is primarily a compile-time assertion: if EasingName drifts from
    // the actual EASINGS keys, this file fails `pnpm typecheck`.
    const names: EasingName[] = [
      "linear",
      "ease-in",
      "ease-out",
      "ease-in-out",
      "ease-in-cubic",
      "ease-out-cubic",
      "ease-in-out-cubic",
      "ease-in-quart",
      "ease-out-quart",
      "ease-in-out-quart",
    ];
    for (const name of names) {
      expect(typeof EASINGS[name]).toBe("function");
    }
  });
});
