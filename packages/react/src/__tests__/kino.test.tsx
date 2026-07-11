import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { Kino, useKino, useKinoOptional } from "../kino";

afterEach(() => {
  cleanup();
});

let constructorCalls = 0;

vi.mock("@react-kino/core", () => ({
  ScrollTracker: class MockScrollTracker {
    constructor() {
      constructorCalls++;
    }
    subscribe = vi.fn(() => vi.fn());
    start = vi.fn();
    stop = vi.fn();
  },
}));

describe("Kino", () => {
  it("renders children", () => {
    render(
      <Kino>
        <div data-testid="child">Hello</div>
      </Kino>
    );
    expect(screen.getByTestId("child")).toBeTruthy();
    expect(screen.getByText("Hello")).toBeTruthy();
  });

  it("provides context with a tracker via useKino", () => {
    function Consumer() {
      const { tracker } = useKino();
      return <div data-testid="tracker">{tracker ? "has-tracker" : "none"}</div>;
    }

    render(
      <Kino>
        <Consumer />
      </Kino>
    );
    expect(screen.getByTestId("tracker").textContent).toBe("has-tracker");
  });

  it("useKino throws outside of Kino provider", () => {
    function BadConsumer() {
      useKino();
      return <div>Should not render</div>;
    }

    expect(() => render(<BadConsumer />)).toThrow("<Kino> provider is required");
  });

  it("useKinoOptional returns null outside of Kino provider", () => {
    function Consumer() {
      const ctx = useKinoOptional();
      return <div data-testid="ctx">{ctx === null ? "null" : "has-value"}</div>;
    }

    render(<Consumer />);
    expect(screen.getByTestId("ctx").textContent).toBe("null");
  });

  it("useKinoOptional returns the context value inside a Kino provider", () => {
    function Consumer() {
      const ctx = useKinoOptional();
      return <div data-testid="ctx">{ctx ? "has-value" : "null"}</div>;
    }

    render(
      <Kino>
        <Consumer />
      </Kino>
    );
    expect(screen.getByTestId("ctx").textContent).toBe("has-value");
  });

  it("lazily creates exactly one ScrollTracker instance, not one per render", () => {
    constructorCalls = 0;
    const { rerender } = render(
      <Kino>
        <div>child</div>
      </Kino>
    );
    rerender(
      <Kino>
        <div>child again</div>
      </Kino>
    );
    rerender(
      <Kino>
        <div>child once more</div>
      </Kino>
    );

    expect(constructorCalls).toBe(1);
  });
});
