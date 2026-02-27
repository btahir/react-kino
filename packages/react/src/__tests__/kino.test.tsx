import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { Kino, useKino } from "../kino";

vi.mock("@kino/core", () => ({
  ScrollTracker: class MockScrollTracker {
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
});
