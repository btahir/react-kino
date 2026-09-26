"use client";
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createRecipeComponents } from "./recipe-kit";
import { Story } from "./story";
import { createStoryRecipe, storyRecipes } from "./recipes";
import {
  inspectStory,
  parseStory,
  serializeStory,
  type StoryDocument,
  type StoryLayer,
  type StoryScene,
  type StoryTrack,
} from "./document";
import { studioStyles } from "./studio-styles";
export interface StoryboardProps {
  initialDocument?: StoryDocument;
  components?: Record<string, ReactNode>;
  storageKey?: string;
  onChange?: (document: StoryDocument) => void;
}
const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));
const unique = (prefix: string, values: string[]) => {
  let n = 1;
  while (values.includes(`${prefix}-${n}`)) n++;
  return `${prefix}-${n}`;
};
const defaultTrack = (): StoryTrack => ({
  start: 0,
  end: 0.6,
  from: { y: 40, opacity: 0.15 },
  to: { y: 0, opacity: 1 },
  easing: "ease-out",
});
const DEFAULT_COMPONENTS: Record<string, ReactNode> = createRecipeComponents();
const EMPTY: Record<string, ReactNode> = {};
export function Storyboard({
  initialDocument,
  components: suppliedComponents = EMPTY,
  storageKey = "kino-storyboard-v1",
  onChange,
}: StoryboardProps) {
  const components = useMemo(
    () => ({ ...DEFAULT_COMPONENTS, ...suppliedComponents }),
    [suppliedComponents],
  );
  const [history, setHistory] = useState<StoryDocument[]>(() => [
    initialDocument
      ? parseStory(serializeStory(initialDocument))
      : createStoryRecipe(),
  ]);
  const [cursor, setCursor] = useState(0);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [layerIndex, setLayerIndex] = useState(0);
  const [drag, setDrag] = useState<{
    index: number;
    side: "start" | "end";
    value: number;
  } | null>(null);
  const dragRef = useRef<{
    index: number;
    side: "start" | "end";
    value: number;
  } | null>(null);
  const [progress, setProgress] = useState(0.65);
  const [mode, setMode] = useState<"scrub" | "scroll">("scrub");
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [reading, setReading] = useState(false);
  const [draft, setDraft] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [importText, setImportText] = useState("");
  const preview = useRef<HTMLDivElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const document = history[cursor];
  const si = Math.min(sceneIndex, document.scenes.length - 1);
  const scene = document.scenes[si];
  const li = Math.min(layerIndex, scene.layers.length - 1);
  const layer = scene.layers[li];
  const diagnostics = inspectStory(document, Object.keys(components));
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        parseStory(saved);
        setDraft(saved);
      }
    } catch {
      setError(
        "The saved draft could not be read. Your current story is unchanged.",
      );
    }
  }, [storageKey]);
  useEffect(() => {
    if (!dirty) return;
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(storageKey, serializeStory(document));
        setMessage("Draft saved on this device.");
      } catch {
        setError(
          "Local storage is unavailable or full. Export JSON to keep your work.",
        );
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [document, storageKey, dirty]);
  function commit(next: StoryDocument) {
    const checked = parseStory(serializeStory(next));
    const states = [...history.slice(0, cursor + 1), checked].slice(-80);
    setHistory(states);
    setCursor(states.length - 1);
    setDirty(true);
    setError("");
    onChange?.(checked);
  }
  function edit(change: (next: StoryDocument) => void) {
    const next = clone(document);
    change(next);
    commit(next);
  }
  function editScene(change: Partial<StoryScene>) {
    edit((next) => Object.assign(next.scenes[si], change));
  }
  function editLayer(change: Partial<StoryLayer>) {
    edit((next) => Object.assign(next.scenes[si].layers[li], change));
  }
  function editTrack(change: Partial<StoryTrack>) {
    editLayer({ track: { ...(layer.track ?? defaultTrack()), ...change } });
  }
  function navigateHistory(next: number) {
    setCursor(next);
    setDirty(true);
    onChange?.(history[next]);
  }
  function load(text: string) {
    try {
      commit(parseStory(text));
      setSceneIndex(0);
      setLayerIndex(0);
      setMessage("Story imported. Undo is available.");
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Unable to import story.",
      );
    }
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(serializeStory(document));
      setMessage("Story JSON copied.");
    } catch {
      setError("Clipboard is unavailable. Use Download JSON instead.");
    }
  }
  function download() {
    const url = URL.createObjectURL(
      new Blob([serializeStory(document)], { type: "application/json" }),
    );
    const a = window.document.createElement("a");
    a.href = url;
    a.download = "story.kino.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage("Story JSON downloaded.");
  }
  function rangeValue(index: number, side: "start" | "end", value: number) {
    const track = scene.layers[index].track!;
    return (
      Math.round(
        (side === "start"
          ? Math.max(0, Math.min(track.end - 0.01, value))
          : Math.min(1, Math.max(track.start + 0.01, value))) * 100,
      ) / 100
    );
  }
  function saveRange(index: number, side: "start" | "end", value: number) {
    edit((next) => {
      next.scenes[si].layers[index].track![side] = rangeValue(
        index,
        side,
        value,
      );
    });
  }
  function clearDraft() {
    try {
      localStorage.removeItem(storageKey);
      setDraft(null);
      setDirty(false);
      setMessage(
        "Saved draft cleared. Current story is still open; export it to keep a copy.",
      );
    } catch {
      setError("The saved draft could not be cleared.");
    }
  }
  function selectScene(index: number) {
    setSceneIndex(index);
    setLayerIndex(0);
    preview.current?.scrollTo({ top: 0 });
  }
  const labels = {
    heading: "New headline",
    text: "Tell your story here.",
    image: "/your-image.jpg",
    component: "YourComponent",
  };
  return (
    <div className="kino-studio">
      <style>{studioStyles}</style>
      <header className="ks-header">
        <div>
          <span className="ks-eyebrow">REACT KINO / LOCAL WORKSPACE</span>
          <h1>
            Storyboard<span className="ks-dot">.</span>
          </h1>
        </div>
        <div className="ks-actions">
          <button
            disabled={cursor === 0}
            onClick={() => navigateHistory(cursor - 1)}
          >
            Undo
          </button>
          <button
            disabled={cursor === history.length - 1}
            onClick={() => navigateHistory(cursor + 1)}
          >
            Redo
          </button>
          <button onClick={() => fileInput.current?.click()}>Import</button>
          <button onClick={copy}>Copy JSON</button>
          <button onClick={clearDraft}>Clear saved draft</button>
          <button className="ks-primary" onClick={download}>
            Download JSON ↗
          </button>
        </div>
      </header>
      <input
        ref={fileInput}
        type="file"
        accept=".json,application/json"
        aria-label="Import story file"
        hidden
        onChange={async (event) => {
          const file = event.target.files?.[0];
          if (file) {
            if (file.size > 2_000_000)
              setError("Story exceeds the 2 MB import limit.");
            else {
              try {
                load(await file.text());
              } catch {
                setError("Unable to read that file.");
              }
            }
          }
          event.target.value = "";
        }}
      />
      {draft && (
        <div className="ks-banner">
          A local draft is available.
          <button
            onClick={() => {
              load(draft);
              setDraft(null);
            }}
          >
            Restore draft
          </button>
          <button onClick={() => setDraft(null)}>Dismiss</button>
        </div>
      )}
      {error && (
        <div className="ks-error" role="alert">
          {error}
          <button onClick={() => setError("")}>Dismiss error</button>
        </div>
      )}
      <div className="ks-workspace">
        <aside className="ks-outline" aria-label="Story outline">
          <label className="ks-label">
            Story title
            <input
              aria-label="Story title"
              key={document.title}
              defaultValue={document.title}
              maxLength={200}
              onBlur={(e) => {
                if (e.target.value.trim())
                  edit((next) => {
                    next.title = e.target.value;
                  });
                else {
                  e.target.value = document.title;
                  setError("The story title cannot be empty.");
                }
              }}
            />
          </label>
          <div className="ks-section-heading">
            <h2>Scenes</h2>
            <span>{document.scenes.length} / 40</span>
          </div>
          <ol className="ks-scenes">
            {document.scenes.map((item, index) => (
              <li key={item.id}>
                <button
                  aria-pressed={index === si}
                  onClick={() => selectScene(index)}
                >
                  <span className="ks-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>
                    {item.title}
                    <small>
                      {item.duration}vh · {item.layers.length} layers
                    </small>
                  </span>
                  <span
                    className="ks-swatch"
                    style={{ background: item.background }}
                  />
                </button>
              </li>
            ))}
          </ol>
          <div className="ks-actions ks-small">
            <button
              disabled={document.scenes.length >= 40}
              onClick={() =>
                edit((next) => {
                  const added = clone(scene);
                  added.id = unique(
                    "scene",
                    next.scenes.map((s) => s.id),
                  );
                  added.title = `${scene.title} copy`.slice(0, 200);
                  next.scenes.splice(si + 1, 0, added);
                })
              }
            >
              Duplicate scene
            </button>
            <button
              disabled={si === 0}
              onClick={() => {
                edit((next) => {
                  [next.scenes[si - 1], next.scenes[si]] = [
                    next.scenes[si],
                    next.scenes[si - 1],
                  ];
                });
                setSceneIndex(si - 1);
              }}
            >
              Move up
            </button>
            <button
              disabled={si === document.scenes.length - 1}
              onClick={() => {
                edit((next) => {
                  [next.scenes[si + 1], next.scenes[si]] = [
                    next.scenes[si],
                    next.scenes[si + 1],
                  ];
                });
                setSceneIndex(si + 1);
              }}
            >
              Move down
            </button>
            <button
              disabled={document.scenes.length === 1}
              onClick={() =>
                edit((next) => {
                  next.scenes.splice(si, 1);
                })
              }
            >
              Delete scene
            </button>
          </div>
          <div className="ks-section-heading">
            <h2>Start with a recipe</h2>
          </div>
          <div className="ks-recipes">
            {storyRecipes.map((recipe) => (
              <button
                key={recipe.id}
                title={recipe.description}
                onClick={() => {
                  commit(createStoryRecipe(recipe.id));
                  selectScene(0);
                }}
              >
                {recipe.title}
                <span>↗</span>
              </button>
            ))}
          </div>
          <p className="ks-note">
            Your document stays in this browser. Export it to share or commit.
            Application components stay in your code.
          </p>
        </aside>
        <main className="ks-stage">
          <div className="ks-preview-toolbar">
            <div className="ks-segment" aria-label="Preview viewport">
              {(["desktop", "mobile"] as const).map((value) => (
                <button
                  key={value}
                  aria-pressed={device === value}
                  onClick={() => setDevice(value)}
                >
                  {value === "desktop" ? "Desktop" : "Mobile · 390"}
                </button>
              ))}
            </div>
            <label>
              <input
                type="checkbox"
                checked={reading}
                onChange={(e) => setReading(e.target.checked)}
              />{" "}
              Reading mode
            </label>
            <select
              aria-label="Playback mode"
              value={mode}
              onChange={(e) => setMode(e.target.value as "scrub" | "scroll")}
            >
              <option value="scrub">Scrub selected scene</option>
              <option value="scroll">Scroll the full story</option>
            </select>
          </div>
          <div className="ks-preview-well">
            <div
              ref={preview}
              className="ks-preview"
              style={{
                width: device === "mobile" ? "min(390px, 100%)" : "100%",
              }}
              onClick={(event) => {
                const target = (
                  event.target as HTMLElement
                ).closest<HTMLElement>("[data-kino-layer]");
                if (!target) return;
                const sceneElement =
                  target.closest<HTMLElement>("[data-kino-scene]");
                const scenePosition = document.scenes.findIndex(
                  (s) => s.id === sceneElement?.dataset.kinoScene,
                );
                if (scenePosition < 0) return;
                const layerPosition = document.scenes[
                  scenePosition
                ].layers.findIndex((l) => l.id === target.dataset.kinoLayer);
                if (layerPosition < 0) return;
                setSceneIndex(scenePosition);
                setLayerIndex(layerPosition);
              }}
            >
              <Story
                document={document}
                components={components}
                root={preview}
                sceneId={mode === "scrub" ? scene.id : undefined}
                progress={mode === "scrub" ? progress : undefined}
                reading={reading}
              />
            </div>
          </div>
          <div className="ks-preview-caption">
            <span>{mode === "scrub" ? scene.title : document.title}</span>
            <span>
              {device === "mobile" || reading
                ? "Natural reading layout · all content visible"
                : "Same renderer as your application"}
            </span>
          </div>
          <section className="ks-timeline" aria-label="Scene timeline">
            <div className="ks-section-heading">
              <h2>Timing</h2>
              <output>{Math.round(progress * 100)}%</output>
            </div>
            <label className="ks-label">
              Preview progress
              <input
                aria-label="Preview progress"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={progress}
                onChange={(e) => {
                  setMode("scrub");
                  setProgress(Number(e.target.value));
                }}
              />
            </label>
            <div className="ks-ruler">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
            {scene.layers.map((item, index) => (
              <div
                className="ks-track"
                data-selected={index === li}
                key={item.id}
              >
                <button
                  onClick={() => setLayerIndex(index)}
                  aria-pressed={index === li}
                >
                  {item.id}
                </button>
                <span className="ks-track-rail">
                  <i
                    style={{
                      left: `${(drag?.index === index && drag.side === "start" ? drag.value : (item.track?.start ?? 0)) * 100}%`,
                      width: `${((drag?.index === index && drag.side === "end" ? drag.value : (item.track?.end ?? 1)) - (drag?.index === index && drag.side === "start" ? drag.value : (item.track?.start ?? 0))) * 100}%`,
                      opacity: item.track ? 1 : 0.35,
                    }}
                  />
                  <b style={{ left: `${progress * 100}%` }} />
                  {item.track &&
                    (["start", "end"] as const).map((side) => (
                      <button
                        key={side}
                        className="ks-handle"
                        role="slider"
                        aria-label={`${item.id} ${side}`}
                        aria-valuemin={
                          side === "start" ? 0 : item.track!.start + 0.01
                        }
                        aria-valuemax={
                          side === "start" ? item.track!.end - 0.01 : 1
                        }
                        aria-valuenow={
                          drag?.index === index && drag.side === side
                            ? drag.value
                            : item.track![side]
                        }
                        style={{
                          left: `${(drag?.index === index && drag.side === side ? drag.value : item.track![side]) * 100}%`,
                        }}
                        onKeyDown={(event) => {
                          const increment = event.shiftKey ? 0.1 : 0.01;
                          const value = item.track![side];
                          const next =
                            event.key === "ArrowRight" ||
                            event.key === "ArrowUp"
                              ? value + increment
                              : event.key === "ArrowLeft" ||
                                  event.key === "ArrowDown"
                                ? value - increment
                                : event.key === "Home"
                                  ? 0
                                  : event.key === "End"
                                    ? 1
                                    : null;
                          if (next !== null) {
                            event.preventDefault();
                            setLayerIndex(index);
                            saveRange(index, side, next);
                          }
                        }}
                        onPointerDown={(event) => {
                          event.preventDefault();
                          setLayerIndex(index);
                          event.currentTarget.setPointerCapture(
                            event.pointerId,
                          );
                          const next = {
                            index,
                            side,
                            value: item.track![side],
                          };
                          dragRef.current = next;
                          setDrag(next);
                        }}
                        onPointerMove={(event) => {
                          if (
                            !event.currentTarget.hasPointerCapture(
                              event.pointerId,
                            ) ||
                            !dragRef.current
                          )
                            return;
                          const box =
                            event.currentTarget.parentElement!.getBoundingClientRect();
                          const value = rangeValue(
                            index,
                            side,
                            (event.clientX - box.left) / box.width,
                          );
                          const next = { index, side, value };
                          dragRef.current = next;
                          setDrag(next);
                        }}
                        onPointerUp={(event) => {
                          if (!dragRef.current) return;
                          const next = dragRef.current;
                          event.currentTarget.releasePointerCapture(
                            event.pointerId,
                          );
                          dragRef.current = null;
                          setDrag(null);
                          saveRange(next.index, next.side, next.value);
                        }}
                        onPointerCancel={() => {
                          dragRef.current = null;
                          setDrag(null);
                        }}
                      />
                    ))}
                </span>
              </div>
            ))}
          </section>
          <p className="ks-status" role="status" aria-live="polite">
            {message ||
              "Select a layer in the preview or timeline. Start and end controls work with a keyboard."}
          </p>
        </main>
        <aside className="ks-inspector" aria-label="Inspector">
          <span className="ks-eyebrow">INSPECTOR</span>
          <h2>{layer.id}</h2>
          <label className="ks-label">
            Layer content
            <textarea
              aria-label="Layer content"
              rows={4}
              key={`${scene.id}/${layer.id}/${layer.content}`}
              defaultValue={layer.content}
              onBlur={(e) => {
                const value = e.target.value;
                if (!value.trim()) {
                  e.target.value = layer.content;
                  setError("Layer content cannot be empty.");
                  return;
                }
                try {
                  editLayer({ content: value });
                } catch {
                  setError(
                    "Use a valid URL or registered component name for this layer.",
                  );
                }
              }}
            />
          </label>
          {layer.kind === "image" && (
            <label className="ks-label">
              Image description
              <input
                value={layer.alt ?? ""}
                onChange={(e) => editLayer({ alt: e.target.value })}
              />
            </label>
          )}
          <label className="ks-check">
            <input
              type="checkbox"
              checked={!!layer.track}
              onChange={(e) =>
                editLayer({
                  track: e.target.checked ? defaultTrack() : undefined,
                })
              }
            />{" "}
            Animate this layer
          </label>
          {layer.track && (
            <>
              <div className="ks-pair">
                <label className="ks-label">
                  Start
                  <input
                    aria-label="Track start"
                    type="number"
                    min="0"
                    max={layer.track.end - 0.01}
                    step="0.01"
                    value={layer.track.start}
                    onChange={(e) => {
                      const value = e.target.valueAsNumber;
                      if (Number.isFinite(value))
                        editTrack({
                          start: Math.max(
                            0,
                            Math.min(layer.track!.end - 0.01, value),
                          ),
                        });
                    }}
                  />
                </label>
                <label className="ks-label">
                  End
                  <input
                    aria-label="Track end"
                    type="number"
                    min={layer.track.start + 0.01}
                    max="1"
                    step="0.01"
                    value={layer.track.end}
                    onChange={(e) => {
                      const value = e.target.valueAsNumber;
                      if (Number.isFinite(value))
                        editTrack({
                          end: Math.min(
                            1,
                            Math.max(layer.track!.start + 0.01, value),
                          ),
                        });
                    }}
                  />
                </label>
              </div>
              <label className="ks-label">
                Easing
                <select
                  value={layer.track.easing ?? "linear"}
                  onChange={(e) =>
                    editTrack({
                      easing: e.target.value as StoryTrack["easing"],
                    })
                  }
                >
                  <option value="linear">Linear</option>
                  <option value="ease-out">Ease out</option>
                  <option value="ease-in-out">Ease in / out</option>
                </select>
              </label>
              {(["from", "to"] as const).map((side) => (
                <fieldset key={side}>
                  <legend>{side === "from" ? "From" : "To"}</legend>
                  <div className="ks-transform">
                    {(["x", "y", "scale", "rotate", "opacity"] as const).map(
                      (key) => (
                        <label className="ks-label" key={key}>
                          {key}
                          <input
                            aria-label={`${side} ${key}`}
                            type="number"
                            step={
                              key === "opacity" || key === "scale" ? 0.05 : 1
                            }
                            min={
                              key === "opacity"
                                ? 0
                                : key === "scale"
                                  ? 0.01
                                  : -4000
                            }
                            max={
                              key === "opacity"
                                ? 1
                                : key === "scale"
                                  ? 10
                                  : 4000
                            }
                            value={
                              layer.track?.[side][key] ??
                              (key === "opacity" || key === "scale" ? 1 : 0)
                            }
                            onChange={(e) => {
                              const value = e.target.valueAsNumber;
                              if (!Number.isFinite(value)) return;
                              const min = Number(e.target.min),
                                max = Number(e.target.max);
                              editTrack({
                                [side]: {
                                  ...layer.track![side],
                                  [key]: Math.max(min, Math.min(max, value)),
                                },
                              });
                            }}
                          />
                        </label>
                      ),
                    )}
                  </div>
                </fieldset>
              ))}
            </>
          )}
          <div className="ks-actions ks-small">
            <button
              disabled={li === 0}
              onClick={() => {
                edit((next) => {
                  const layers = next.scenes[si].layers;
                  [layers[li - 1], layers[li]] = [layers[li], layers[li - 1]];
                });
                setLayerIndex(li - 1);
              }}
            >
              Layer up
            </button>
            <button
              disabled={li === scene.layers.length - 1}
              onClick={() => {
                edit((next) => {
                  const layers = next.scenes[si].layers;
                  [layers[li + 1], layers[li]] = [layers[li], layers[li + 1]];
                });
                setLayerIndex(li + 1);
              }}
            >
              Layer down
            </button>
            <button
              disabled={scene.layers.length === 1}
              onClick={() =>
                edit((next) => {
                  next.scenes[si].layers.splice(li, 1);
                })
              }
            >
              Delete layer
            </button>
          </div>
          <label className="ks-label">
            Add layer
            <select
              aria-label="Add layer"
              value=""
              disabled={scene.layers.length >= 30}
              onChange={(e) => {
                const kind = e.target.value as StoryLayer["kind"];
                if (!kind) return;
                edit((next) => {
                  next.scenes[si].layers.push({
                    id: unique(
                      kind,
                      scene.layers.map((l) => l.id),
                    ),
                    kind,
                    content: labels[kind],
                    ...(kind === "image" ? { alt: "Describe your image" } : {}),
                  });
                });
                setLayerIndex(scene.layers.length);
              }}
            >
              <option value="">Choose a layer…</option>
              <option value="heading">Heading</option>
              <option value="text">Text</option>
              <option value="image">Image</option>
              <option value="component">Registered component</option>
            </select>
          </label>
          <details>
            <summary>Scene settings</summary>
            <label className="ks-label">
              Scene title
              <input
                key={scene.title}
                defaultValue={scene.title}
                onBlur={(e) => {
                  if (e.target.value.trim())
                    editScene({ title: e.target.value.slice(0, 200) });
                  else e.target.value = scene.title;
                }}
              />
            </label>
            <label className="ks-label">
              Scroll length (vh)
              <input
                type="number"
                min="100"
                max="1200"
                step="25"
                value={scene.duration}
                onChange={(e) => {
                  if (Number.isFinite(e.target.valueAsNumber))
                    editScene({
                      duration: Math.min(
                        1200,
                        Math.max(100, e.target.valueAsNumber),
                      ),
                    });
                }}
              />
            </label>
            <label className="ks-check">
              <input
                type="checkbox"
                checked={scene.pin}
                onChange={(e) => editScene({ pin: e.target.checked })}
              />{" "}
              Pin scene on desktop
            </label>
            <label className="ks-label">
              Layout
              <select
                value={scene.layout}
                onChange={(e) =>
                  editScene({ layout: e.target.value as StoryScene["layout"] })
                }
              >
                <option value="stack">Stack</option>
                <option value="split">Two columns</option>
              </select>
            </label>
            <div className="ks-pair">
              <label className="ks-label">
                Background
                <input
                  type="color"
                  value={scene.background.slice(0, 7)}
                  onChange={(e) => editScene({ background: e.target.value })}
                />
              </label>
              <label className="ks-label">
                Text
                <input
                  type="color"
                  value={scene.color.slice(0, 7)}
                  onChange={(e) => editScene({ color: e.target.value })}
                />
              </label>
            </div>
            <p className="ks-note">
              Below 640px, or with reduced motion, stories use a natural reading
              layout with every layer visible. Tall scenes also unpin
              automatically.
            </p>
          </details>
          <details>
            <summary>Diagnostics · {diagnostics.length}</summary>
            {diagnostics.length ? (
              diagnostics.map((d, i) => (
                <p className="ks-note" key={i}>
                  <strong>{d.code}</strong>
                  <br />
                  {d.path}
                  <br />
                  {d.message}
                </p>
              ))
            ) : (
              <p className="ks-note">
                Document checks passed. Browser and accessibility testing are
                still required for your own content.
              </p>
            )}
          </details>
          <details>
            <summary>Import pasted JSON</summary>
            <textarea
              aria-label="Paste story JSON"
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              rows={6}
            />
            <button onClick={() => load(importText)}>Load pasted JSON</button>
          </details>
        </aside>
      </div>
      <footer className="ks-footer">
        <span>
          Free & MIT licensed.{" "}
          <a
            href="https://react-tourlight.vercel.app/support"
            target="_blank"
            rel="noopener noreferrer"
          >
            Support this project ↗
          </a>
        </span>
        <span>Version 1 document · Local drafts · No account</span>
      </footer>
    </div>
  );
}
