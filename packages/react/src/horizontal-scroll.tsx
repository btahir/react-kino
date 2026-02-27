"use client";
import React, {
  Children,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { ScrollTracker, calcSceneProgress } from "@kino/core";
import { useIsClient } from "./hooks/use-is-client";

interface HorizontalScrollProps {
  children: ReactNode;
  className?: string;
  /** Height of each panel as CSS string (default: "100vh") */
  panelHeight?: string;
}

interface PanelProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function Panel({ children, className, style }: PanelProps) {
  const panelStyle: CSSProperties = {
    flexShrink: 0,
    width: "100vw",
    height: "100vh",
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

  const childCount = Children.count(children);

  useEffect(() => {
    if (!isClient || !spacerRef.current) return;

    const tracker = new ScrollTracker();

    const unsub = tracker.subscribe(({ scrollY, viewportHeight }) => {
      if (!spacerRef.current || !stripRef.current) return;

      const rect = spacerRef.current.getBoundingClientRect();
      const offsetTop = rect.top + scrollY;
      const spacerHeight = spacerRef.current.offsetHeight;
      const duration = spacerHeight - viewportHeight;

      if (duration <= 0) return;

      const progress = calcSceneProgress(scrollY, offsetTop, duration);
      const totalStripWidth = stripRef.current.scrollWidth;
      const maxTranslate = totalStripWidth - window.innerWidth;

      setTranslateX(progress * maxTranslate);
    });

    tracker.start();
    return () => {
      tracker.stop();
      unsub();
    };
  }, [isClient, childCount]);

  // Spacer height: one "viewport" per child
  const spacerStyle: CSSProperties = {
    position: "relative",
    height: isClient ? `${childCount * 100}vh` : `calc(${childCount} * ${panelHeight})`,
  };

  const stickyStyle: CSSProperties = {
    position: "sticky",
    top: 0,
    height: "100vh",
    overflow: "hidden",
  };

  const stripStyle: CSSProperties = {
    display: "flex",
    flexDirection: "row",
    height: "100%",
    transform: `translateX(-${translateX}px)`,
    willChange: "transform",
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
