"use client";
import React, { useEffect, useRef, useState, type ReactNode } from "react";
import { usePrefersReducedMotion } from "./hooks/use-prefers-reduced-motion";

export interface MarqueeProps {
  /** Speed in pixels per second. Default: 40 */
  speed?: number;
  /** Scroll direction. Default: "left" */
  direction?: "left" | "right";
  /** Pause animation on hover. Default: true */
  pauseOnHover?: boolean;
  /** Gap between items in px. Default: 32 */
  gap?: number;
  children: ReactNode;
  className?: string;
}

let styleInjected = false;

function injectStyles() {
  if (styleInjected || typeof document === "undefined") return;
  styleInjected = true;
  const style = document.createElement("style");
  style.textContent = `
@keyframes kino-marquee-left {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@keyframes kino-marquee-right {
  from { transform: translateX(-50%); }
  to { transform: translateX(0); }
}
`;
  document.head.appendChild(style);
}

export function Marquee({
  speed = 40,
  direction = "left",
  pauseOnHover = true,
  gap = 32,
  children,
  className,
}: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(20);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    injectStyles();
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || reducedMotion) return;

    const measure = () => {
      const halfWidth = track.scrollWidth / 2;
      if (halfWidth > 0 && speed > 0) {
        setDuration(halfWidth / speed);
      }
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, [speed, reducedMotion]);

  if (reducedMotion) {
    return (
      <div className={className} style={{ display: "flex", gap, flexWrap: "wrap" }}>
        {children}
      </div>
    );
  }

  const animationName =
    direction === "right" ? "kino-marquee-right" : "kino-marquee-left";

  return (
    <div
      className={className}
      style={{ overflow: "hidden" }}
    >
      <div
        ref={trackRef}
        style={{
          display: "flex",
          gap,
          width: "max-content",
          animation: `${animationName} ${duration}s linear infinite`,
        }}
        onMouseEnter={(e) => {
          if (pauseOnHover) {
            (e.currentTarget as HTMLDivElement).style.animationPlayState = "paused";
          }
        }}
        onMouseLeave={(e) => {
          if (pauseOnHover) {
            (e.currentTarget as HTMLDivElement).style.animationPlayState = "running";
          }
        }}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
