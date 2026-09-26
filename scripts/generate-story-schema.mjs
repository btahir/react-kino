import fs from "node:fs";
const string = (maxLength) => ({ type: "string", minLength: 1, maxLength });
const id = { ...string(80), pattern: "^[a-zA-Z][\\w-]*$" };
const bounded = (minimum, maximum) => ({ type: "number", minimum, maximum });
const object = (properties, required) => ({
  type: "object",
  additionalProperties: false,
  properties,
  required,
});
const transform = object(
  {
    x: bounded(-4000, 4000),
    y: bounded(-4000, 4000),
    rotate: bounded(-4000, 4000),
    scale: bounded(0.01, 10),
    opacity: bounded(0, 1),
  },
  [],
);
const track = object(
  {
    start: bounded(0, 1),
    end: bounded(0, 1),
    from: transform,
    to: transform,
    easing: { enum: ["linear", "ease-out", "ease-in-out"] },
  },
  ["start", "end", "from", "to"],
);
const layer = object(
  {
    id,
    kind: { enum: ["heading", "text", "image", "component"] },
    content: string(10000),
    alt: { type: "string", maxLength: 1000 },
    track,
  },
  ["id", "kind", "content"],
);
layer.allOf = [
  {
    if: { properties: { kind: { const: "image" } } },
    then: {
      required: ["alt"],
      properties: {
        content: {
          pattern: "^(https?://|/(?!/)|\\.\\.?/)[^\\u0000-\\u0020\\\\]*$",
        },
      },
    },
  },
  {
    if: { properties: { kind: { const: "component" } } },
    then: { properties: { content: id } },
  },
];
const scene = object(
  {
    id,
    title: string(200),
    duration: bounded(100, 1200),
    layout: { enum: ["stack", "split"] },
    background: {
      type: "string",
      pattern: "^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$",
    },
    color: { type: "string", pattern: "^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$" },
    pin: { type: "boolean" },
    layers: { type: "array", minItems: 1, maxItems: 30, items: layer },
  },
  ["id", "title", "duration", "layout", "background", "color", "pin", "layers"],
);
const schema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://www.react-kino.dev/schema/story-v1.json",
  title: "Kino story document v1",
  description:
    "Use validateStory for additional unique-ID and start-before-end checks.",
  ...object(
    {
      version: { const: 1 },
      title: string(200),
      scenes: { type: "array", minItems: 1, maxItems: 40, items: scene },
    },
    ["version", "title", "scenes"],
  ),
};
fs.writeFileSync(
  "packages/react/schema/story-v1.json",
  JSON.stringify(schema, null, 2) + "\n",
);
fs.mkdirSync("apps/docs/public/schema", { recursive: true });
fs.copyFileSync(
  "packages/react/schema/story-v1.json",
  "apps/docs/public/schema/story-v1.json",
);
