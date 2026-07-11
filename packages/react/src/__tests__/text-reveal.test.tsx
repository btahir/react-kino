import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { TextReveal } from "../text-reveal";

// Mock the scene context so TextReveal works outside a Scene
vi.mock("../scene", () => ({
  useSceneContext: vi.fn(() => {
    throw new Error("Not inside Scene");
  }),
  useSceneContextOptional: vi.fn(() => null),
}));

afterEach(() => {
  cleanup();
});

describe("TextReveal", () => {
  it("splits words correctly in word mode", () => {
    render(
      <TextReveal progress={0} mode="word">
        Hello beautiful world
      </TextReveal>
    );
    const tokens = screen.getAllByTestId("text-reveal-token");
    // "Hello", " ", "beautiful", " ", "world" = 5 tokens
    expect(tokens.length).toBe(5);
  });

  it("all text visible when progress=1", () => {
    render(
      <TextReveal progress={1} mode="word" at={0} span={0.8}>
        Hello world
      </TextReveal>
    );
    const tokens = screen.getAllByTestId("text-reveal-token");
    // All non-whitespace tokens should have opacity 1
    const contentTokens = tokens.filter(
      (t) => t.textContent!.trim().length > 0
    );
    contentTokens.forEach((token) => {
      expect(token.style.opacity).toBe("1");
    });
  });

  it("all text dim when progress=0", () => {
    render(
      <TextReveal progress={0} mode="word" at={0.1} span={0.8}>
        Hello world
      </TextReveal>
    );
    const tokens = screen.getAllByTestId("text-reveal-token");
    const contentTokens = tokens.filter(
      (t) => t.textContent!.trim().length > 0
    );
    contentTokens.forEach((token) => {
      expect(token.style.opacity).toBe("0.15");
    });
  });

  it("prefers-reduced-motion shows full text immediately", () => {
    // Mock matchMedia to return reduced motion
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === "(prefers-reduced-motion: reduce)",
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    render(
      <TextReveal progress={0} mode="word">
        Hello world
      </TextReveal>
    );
    const container = screen.getByTestId("text-reveal");
    // With reduced motion, text is rendered as plain text without span tokens
    expect(container.textContent).toBe("Hello world");
    // No opacity styling — content tokens are not individually wrapped
    const tokens = screen.queryAllByTestId("text-reveal-token");
    expect(tokens.length).toBe(0);

    // Restore default matchMedia mock
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
  });

  it("splits characters correctly in char mode", () => {
    render(
      <TextReveal progress={0.5} mode="char">
        Hi
      </TextReveal>
    );
    const tokens = screen.getAllByTestId("text-reveal-token");
    expect(tokens.length).toBe(2);
    expect(tokens[0].textContent).toBe("H");
    expect(tokens[1].textContent).toBe("i");
  });
});
