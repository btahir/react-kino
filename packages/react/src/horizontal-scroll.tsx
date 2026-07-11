"use client";
import React, {
  Children,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { calcSceneProgress } from "@react-kino/core";
import { useIsClient } from "./hooks/use-is-client";
import { useScrollTracker } from "./hooks/use-scroll-tracker";
import { usePrefersReducedMotion } from "./hooks/use-prefers-reduced-motion";

export interface HorizontalScrollProps {
  children: ReactNode;
  className?: string;
  /** Height of each panel as CSS string (default: "100vh") */
  panelHeight?: string;
}

export interface PanelProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function Panel({ children, className, style }: PanelProps) {
  const panelStyle: CSSProperties = {
    flexShrink: 0,
    width: "100vw",
    height: "var(--kino-panel-height, 100vh)",
    ...style,
  };

  return (
    <div className={className} style={panelStyle}>
      {children}
    </div>
  );
}

export function HorizontalScroll({
  children,
  className,
  panelHeight = "100vh",
}: HorizontalScrollProps) {
  const spacerRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const [translateX, setTranslateX] = useState(0);
  const isClient = useIsClient();
  const reducedMotion = usePrefersReducedMotion();
  const { tracker, isOwned } = useScrollTracker();

  const childCount = Children.count(children);

  useEffect(() => {
    if (!isClient || !spacerRef.current || reducedMotion) return;

    const unsub = tracker.subscribe(({ scrollY, viewportHeight }) => {
      if (!spacerRef.current || !stripRef.current) return;

      const rect = spacerRef.current.getBoundingClientRect();
      const offsetTop = rect.top + scrollY;
      const spacerHeight = spacerRef.current.offsetHeight;
      const stickyHeight =
        (spacerRef.current.firstElementChild as HTMLElement | null)?.offsetHeight ??
        viewportHeight;
      const duration = spacerHeight - stickyHeight;

      if (duration <= 0) return;

      const progress = calcSceneProgress(scrollY, offsetTop, duration);
      const totalStripWidth = stripRef.current.scrollWidth;
      const maxTranslate = totalStripWidth - window.innerWidth;

      setTranslateX(progress * maxTranslate);
    });

    if (isOwned) tracker.start();
    return () => {
      unsub();
      if (isOwned) tracker.stop();
    };
  }, [isClient, childCount, tracker, isOwned, reducedMotion]);

  // Spacer height: one panel height per child
  const spacerStyle: CSSProperties = {
    position: "relative",
    height: `calc(${childCount} * ${panelHeight})`,
    ["--kino-panel-height" as string]: panelHeight,
  };

  const stickyStyle: CSSProperties = {
    position: "sticky",
    top: 0,
    height: panelHeight,
    overflow: "hidden",
  };

  // When reduced motion is preferred, render the strip without the
  // scroll-linked translate (like Parallax does), rather than scroll-jacking
  // the user horizontally.
  const stripStyle: CSSProperties = {
    display: "flex",
    flexDirection: "row",
    height: "100%",
    ...(reducedMotion
      ? {}
      : { transform: `translateX(-${translateX}px)`, willChange: "transform" }),
  };

  return (
    <div ref={spacerRef} className={className} style={spacerStyle}>
      <div style={stickyStyle}>
        <div ref={stripRef} style={stripStyle}>
          {children}
        </div>
      </div>
    </div>
  );
}
