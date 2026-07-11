"use client";
import React, {
  Children,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { calcSceneProgress } from "@react-kino/core";
import { useScrollTracker } from "./hooks/use-scroll-tracker";
import { useGatedScroll } from "./hooks/use-gated-scroll";
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
  const reducedMotion = usePrefersReducedMotion();
  const { tracker, isOwned } = useScrollTracker();

  const childCount = Children.count(children);

  // Ref-based fast path: translate the strip imperatively on scroll, no
  // per-frame re-render. Gated so off-screen sections cost nothing.
  useGatedScroll({
    ref: spacerRef,
    tracker,
    isOwned,
    enabled: !reducedMotion,
    deps: [childCount],
    compute: ({ scrollY, viewportHeight }) => {
      const spacer = spacerRef.current;
      const strip = stripRef.current;
      if (!spacer || !strip) return;

      const rect = spacer.getBoundingClientRect();
      const offsetTop = rect.top + scrollY;
      const spacerHeight = spacer.offsetHeight;
      const stickyHeight =
        (spacer.firstElementChild as HTMLElement | null)?.offsetHeight ??
        viewportHeight;
      const duration = spacerHeight - stickyHeight;

      if (duration <= 0) return;

      const progress = calcSceneProgress(scrollY, offsetTop, duration);
      const totalStripWidth = strip.scrollWidth;
      const maxTranslate = totalStripWidth - window.innerWidth;

      strip.style.transform = `translateX(-${progress * maxTranslate}px)`;
      strip.style.willChange = "transform";
    },
  });

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
  // scroll-linked translate (like Parallax does).
  const stripStyle: CSSProperties = {
    display: "flex",
    flexDirection: "row",
    height: "100%",
    ...(reducedMotion
      ? {}
      : { transform: "translateX(-0px)", willChange: "transform" }),
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
