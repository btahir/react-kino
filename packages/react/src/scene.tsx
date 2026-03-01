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
import { ScrollTracker, calcSceneProgress, parseDuration } from "@kino/core";
import { useIsClient } from "./hooks/use-is-client";

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

type SceneChildren = ReactNode | ((progress: number) => ReactNode);

interface SceneProps {
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
  const isClient = useIsClient();

  useEffect(() => {
    if (!isClient) return;

    const viewportHeight = window.innerHeight;
    const durationPx = parseDuration(duration, viewportHeight);
    const tracker = new ScrollTracker();

    const unsub = tracker.subscribe(({ scrollY }) => {
      if (!spacerRef.current) return;
      const rect = spacerRef.current.getBoundingClientRect();
      const offsetTop = rect.top + scrollY;
      // Use effective duration (spacer - viewport) so progress 0→1
      // maps exactly to the time the sticky content is pinned on screen.
      // Without this, progress outruns the sticky and animations complete off-screen.
      const effectiveDuration = pin ? Math.max(1, durationPx - viewportHeight) : durationPx;
      setProgress(calcSceneProgress(scrollY, offsetTop, effectiveDuration));
    });

    tracker.start();
    return () => {
      tracker.stop();
      unsub();
    };
  }, [isClient, duration]);

  const viewportHeight = isClient ? window.innerHeight : 0;
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
