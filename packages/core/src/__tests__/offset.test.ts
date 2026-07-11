import { describe, it, expect } from "vitest";
import {
  edgeToFraction,
  parseOffsetEntry,
  resolveOffsetScrollY,
  calcElementProgress,
  DEFAULT_ELEMENT_OFFSET,
} from "../offset";

describe("edgeToFraction", () => {
  it("maps named edges", () => {
    expect(edgeToFraction("start")).toBe(0);
    expect(edgeToFraction("center")).toBe(0.5);
    expect(edgeToFraction("middle")).toBe(0.5);
    expect(edgeToFraction("end")).toBe(1);
  });

  it("passes through numbers", () => {
    expect(edgeToFraction(0.25)).toBe(0.25);
    expect(edgeToFraction(1)).toBe(1);
  });

  it("parses percentages", () => {
    expect(edgeToFraction("50%")).toBe(0.5);
    expect(edgeToFraction("100%")).toBe(1);
  });

  it("parses bare numeric strings", () => {
    expect(edgeToFraction("0.75")).toBe(0.75);
  });

  it("is case-insensitive and trims whitespace", () => {
    expect(edgeToFraction("  END ")).toBe(1);
  });

  it("falls back to 0 for garbage", () => {
    expect(edgeToFraction("nonsense")).toBe(0);
  });
});

describe("parseOffsetEntry", () => {
  it("splits string entries into [element, viewport] fractions", () => {
    expect(parseOffsetEntry("start end")).toEqual([0, 1]);
    expect(parseOffsetEntry("end start")).toEqual([1, 0]);
    expect(parseOffsetEntry("center center")).toEqual([0.5, 0.5]);
  });

  it("maps tuple entries", () => {
    expect(parseOffsetEntry(["start", "center"])).toEqual([0, 0.5]);
    expect(parseOffsetEntry([0.25, 0.75])).toEqual([0.25, 0.75]);
  });

  it("treats a single token as applying to both edges", () => {
    expect(parseOffsetEntry("center")).toEqual([0.5, 0.5]);
  });
});

describe("resolveOffsetScrollY", () => {
  const info = { elementTop: 1000, elementHeight: 500, viewportHeight: 800 };

  it("resolves 'start end' — element top reaches viewport bottom", () => {
    // scrollY = 1000 + 0*500 - 1*800 = 200
    expect(resolveOffsetScrollY("start end", info)).toBe(200);
  });

  it("resolves 'end start' — element bottom reaches viewport top", () => {
    // scrollY = 1000 + 1*500 - 0*800 = 1500
    expect(resolveOffsetScrollY("end start", info)).toBe(1500);
  });

  it("resolves 'start start' — element top reaches viewport top", () => {
    // scrollY = 1000 + 0 - 0 = 1000
    expect(resolveOffsetScrollY("start start", info)).toBe(1000);
  });
});

describe("calcElementProgress", () => {
  const geom = { elementTop: 1000, elementHeight: 500, viewportHeight: 800 };

  it("is 0 before the element enters", () => {
    // 'start end' target = 200; anything below that is 0
    expect(
      calcElementProgress(DEFAULT_ELEMENT_OFFSET, { ...geom, scrollY: 0 })
    ).toBe(0);
    expect(
      calcElementProgress(DEFAULT_ELEMENT_OFFSET, { ...geom, scrollY: 200 })
    ).toBe(0);
  });

  it("is 1 after the element fully passes", () => {
    // 'end start' target = 1500
    expect(
      calcElementProgress(DEFAULT_ELEMENT_OFFSET, { ...geom, scrollY: 1500 })
    ).toBe(1);
    expect(
      calcElementProgress(DEFAULT_ELEMENT_OFFSET, { ...geom, scrollY: 5000 })
    ).toBe(1);
  });

  it("is 0.5 at the midpoint between the two offset targets", () => {
    // midpoint between 200 and 1500 = 850
    expect(
      calcElementProgress(DEFAULT_ELEMENT_OFFSET, { ...geom, scrollY: 850 })
    ).toBeCloseTo(0.5);
  });

  it("interpolates linearly within the range", () => {
    // range is 200..1500 (span 1300); at scrollY 525 → (525-200)/1300 = 0.25
    expect(
      calcElementProgress(DEFAULT_ELEMENT_OFFSET, { ...geom, scrollY: 525 })
    ).toBeCloseTo(0.25);
  });

  it("supports custom offsets", () => {
    // ['start end', 'start center']: targets 200 and (1000 - 0.5*800 = 600)
    const offset = ["start end", "start center"] as const;
    expect(calcElementProgress(offset, { ...geom, scrollY: 200 })).toBe(0);
    expect(calcElementProgress(offset, { ...geom, scrollY: 400 })).toBeCloseTo(
      0.5
    );
    expect(calcElementProgress(offset, { ...geom, scrollY: 600 })).toBe(1);
  });

  it("handles a three-entry offset piecewise", () => {
    // targets: start end = 200, center center = (1000+250-400)=850, end start = 1500
    const offset = ["start end", "center center", "end start"];
    expect(calcElementProgress(offset, { ...geom, scrollY: 200 })).toBe(0);
    // midpoint of first segment maps to 0.25 (half of first half)
    expect(calcElementProgress(offset, { ...geom, scrollY: 525 })).toBeCloseTo(
      0.25
    );
    expect(calcElementProgress(offset, { ...geom, scrollY: 850 })).toBeCloseTo(
      0.5
    );
    expect(calcElementProgress(offset, { ...geom, scrollY: 1500 })).toBe(1);
  });

  it("returns 0 for an empty offset list", () => {
    expect(calcElementProgress([], { ...geom, scrollY: 500 })).toBe(0);
  });

  it("treats a single offset as a threshold", () => {
    // single 'start end' target = 200
    expect(calcElementProgress(["start end"], { ...geom, scrollY: 100 })).toBe(
      0
    );
    expect(calcElementProgress(["start end"], { ...geom, scrollY: 300 })).toBe(
      1
    );
  });
});
