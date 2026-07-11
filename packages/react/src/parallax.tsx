"use client";
import React, { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { useScrollTracker } from "./hooks/use-scroll-tracker";
import { usePrefersReducedMotion } from "./hooks/use-prefers-reduced-motion";

export interface ParallaxProps {
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
  const reducedMotion = usePrefersReducedMotion();
  const { tracker, isOwned } = useScrollTracker();

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
