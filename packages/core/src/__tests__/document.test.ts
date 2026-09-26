import { describe, it, expect } from "vitest";
import {
  validateStory,
  parseStory,
  serializeStory,
  inspectStory,
  sampleTrack,
  type StoryDocument,
} from "../document";
const fixture = (): StoryDocument => ({
  version: 1,
  title: "A real story",
  scenes: [
    {
      id: "one",
      title: "Opening",
      duration: 250,
      layout: "stack",
      background: "#112233",
      color: "#ffffff",
      pin: true,
      layers: [
        {
          id: "title",
          kind: "heading",
          content: "Hello",
          track: {
            start: 0.2,
            end: 0.8,
            from: { y: 100, opacity: 0 },
            to: { y: 0, opacity: 1 },
          },
        },
      ],
    },
  ],
});
describe("portable story contract", () => {
  it("round-trips without changing source or semantics", () => {
    const story = fixture();
    const before = JSON.stringify(story);
    expect(parseStory(serializeStory(story))).toEqual(story);
    expect(JSON.stringify(story)).toBe(before);
  });
  it.each([null, [], {}, { version: 2 }])(
    "rejects incomplete or unsupported documents %j",
    (value) => expect(validateStory(value).valid).toBe(false),
  );
  it.each([NaN, Infinity, -1, 0, 1300])(
    "rejects invalid durations %s",
    (value) => {
      const story = fixture();
      story.scenes[0].duration = value;
      expect(
        validateStory(story).diagnostics.some((d) => d.code === "duration"),
      ).toBe(true);
    },
  );
  it("rejects reversed and zero length tracks", () => {
    const story = fixture();
    story.scenes[0].layers[0].track!.end = 0.2;
    expect(validateStory(story).valid).toBe(false);
  });
  it("rejects duplicate scenes and layers", () => {
    const story = fixture();
    story.scenes.push(story.scenes[0]);
    story.scenes[0].layers.push(story.scenes[0].layers[0]);
    expect(
      validateStory(story).diagnostics.filter((d) => d.code === "id"),
    ).toHaveLength(3);
  });
  it("rejects unrecognized fields instead of silently discarding authoring work", () => {
    const story = { ...fixture(), secretScript: "alert(1)" };
    expect(validateStory(story).diagnostics[0].code).toBe("unknown-field");
  });
  it.each([
    "javascript:alert(1)",
    "data:image/svg+xml,anything",
    "//untrusted.test/a",
    "https://ok.test/a\nb",
    "https://ok.test\\bad",
  ])("rejects unsafe image URL %s", (source) => {
    const story = fixture();
    story.scenes[0].layers = [
      { id: "image", kind: "image", content: source, alt: "Example" },
    ];
    expect(validateStory(story).valid).toBe(false);
  });
  it.each([
    "/images/photo.jpg",
    "./photo.jpg",
    "../photo.jpg",
    "https://example.com/photo.jpg",
  ])("accepts explicit image source %s", (source) => {
    const story = fixture();
    story.scenes[0].layers = [
      { id: "image", kind: "image", content: source, alt: "Example" },
    ];
    expect(validateStory(story).valid).toBe(true);
  });
  it("requires explicit alt text and restricts registration names", () => {
    const story = fixture();
    story.scenes[0].layers = [
      { id: "media", kind: "image", content: "/photo.jpg" },
    ];
    expect(validateStory(story).valid).toBe(false);
    story.scenes[0].layers = [
      { id: "component", kind: "component", content: "<script>" },
    ];
    expect(validateStory(story).valid).toBe(false);
  });
  it("bounds import size and malformed JSON", () => {
    expect(() => parseStory(" ".repeat(2_000_001))).toThrow("2 MB");
    expect(() => parseStory("[bad")).toThrow("Invalid JSON");
  });
  it("reports missing registrations and invisible final tracks", () => {
    const story = fixture();
    story.scenes[0].layers[0].track!.to.opacity = 0;
    story.scenes[0].layers.push({
      id: "widget",
      kind: "component",
      content: "Chart",
    });
    expect(inspectStory(story, []).map((d) => d.code)).toEqual([
      "hidden-final",
      "missing-registration",
    ]);
  });
  it("samples, clamps and neutralizes transforms for readable fallback", () => {
    const track = fixture().scenes[0].layers[0].track!;
    expect(sampleTrack(track, 0).y).toBe(100);
    expect(sampleTrack(track, 0.5).y).toBeCloseTo(50);
    expect(sampleTrack(track, 1).opacity).toBe(1);
    expect(sampleTrack(track, 0, true)).toEqual({
      x: 0,
      y: 0,
      scale: 1,
      rotate: 0,
      opacity: 1,
    });
  });
});
