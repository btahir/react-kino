"use client";
import React, {
  useRef,
  useEffect,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useScrollTracker } from "./hooks/use-scroll-tracker";
import { useGatedScroll } from "./hooks/use-gated-scroll";
import { usePrefersReducedMotion } from "./hooks/use-prefers-reduced-motion";

export interface ParallaxProps {
  /** Speed multiplier: 1 = normal scroll, <1 = slower (background), >1 = faster (foreground) */
  speed?: number;
  /** Element-relative range in pixels. Use both to enter from outside the viewport. */
  from?: number;
  to?: number;
  /** Scroll direction */
  direction?: "vertical" | "horizontal";
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function Parallax({
  speed = 0.5,
  from,
  to,
  direction = "vertical",
  children,
  className,
  style,
}: ParallaxProps) {
  const elRef = useRef<HTMLDivElement>(null);
  const lastOffset = useRef(0);
  const reducedMotion = usePrefersReducedMotion();
  const { tracker, isOwned } = useScrollTracker();

  useEffect(() => {
    lastOffset.current = 0;
  }, [direction, reducedMotion]);

  // Ref-based fast path: write the parallax transform directly on every scroll
  // frame without re-rendering, gated so off-screen parallax costs nothing.
  useGatedScroll({
    ref: elRef,
    tracker,
    isOwned,
    enabled: !reducedMotion,
    deps: [speed, direction, from, to],
    compute: ({ scrollY, viewportHeight }) => {
      const el = elRef.current;
      if (!el) return;
      const start =
        tracker.offsetTop(el, scrollY) -
        (direction === "vertical" ? lastOffset.current : 0);
      const local = Math.max(
        0,
        Math.min(
          1,
          (scrollY - start + viewportHeight) /
            (viewportHeight + el.offsetHeight),
        ),
      );
      const offset =
        from !== undefined && to !== undefined
          ? from + (to - from) * local
          : (scrollY - start) * (1 - speed);
      lastOffset.current = offset;
      el.style.transform =
        direction === "vertical"
          ? `translateY(${offset}px)`
          : `translateX(${offset}px)`;
      el.style.willChange = "transform";
    },
  });

  // Initial transform (offset 0) so first paint matches, then updated imperatively.
  const transform = reducedMotion
    ? undefined
    : direction === "vertical"
      ? "translateY(0px)"
      : "translateX(0px)";

  const parallaxStyle: CSSProperties = {
    ...style,
    ...(transform ? { transform, willChange: "transform" } : {}),
  };

  return (
    <div ref={elRef} className={className} style={parallaxStyle}>
      {children}
    </div>
  );
}
