import { describe, it, expect, vi, afterEach } from "vitest";
import { calcSceneProgress, parseDuration, isSceneActive } from "../pin-engine";

describe("calcSceneProgress", () => {
  it("returns 0 before the scene", () => {
    expect(calcSceneProgress(0, 500, 1000)).toBe(0);
    expect(calcSceneProgress(200, 500, 1000)).toBe(0);
  });

  it("returns 1 after the scene", () => {
    expect(calcSceneProgress(2000, 500, 1000)).toBe(1);
  });

  it("returns 0 at exact start", () => {
    expect(calcSceneProgress(500, 500, 1000)).toBe(0);
  });

  it("returns 1 at exact end", () => {
    expect(calcSceneProgress(1500, 500, 1000)).toBe(1);
  });

  it("returns correct fractional value mid-scene", () => {
    expect(calcSceneProgress(1000, 500, 1000)).toBe(0.5);
    expect(calcSceneProgress(750, 500, 1000)).toBe(0.25);
  });

  it("returns 0 when duration is 0", () => {
    expect(calcSceneProgress(500, 500, 0)).toBe(0);
    expect(calcSceneProgress(1000, 500, 0)).toBe(0);
  });

  it("returns 0 when duration is negative", () => {
    expect(calcSceneProgress(500, 500, -100)).toBe(0);
  });
});

describe("parseDuration", () => {
  it("parses 'vh' units", () => {
    expect(parseDuration("200vh", 800)).toBe(1600);
    expect(parseDuration("100vh", 600)).toBe(600);
    expect(parseDuration("50vh", 1000)).toBe(500);
  });

  it("parses 'px' units", () => {
    expect(parseDuration("1500px", 800)).toBe(1500);
    expect(parseDuration("0px", 800)).toBe(0);
  });

  it("treats bare numbers as vh", () => {
    expect(parseDuration("200", 800)).toBe(1600);
    expect(parseDuration("100", 600)).toBe(600);
  });

  it("handles whitespace", () => {
    expect(parseDuration("  200vh  ", 800)).toBe(1600);
    expect(parseDuration(" 1500px ", 800)).toBe(1500);
  });

  it("returns 0 for unparseable strings", () => {
    expect(parseDuration("abc", 800)).toBe(0);
    expect(parseDuration("", 800)).toBe(0);
  });

  it("handles decimal values", () => {
    expect(parseDuration("2.5vh", 1000)).toBe(25);
    expect(parseDuration("150.5px", 800)).toBe(150.5);
  });

  describe("dev warning on invalid input", () => {
    afterEach(() => {
      vi.unstubAllEnvs();
      vi.restoreAllMocks();
    });

    it("warns in development when duration is unparseable", () => {
      vi.stubEnv("NODE_ENV", "development");
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      expect(parseDuration("abc", 800)).toBe(0);

      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(warnSpy.mock.calls[0][0]).toContain("parseDuration");
    });

    it("does not warn in production when duration is unparseable", () => {
      vi.stubEnv("NODE_ENV", "production");
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      expect(parseDuration("abc", 800)).toBe(0);

      expect(warnSpy).not.toHaveBeenCalled();
    });

    it("does not warn for valid input", () => {
      vi.stubEnv("NODE_ENV", "development");
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      expect(parseDuration("200vh", 800)).toBe(1600);

      expect(warnSpy).not.toHaveBeenCalled();
    });
  });
});

describe("isSceneActive", () => {
  it("returns false before the scene", () => {
    expect(isSceneActive(0, 500, 1000)).toBe(false);
    expect(isSceneActive(499, 500, 1000)).toBe(false);
  });

  it("returns true during the scene", () => {
    expect(isSceneActive(500, 500, 1000)).toBe(true);
    expect(isSceneActive(1000, 500, 1000)).toBe(true);
    expect(isSceneActive(1500, 500, 1000)).toBe(true);
  });

  it("returns false after the scene", () => {
    expect(isSceneActive(1501, 500, 1000)).toBe(false);
    expect(isSceneActive(2000, 500, 1000)).toBe(false);
  });
});
