"use client";
import React, {
  useRef,
  useState,
  useEffect,
  createContext,
  useContext,
  type ReactNode,
  type CSSProperties,
} from "react";
import {
  calcSceneProgress,
  parseDuration,
  ProgressValue,
} from "@react-kino/core";
import { usePrefersReducedMotion } from "./hooks/use-prefers-reduced-motion";
import { useIsClient } from "./hooks/use-is-client";
import { useScrollTracker } from "./hooks/use-scroll-tracker";
import { useGatedScroll } from "./hooks/use-gated-scroll";

/**
 * Context carrying the scene's {@link ProgressValue}. The identity of this
 * value is STABLE for the lifetime of a `<Scene>` (it is never re-created on
 * re-render), so subscribing components never re-render when progress changes —
 * they read the value imperatively and write to the DOM directly.
 */
const SceneReadingContext = createContext(false);
export function useSceneReading(): boolean {
  return useContext(SceneReadingContext);
}

const SceneProgressValueContext = createContext<ProgressValue | null>(null);

/** Legacy numeric context shape (kept for backward compatibility). */
export interface SceneContextValue {
  progress: number;
}

/**
 * Read live numeric scene progress. Backward-compatible with prior versions:
 * the returned `progress` updates on every scroll frame and re-renders the
 * calling component. Prefer {@link useSceneProgressValue} for the ref-based
 * fast path that avoids per-frame re-renders.
 */
export function useSceneContext(): SceneContextValue {
  const pv = useContext(SceneProgressValueContext);
  if (!pv) throw new Error("Must be used inside <Scene>");
  return { progress: useSubscribedProgress(pv) };
}

/**
 * Non-throwing variant of {@link useSceneContext}. Returns `null` outside a
 * `<Scene>`. Like {@link useSceneContext}, the numeric `progress` re-renders
 * the caller each frame (compat path).
 */
export function useSceneContextOptional(): SceneContextValue | null {
  const pv = useContext(SceneProgressValueContext);
  const progress = useSubscribedProgress(pv);
  return pv ? { progress } : null;
}

/** Internal: subscribe to a ProgressValue and re-render on change. */
function useSubscribedProgress(pv: ProgressValue | null): number {
  const [progress, setProgress] = useState(() => (pv ? pv.get() : 0));
  useEffect(() => {
    if (!pv) return;
    setProgress(pv.get());
    return pv.on(setProgress);
  }, [pv]);
  return progress;
}

/**
 * Fast path: get the scene's {@link ProgressValue} to subscribe to imperatively.
 * Throws when used outside a `<Scene>`.
 */
export function useSceneProgressValue(): ProgressValue {
  const pv = useContext(SceneProgressValueContext);
  if (!pv) throw new Error("useSceneProgressValue must be used inside <Scene>");
  return pv;
}

/** Non-throwing variant of {@link useSceneProgressValue}. */
export function useSceneProgressValueOptional(): ProgressValue | null {
  return useContext(SceneProgressValueContext);
}

type SceneChildren = ReactNode | ((progress: number) => ReactNode);

export interface SceneProps {
  /** Scroll distance this scene spans, e.g. "200vh" or "1500px" */
  duration: string;
  /** Whether to pin (sticky) the inner content. Default: true */
  pin?: boolean;
  /** Auto unpins content taller than its viewport; clip preserves the old behavior. */
  overflow?: "auto" | "clip";
  stickyOffset?: number;
  /** Use a natural reading layout below this width. */
  unpinBelow?: number;
  /** Controlled scene progress for authoring previews (0–1). */
  progress?: number;
  children: SceneChildren;
  className?: string;
  style?: CSSProperties;
}

export function Scene({
  duration,
  pin = true,
  overflow = "auto",
  stickyOffset = 0,
  unpinBelow = 0,
  progress: controlledProgress,
  children,
  className,
  style,
}: SceneProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [natural, setNatural] = useState(false);
  const spacerRef = useRef<HTMLDivElement>(null);
  const isClient = useIsClient();
  const { tracker, isOwned } = useScrollTracker();

  // Stable ProgressValue: created once, identity preserved across renders so
  // subscribers never churn.
  const progressValueRef = useRef<ProgressValue | null>(null);
  if (progressValueRef.current === null) {
    progressValueRef.current = new ProgressValue(0);
  }
  const progressValue = progressValueRef.current;

  // Only scenes that use a render-prop child need to re-render per frame; for
  // static children we stay entirely on the ref-based fast path.
  const isRenderProp = typeof children === "function";
  const isRenderPropRef = useRef(isRenderProp);
  isRenderPropRef.current = isRenderProp;
  const [renderProgress, setRenderProgress] = useState(0);

  // Viewport height only re-renders the Scene when it actually changes (resize),
  // never per scroll frame, so the spacer height stays correct without churn.
  const [viewportHeight, setViewportHeight] = useState(0);
  const lastVhRef = useRef(-1);

  useEffect(() => {
    if (!isClient) return;
    // Seed viewport height so the spacer sizes correctly on mount.
    lastVhRef.current = window.innerHeight;
    setViewportHeight(window.innerHeight);
  }, [isClient]);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    const measure = () => {
      const root = tracker.getRoot();
      const vh = tracker.snapshot().viewportHeight;
      const width = root?.clientWidth ?? window.innerWidth;
      setNatural(
        width < unpinBelow ||
          (overflow === "auto" && content.scrollHeight > vh - stickyOffset + 2),
      );
      setViewportHeight(vh);
    };
    measure();
    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(measure);
    observer?.observe(content);
    const rootElement = tracker.getRoot();
    if (rootElement) observer?.observe(rootElement);
    window.addEventListener("resize", measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [tracker, overflow, stickyOffset, unpinBelow, children]);
  const activePin = pin && !natural && !reducedMotion;
  useEffect(() => {
    if (controlledProgress !== undefined || reducedMotion || natural) {
      const value =
        reducedMotion || natural
          ? 1
          : Math.max(0, Math.min(1, controlledProgress!));
      progressValue.set(value);
      setRenderProgress(value);
    }
  }, [controlledProgress, reducedMotion, natural, progressValue]);

  useGatedScroll({
    ref: spacerRef,
    tracker,
    isOwned,
    enabled:
      isClient &&
      controlledProgress === undefined &&
      !reducedMotion &&
      !natural,
    deps: [isClient, duration, activePin, stickyOffset],
    compute: ({ scrollY, viewportHeight: vh }) => {
      if (vh !== lastVhRef.current) {
        lastVhRef.current = vh;
        setViewportHeight(vh);
      }
      const spacer = spacerRef.current;
      if (!spacer) return;
      const rect = spacer.getBoundingClientRect();
      const offsetTop = tracker.offsetTop(spacer, scrollY);
      const durationPx = parseDuration(duration, vh);
      // Effective duration (spacer - viewport) maps progress 0→1 exactly to the
      // time the sticky content is pinned on screen.
      const effectiveDuration = activePin
        ? Math.max(1, durationPx - vh)
        : durationPx;
      const p = calcSceneProgress(
        scrollY,
        offsetTop - stickyOffset,
        effectiveDuration,
      );
      progressValue.set(p);
      if (isRenderPropRef.current) setRenderProgress(p);
    },
  });

  const durationPx = isClient ? parseDuration(duration, viewportHeight) : 0;

  const spacerStyle: CSSProperties = {
    position: "relative",
    ["--kino-viewport" as string]: viewportHeight
      ? `${viewportHeight}px`
      : "100svh",
    height:
      natural || reducedMotion || controlledProgress !== undefined
        ? "auto"
        : isClient
          ? `${durationPx}px`
          : duration,
  };

  const stickyStyle: CSSProperties =
    activePin && controlledProgress === undefined
      ? {
          position: "sticky",
          top: stickyOffset,
          height: viewportHeight ? viewportHeight - stickyOffset : "100vh",
          overflow: overflow === "clip" ? "hidden" : "visible",
        }
      : {};

  const resolvedChildren = isRenderProp
    ? (children as (progress: number) => ReactNode)(renderProgress)
    : children;

  return (
    <div ref={spacerRef} style={spacerStyle} className={className}>
      <div style={{ ...stickyStyle, ...style }}>
        <div
          ref={contentRef}
          data-kino-content
          style={{ display: "flow-root" }}
        >
          <SceneReadingContext.Provider value={natural || reducedMotion}>
            <SceneProgressValueContext.Provider value={progressValue}>
              {resolvedChildren}
            </SceneProgressValueContext.Provider>
          </SceneReadingContext.Provider>
        </div>
      </div>
    </div>
  );
}
