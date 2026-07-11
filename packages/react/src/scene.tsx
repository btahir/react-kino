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
import { useIsClient } from "./hooks/use-is-client";
import { useScrollTracker } from "./hooks/use-scroll-tracker";
import { useGatedScroll } from "./hooks/use-gated-scroll";

/**
 * Context carrying the scene's {@link ProgressValue}. The identity of this
 * value is STABLE for the lifetime of a `<Scene>` (it is never re-created on
 * re-render), so subscribing components never re-render when progress changes —
 * they read the value imperatively and write to the DOM directly.
 */
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
  children: SceneChildren;
  className?: string;
  style?: CSSProperties;
}

export function Scene({
  duration,
  pin = true,
  children,
  className,
  style,
}: SceneProps) {
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

  useGatedScroll({
    ref: spacerRef,
    tracker,
    isOwned,
    enabled: isClient,
    deps: [isClient, duration, pin],
    compute: ({ scrollY, viewportHeight: vh }) => {
      if (vh !== lastVhRef.current) {
        lastVhRef.current = vh;
        setViewportHeight(vh);
      }
      const spacer = spacerRef.current;
      if (!spacer) return;
      const rect = spacer.getBoundingClientRect();
      const offsetTop = rect.top + scrollY;
      const durationPx = parseDuration(duration, vh);
      // Effective duration (spacer - viewport) maps progress 0→1 exactly to the
      // time the sticky content is pinned on screen.
      const effectiveDuration = pin ? Math.max(1, durationPx - vh) : durationPx;
      const p = calcSceneProgress(scrollY, offsetTop, effectiveDuration);
      progressValue.set(p);
      if (isRenderPropRef.current) setRenderProgress(p);
    },
  });

  const durationPx = isClient ? parseDuration(duration, viewportHeight) : 0;

  const spacerStyle: CSSProperties = {
    position: "relative",
    height: isClient ? `${durationPx}px` : duration,
  };

  const stickyStyle: CSSProperties = pin
    ? {
        position: "sticky",
        top: 0,
        height: "100vh",
        overflow: "hidden",
      }
    : {};

  const resolvedChildren = isRenderProp
    ? (children as (progress: number) => ReactNode)(renderProgress)
    : children;

  return (
    <div ref={spacerRef} style={spacerStyle} className={className}>
      <div style={{ ...stickyStyle, ...style }}>
        <SceneProgressValueContext.Provider value={progressValue}>
          {resolvedChildren}
        </SceneProgressValueContext.Provider>
      </div>
    </div>
  );
}
