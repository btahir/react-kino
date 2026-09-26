"use client";
import React, {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { Kino } from "./kino";
import { Scene, useSceneProgressValue, useSceneReading } from "./scene";
import { usePrefersReducedMotion } from "./hooks/use-prefers-reduced-motion";
import {
  sampleTrack,
  validateStory,
  type StoryDocument,
  type StoryLayer,
} from "./document";

export interface StoryProps {
  document: StoryDocument;
  /** Trusted application components. Imported documents can reference these names only. */
  components?: Record<string, ReactNode>;
  root?: RefObject<HTMLElement | null>;
  /** Authoring control. Omit for real scroll playback. */
  progress?: number;
  sceneId?: string;
  reading?: boolean;
  className?: string;
}
function StoryImage({ src, alt }: { src: string; alt: string }) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  useEffect(() => {
    const image = imageRef.current;
    setStatus(
      image?.complete
        ? image.naturalWidth > 0
          ? "ready"
          : "error"
        : "loading",
    );
  }, [src]);
  return (
    <figure style={{ margin: 0 }}>
      {status !== "error" && (
        <img
          key={src}
          ref={imageRef}
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setStatus("ready")}
          onError={() => setStatus("error")}
          style={{
            display: "block",
            width: "100%",
            maxHeight: "48vh",
            objectFit: "contain",
            borderRadius: 16,
          }}
        />
      )}
      {status === "error" && (
        <div
          role="status"
          style={{
            padding: 24,
            border: "1px dashed currentColor",
            borderRadius: 12,
          }}
        >
          Image unavailable{alt ? `: ${alt}` : "."}{" "}
          <small style={{ display: "block" }}>
            Check the asset URL and host permissions.
          </small>
        </div>
      )}
    </figure>
  );
}
function Layer({
  layer,
  components,
  reading,
}: {
  layer: StoryLayer;
  components: Record<string, ReactNode>;
  reading: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const sceneReading = useSceneReading();
  const value = useSceneProgressValue();
  useEffect(() => {
    const render = (progress: number) => {
      if (!ref.current) return;
      const state = layer.track
        ? sampleTrack(layer.track, progress, reading || sceneReading)
        : { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 };
      ref.current.style.transform = `translate(${state.x}px, ${state.y}px) scale(${state.scale}) rotate(${state.rotate}deg)`;
      ref.current.style.opacity = String(state.opacity);
    };
    render(value.get());
    return value.on(render);
  }, [value, layer.track, reading, sceneReading]);
  const content =
    layer.kind === "heading" ? (
      <h2
        style={{
          fontSize: "clamp(2rem, 7cqw, 4.8rem)",
          lineHeight: 1.05,
          letterSpacing: "-.045em",
          margin: 0,
          overflowWrap: "anywhere",
        }}
      >
        {layer.content}
      </h2>
    ) : layer.kind === "text" ? (
      <p
        style={{
          fontSize: "clamp(1.05rem, 2cqw, 1.4rem)",
          lineHeight: 1.65,
          margin: 0,
          maxWidth: "58ch",
          whiteSpace: "pre-wrap",
          overflowWrap: "anywhere",
        }}
      >
        {layer.content}
      </p>
    ) : layer.kind === "image" ? (
      <StoryImage src={layer.content} alt={layer.alt ?? ""} />
    ) : Object.prototype.hasOwnProperty.call(components, layer.content) ? (
      components[layer.content]
    ) : (
      <p role="status">
        Register the “{layer.content}” component to show this layer.
      </p>
    );
  return (
    <div ref={ref} data-kino-layer={layer.id} style={{ minWidth: 0 }}>
      {content}
    </div>
  );
}
const EMPTY: Record<string, ReactNode> = {};
export function Story({
  document,
  components = EMPTY,
  root,
  progress,
  sceneId,
  reading = false,
  className,
}: StoryProps) {
  const host = useRef<HTMLDivElement>(null);
  const [narrow, setNarrow] = useState(false);
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const measure = () => setNarrow(element.clientWidth < 640);
    measure();
    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(measure);
    observer?.observe(element);
    return () => observer?.disconnect();
  }, []);
  const result = validateStory(document);
  if (!result.valid)
    return (
      <div role="alert">
        Cannot render story: {result.diagnostics[0]?.message}
      </div>
    );
  const scenes = sceneId
    ? document.scenes.filter((s) => s.id === sceneId)
    : document.scenes;
  const readable = reading || reduced || narrow;
  return (
    <div
      ref={host}
      className={className}
      style={{ containerType: "inline-size" }}
      data-kino-story
      aria-label={document.title}
    >
      <Kino root={root}>
        {scenes.map((scene, index) => (
          <section
            key={scene.id}
            aria-label={scene.title}
            data-kino-scene={scene.id}
            style={{ background: scene.background, color: scene.color }}
          >
            <Scene
              duration={`${scene.duration}vh`}
              pin={scene.pin && !readable}
              progress={readable ? 1 : progress}
            >
              <div
                style={{
                  boxSizing: "border-box",
                  minHeight:
                    readable || progress !== undefined
                      ? "auto"
                      : "var(--kino-viewport, 100svh)",
                  padding: "clamp(24px, 6cqw, 64px)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: 28,
                }}
              >
                <span
                  style={{
                    font: "600 11px/1.5 ui-monospace, monospace",
                    textTransform: "uppercase",
                    letterSpacing: ".16em",
                    opacity: 0.7,
                  }}
                >
                  {String(index + 1).padStart(2, "0")} / {scene.title}
                </span>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      scene.layout === "split" && !narrow
                        ? "repeat(2, minmax(0, 1fr))"
                        : "minmax(0, 1fr)",
                    gap: "clamp(20px, 4cqw, 48px)",
                    alignItems: "center",
                    maxWidth: 1200,
                    width: "100%",
                    marginInline: "auto",
                  }}
                >
                  {scene.layers.map((layer) => (
                    <Layer
                      key={layer.id}
                      layer={layer}
                      components={components}
                      reading={readable}
                    />
                  ))}
                </div>
              </div>
            </Scene>
          </section>
        ))}
      </Kino>
    </div>
  );
}
