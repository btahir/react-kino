/** Portable, data-only story format. Application components are registered by name. */
export interface StoryTransform {
  x?: number;
  y?: number;
  scale?: number;
  rotate?: number;
  opacity?: number;
}
export interface StoryTrack {
  start: number;
  end: number;
  from: StoryTransform;
  to: StoryTransform;
  easing?: "linear" | "ease-out" | "ease-in-out";
}
export interface StoryLayer {
  id: string;
  kind: "heading" | "text" | "image" | "component";
  content: string;
  alt?: string;
  track?: StoryTrack;
}
export interface StoryScene {
  id: string;
  title: string;
  duration: number;
  layout: "stack" | "split";
  background: string;
  color: string;
  pin: boolean;
  layers: StoryLayer[];
}
export interface StoryDocument {
  version: 1;
  title: string;
  scenes: StoryScene[];
}
export interface StoryDiagnostic {
  path: string;
  code: string;
  message: string;
  severity: "error" | "warning";
}
export interface StoryValidation {
  valid: boolean;
  diagnostics: StoryDiagnostic[];
  document?: StoryDocument;
}
const object = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v);
const text = (v: unknown, max = 10000): v is string =>
  typeof v === "string" && v.length > 0 && v.length <= max;
const id = (v: unknown) => text(v, 80) && /^[a-zA-Z][\w-]*$/.test(v);
const number = (v: unknown, min: number, max: number): v is number =>
  typeof v === "number" && Number.isFinite(v) && v >= min && v <= max;
export function isSafeImageSource(v: string): boolean {
  return (
    /^(https?:\/\/|\/(?!\/)|\.\.?\/)/i.test(v) && !/[\u0000-\u0020\\]/.test(v)
  );
}
export function validateStory(value: unknown): StoryValidation {
  const diagnostics: StoryDiagnostic[] = [];
  const error = (path: string, code: string, message: string) =>
    diagnostics.push({ path, code, message, severity: "error" });
  const keys = (v: Record<string, unknown>, allowed: string[], path: string) =>
    Object.keys(v).forEach((k) => {
      if (!allowed.includes(k))
        error(
          `${path}.${k}`,
          "unknown-field",
          "Unknown field; check the document version.",
        );
    });
  if (!object(value))
    return {
      valid: false,
      diagnostics: [
        {
          path: "$",
          code: "document",
          message: "Expected a story object.",
          severity: "error",
        },
      ],
    };
  keys(value, ["version", "title", "scenes"], "$");
  if (value.version !== 1)
    error("$.version", "version", "Only story version 1 is supported.");
  if (!text(value.title, 200))
    error("$.title", "title", "Provide a title of 1–200 characters.");
  if (
    !Array.isArray(value.scenes) ||
    value.scenes.length < 1 ||
    value.scenes.length > 40
  )
    error("$.scenes", "scenes", "Provide 1–40 scenes.");
  const sceneIds = new Set<string>();
  if (Array.isArray(value.scenes))
    value.scenes.slice(0, 40).forEach((scene, i) => {
      const path = `$.scenes[${i}]`;
      if (!object(scene)) {
        error(path, "scene", "Expected a scene object.");
        return;
      }
      keys(
        scene,
        [
          "id",
          "title",
          "duration",
          "layout",
          "background",
          "color",
          "pin",
          "layers",
        ],
        path,
      );
      if (!id(scene.id) || sceneIds.has(String(scene.id)))
        error(
          `${path}.id`,
          "id",
          "Scene IDs must be unique and start with a letter.",
        );
      sceneIds.add(String(scene.id));
      if (!text(scene.title, 200))
        error(`${path}.title`, "title", "Provide a scene title.");
      if (!number(scene.duration, 100, 1200))
        error(
          `${path}.duration`,
          "duration",
          "Duration must be 100–1200 viewport heights (percent).",
        );
      if (!["stack", "split"].includes(String(scene.layout)))
        error(`${path}.layout`, "layout", "Choose stack or split.");
      for (const key of ["background", "color"])
        if (
          !text(scene[key], 9) ||
          !/^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(String(scene[key]))
        )
          error(
            `${path}.${key}`,
            "color",
            "Use a six or eight digit hex color.",
          );
      if (typeof scene.pin !== "boolean")
        error(`${path}.pin`, "pin", "Pin must be a boolean.");
      if (
        !Array.isArray(scene.layers) ||
        scene.layers.length < 1 ||
        scene.layers.length > 30
      ) {
        error(`${path}.layers`, "layers", "Provide 1–30 layers.");
        return;
      }
      const layerIds = new Set<string>();
      scene.layers.slice(0, 30).forEach((layer, j) => {
        const lp = `${path}.layers[${j}]`;
        if (!object(layer)) {
          error(lp, "layer", "Expected a layer object.");
          return;
        }
        keys(layer, ["id", "kind", "content", "alt", "track"], lp);
        if (!id(layer.id) || layerIds.has(String(layer.id)))
          error(
            `${lp}.id`,
            "id",
            "Layer IDs must be unique within each scene.",
          );
        layerIds.add(String(layer.id));
        if (
          !["heading", "text", "image", "component"].includes(
            String(layer.kind),
          )
        )
          error(`${lp}.kind`, "kind", "Unsupported layer kind.");
        if (!text(layer.content))
          error(
            `${lp}.content`,
            "content",
            "Provide nonempty content up to 10,000 characters.",
          );
        if (
          layer.kind === "image" &&
          typeof layer.content === "string" &&
          !isSafeImageSource(layer.content)
        )
          error(
            `${lp}.content`,
            "image-url",
            "Use an HTTP(S) or relative image URL. Data and script URLs are not allowed.",
          );
        if (layer.kind === "image" && typeof layer.alt !== "string")
          error(
            `${lp}.alt`,
            "alt",
            "Images require alt text (empty for decorative images).",
          );
        if (
          layer.alt !== undefined &&
          (typeof layer.alt !== "string" || layer.alt.length > 1000)
        )
          error(
            `${lp}.alt`,
            "alt",
            "Alt text must be at most 1,000 characters.",
          );
        if (layer.kind === "component" && !id(layer.content))
          error(
            `${lp}.content`,
            "registration",
            "Use a registered component name, not source code.",
          );
        if (layer.track === undefined) return;
        const track = layer.track;
        if (!object(track)) {
          error(`${lp}.track`, "track", "Expected a track object.");
          return;
        }
        keys(track, ["start", "end", "from", "to", "easing"], `${lp}.track`);
        if (
          !number(track.start, 0, 1) ||
          !number(track.end, 0, 1) ||
          Number(track.start) >= Number(track.end)
        )
          error(
            `${lp}.track`,
            "range",
            "Track start must be before end, both between 0 and 1.",
          );
        if (
          track.easing !== undefined &&
          !["linear", "ease-out", "ease-in-out"].includes(String(track.easing))
        )
          error(`${lp}.track.easing`, "easing", "Unsupported easing.");
        for (const side of ["from", "to"]) {
          const transform = track[side];
          if (!object(transform)) {
            error(
              `${lp}.track.${side}`,
              "transform",
              "Expected transform values.",
            );
            continue;
          }
          keys(
            transform,
            ["x", "y", "scale", "rotate", "opacity"],
            `${lp}.track.${side}`,
          );
          for (const [key, val] of Object.entries(transform)) {
            const [min, max] =
              key === "opacity"
                ? [0, 1]
                : key === "scale"
                  ? [0.01, 10]
                  : [-4000, 4000];
            if (!number(val, min, max))
              error(
                `${lp}.track.${side}.${key}`,
                "number",
                `Expected a finite number between ${min} and ${max}.`,
              );
          }
        }
      });
    });
  return {
    valid: diagnostics.length === 0,
    diagnostics,
    ...(diagnostics.length === 0
      ? { document: value as unknown as StoryDocument }
      : {}),
  };
}
export function inspectStory(
  document: StoryDocument,
  registrations?: string[],
): StoryDiagnostic[] {
  const result = validateStory(document);
  if (!result.valid) return result.diagnostics;
  const diagnostics: StoryDiagnostic[] = [];
  document.scenes.forEach((scene, i) => {
    const path = `$.scenes[${i}]`;
    if (scene.pin && scene.duration < 150)
      diagnostics.push({
        path,
        code: "short-pin",
        severity: "warning",
        message:
          "A pinned scene below 150vh has little scroll time. Try 250vh or turn pinning off.",
      });
    scene.layers.forEach((layer, j) => {
      if (
        layer.kind === "component" &&
        registrations &&
        !registrations.includes(layer.content)
      )
        diagnostics.push({
          path: `${path}.layers[${j}]`,
          code: "missing-registration",
          severity: "warning",
          message: `Register ${layer.content} in the renderer.`,
        });
      if (layer.track?.to.opacity === 0)
        diagnostics.push({
          path: `${path}.layers[${j}].track`,
          code: "hidden-final",
          severity: "warning",
          message:
            "Final opacity is zero. The reading/reduced-motion layout makes it visible; check the animated end state.",
        });
    });
  });
  return diagnostics;
}
export function parseStory(json: string): StoryDocument {
  if (json.length > 2_000_000)
    throw new Error("Story exceeds the 2 MB import limit.");
  let value: unknown;
  try {
    value = JSON.parse(json);
  } catch {
    throw new Error(
      "Invalid JSON. Export a story document from Kino Storyboard.",
    );
  }
  const result = validateStory(value);
  if (!result.valid)
    throw new Error(
      result.diagnostics.map((d) => `${d.path}: ${d.message}`).join("\n"),
    );
  return result.document!;
}
export function serializeStory(document: StoryDocument): string {
  const result = validateStory(document);
  if (!result.valid)
    throw new Error(
      result.diagnostics.map((d) => `${d.path}: ${d.message}`).join("\n"),
    );
  return JSON.stringify(document, null, 2) + "\n";
}
export function sampleTrack(
  track: StoryTrack,
  progress: number,
  reading = false,
): Required<StoryTransform> {
  const t = Math.max(
    0,
    Math.min(1, (progress - track.start) / (track.end - track.start)),
  );
  const eased =
    track.easing === "ease-out"
      ? 1 - (1 - t) ** 3
      : track.easing === "ease-in-out"
        ? t * t * (3 - 2 * t)
        : t;
  const defaults = { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 };
  if (reading) return defaults;
  return Object.fromEntries(
    Object.entries(defaults).map(([key, fallback]) => {
      const k = key as keyof StoryTransform;
      const a = track.from[k] ?? fallback;
      const b = track.to[k] ?? fallback;
      return [key, a + (b - a) * eased];
    }),
  ) as Required<StoryTransform>;
}
