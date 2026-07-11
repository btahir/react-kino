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
import { calcSceneProgress, parseDuration } from "@react-kino/core";
import { useIsClient } from "./hooks/use-is-client";
import { useScrollTracker } from "./hooks/use-scroll-tracker";

/** Context so child components can access scene progress */
interface SceneContextValue {
  progress: number;
}
const SceneContext = createContext<SceneContextValue | null>(null);

export function useSceneContext(): SceneContextValue {
  const ctx = useContext(SceneContext);
  if (!ctx) throw new Error("Must be used inside <Scene>");
  return ctx;
}

/**
 * Non-throwing variant of {@link useSceneContext}. Returns `null` instead of
 * throwing when used outside a `<Scene>`, so callers can branch on the
 * result rather than relying on try/catch around a hook call.
 */
export function useSceneContextOptional(): SceneContextValue | null {
  return useContext(SceneContext);
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
  const [progress, setProgress] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const isClient = useIsClient();
  const { tracker, isOwned } = useScrollTracker();

  useEffect(() => {
    if (!isClient) return;

    // Set the initial viewport height immediately; further updates (incl.
    // on resize) arrive via the tracker subscription below.
    setViewportHeight(window.innerHeight);

    const unsub = tracker.subscribe(({ scrollY, viewportHeight: vh }) => {
      // Re-derive viewport/duration from the freshly emitted value on every
      // tick instead of closing over the value captured when the effect
      // ran, so a window resize (incl. mobile URL-bar show/hide) keeps
      // progress and the spacer height correct.
      setViewportHeight(vh);
      if (!spacerRef.current) return;
      const rect = spacerRef.current.getBoundingClientRect();
      const offsetTop = rect.top + scrollY;
      const durationPx = parseDuration(duration, vh);
      // Use effective duration (spacer - viewport) so progress 0→1
      // maps exactly to the time the sticky content is pinned on screen.
      // Without this, progress outruns the sticky and animations complete off-screen.
      const effectiveDuration = pin ? Math.max(1, durationPx - vh) : durationPx;
      setProgress(calcSceneProgress(scrollY, offsetTop, effectiveDuration));
    });

    if (isOwned) tracker.start();
    return () => {
      unsub();
      if (isOwned) tracker.stop();
    };
  }, [isClient, duration, pin, tracker, isOwned]);

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

  const resolvedChildren =
    typeof children === "function" ? children(progress) : children;

  return (
    <div ref={spacerRef} style={spacerStyle} className={className}>
      <div style={{ ...stickyStyle, ...style }}>
        <SceneContext.Provider value={{ progress }}>
          {resolvedChildren}
        </SceneContext.Provider>
      </div>
    </div>
  );
}
