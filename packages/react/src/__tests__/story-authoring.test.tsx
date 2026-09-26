import React from "react";
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  act,
} from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { Story } from "../story";
import { Storyboard } from "../studio";
import { createStoryRecipe, storyRecipes } from "../recipes";
import { parseStory, validateStory } from "../document";
import { Scene } from "../scene";
import { Reveal } from "../reveal";
import { VideoScroll } from "../video-scroll";
beforeEach(() => {
  localStorage.clear();
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(1000);
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
describe("stories and authoring", () => {
  it.each(storyRecipes)("validates recipe $id", ({ document }) =>
    expect(validateStory(document).valid).toBe(true),
  );
  it("creates independent copies", () => {
    const first = createStoryRecipe();
    first.scenes[0].title = "Changed";
    expect(createStoryRecipe().scenes[0].title).toBe("The idea");
  });
  it("renders readable source on the server without requiring browser globals", () => {
    const html = renderToString(<Story document={createStoryRecipe()} />);
    expect(html).toContain("Less noise. More focus.");
    expect(html).not.toMatch(
      /data-kino-layer="[^"]+" style="[^"]*opacity:0(?:;|")/,
    );
  });
  it("uses trusted named components and makes missing components visible", () => {
    render(
      <Story
        document={createStoryRecipe("comparison")}
        components={{ Before: <button>Real action</button> }}
      />,
    );
    expect(screen.getByRole("button", { name: "Real action" })).toBeTruthy();
    expect(screen.getByText(/Register the “After”/)).toBeTruthy();
  });
  it("rejects an invalid document before rendering layers", () => {
    const document = createStoryRecipe();
    document.version = 2 as 1;
    render(<Story document={document} />);
    expect(screen.getByRole("alert").textContent).toContain("version 1");
  });
  it("reveals late children in a tall scene", () => {
    vi.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockImplementation(
      function (this: HTMLElement) {
        return this.hasAttribute("data-kino-content") ? 1800 : 0;
      },
    );
    const { container } = render(
      <Scene duration="600vh">
        <Reveal at={0.95}>Late essential text</Reveal>
      </Scene>,
    );
    expect((container.firstElementChild as HTMLElement).style.height).toBe(
      "auto",
    );
    expect(screen.getByText("Late essential text").style.opacity).toBe("1");
  });
  it("neutralizes exit opacity in a tall desktop story", () => {
    vi.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockImplementation(
      function (this: HTMLElement) {
        return this.hasAttribute("data-kino-content") ? 1800 : 0;
      },
    );
    const document = createStoryRecipe();
    document.scenes[0].layers[0].track!.to.opacity = 0;
    const { container } = render(<Story document={document} />);
    expect(
      (container.querySelector('[data-kino-layer="headline"]') as HTMLElement)
        .style.opacity,
    ).toBe("1");
  });
  it("falls back visibly when an image fails", () => {
    const document = createStoryRecipe();
    document.scenes[0].layers = [
      {
        id: "photo",
        kind: "image",
        content: "/missing.jpg",
        alt: "A mountain",
      },
    ];
    render(<Story document={document} />);
    fireEvent.error(screen.getByRole("img"));
    expect(screen.getByText(/Image unavailable: A mountain/)).toBeTruthy();
  });
  it("unpins and preserves overlay text when video loading fails", () => {
    const { container } = render(
      <VideoScroll src="/missing.mp4">Essential caption</VideoScroll>,
    );
    fireEvent.error(container.querySelector("video")!);
    expect((container.firstElementChild as HTMLElement).style.height).toBe(
      "auto",
    );
    expect(screen.getByText("Essential caption")).toBeTruthy();
    expect(screen.getByRole("status").textContent).toContain("unavailable");
  });
  it("retries a different video after a media failure", () => {
    const view = render(<VideoScroll src="/bad.mp4" />);
    fireEvent.error(view.container.querySelector("video")!);
    view.rerender(<VideoScroll src="/new.mp4" />);
    expect(view.container.querySelector("video")?.getAttribute("src")).toBe(
      "/new.mp4",
    );
  });
  it("edits content, undoes, redoes, and persists a valid draft", async () => {
    vi.useFakeTimers();
    render(<Storyboard />);
    const input = screen.getByRole("textbox", { name: "Layer content" });
    fireEvent.change(input, { target: { value: "A more useful title" } });
    fireEvent.blur(input);
    expect(
      screen.getByRole("heading", { name: "A more useful title" }),
    ).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Undo" }));
    expect(
      screen.getByRole("heading", { name: "Less noise. More focus." }),
    ).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Redo" }));
    await act(async () => {
      vi.advanceTimersByTime(350);
    });
    expect(
      parseStory(localStorage.getItem("kino-storyboard-v1")!).scenes[0]
        .layers[0].content,
    ).toBe("A more useful title");
    fireEvent.click(screen.getByRole("button", { name: "Clear saved draft" }));
    expect(localStorage.getItem("kino-storyboard-v1")).toBeNull();
    vi.useRealTimers();
  });
  it("requires explicit draft restoration and rejects malformed imports", () => {
    const document = createStoryRecipe();
    document.title = "Saved story";
    localStorage.setItem("kino-storyboard-v1", JSON.stringify(document));
    render(<Storyboard />);
    expect(
      (screen.getByRole("textbox", { name: "Story title" }) as HTMLInputElement)
        .value,
    ).not.toBe("Saved story");
    fireEvent.click(screen.getByRole("button", { name: "Restore draft" }));
    expect(
      (screen.getByRole("textbox", { name: "Story title" }) as HTMLInputElement)
        .value,
    ).toBe("Saved story");
    fireEvent.click(screen.getByText("Import pasted JSON"));
    fireEvent.change(
      screen.getByRole("textbox", { name: "Paste story JSON" }),
      { target: { value: '{"version":9}' } },
    );
    fireEvent.click(screen.getByRole("button", { name: "Load pasted JSON" }));
    expect(screen.getByRole("alert").textContent).toContain("version 1");
    expect(
      (screen.getByRole("textbox", { name: "Story title" }) as HTMLInputElement)
        .value,
    ).toBe("Saved story");
  });
  it("edits timeline using keyboard and respects nonzero ranges", () => {
    render(<Storyboard />);
    const handle = screen.getByRole("slider", { name: "headline start" });
    fireEvent.keyDown(handle, { key: "ArrowRight" });
    expect(
      (
        screen.getByRole("spinbutton", {
          name: "Track start",
        }) as HTMLInputElement
      ).value,
    ).toBe("0.01");
    fireEvent.keyDown(handle, { key: "End" });
    expect(
      Number(
        (
          screen.getByRole("spinbutton", {
            name: "Track start",
          }) as HTMLInputElement
        ).value,
      ),
    ).toBeLessThan(0.35);
  });
});
