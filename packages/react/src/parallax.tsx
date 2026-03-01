"use client";
import React, { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { useScrollTracker } from "./hooks/use-scroll-tracker";

interface ParallaxProps {
  /** Speed multiplier: 1 = normal scroll, <1 = slower (background), >1 = faster (foreground) */
  speed?: number;
  /** Scroll direction */
  direction?: "vertical" | "horizontal";
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function Parallax({
  speed = 0.5,
  direction = "vertical",
  children,
  className,
  style,
}: ParallaxProps) {
  const [offset, setOffset] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const { tracker, isOwned } = useScrollTracker();

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const unsub = tracker.subscribe(({ scrollY }) => {
      setOffset(scrollY * (1 - speed));
    });

    if (isOwned) tracker.start();
    return () => {
      unsub();
      if (isOwned) tracker.stop();
    };
  }, [speed, reducedMotion, tracker, isOwned]);

  const transform =
    reducedMotion
      ? undefined
      : direction === "vertical"
        ? `translateY(${offset}px)`
        : `translateX(${offset}px)`;

  const parallaxStyle: CSSProperties = {
    ...style,
    ...(transform ? { transform, willChange: "transform" } : {}),
  };

  return (
    <div className={className} style={parallaxStyle}>
      {children}
    </div>
  );
}
