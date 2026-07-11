"use client";
import React, { type CSSProperties, type ReactNode } from "react";
import { useSceneContextOptional } from "./scene";
import { usePrefersReducedMotion } from "./hooks/use-prefers-reduced-motion";

type RevealAnimation = "fade" | "fade-up" | "fade-down" | "scale" | "blur";

export interface RevealProps {
  /** Progress value (0-1) when animation triggers */
  at?: number;
  /** Animation preset */
  animation?: RevealAnimation;
  /** Animation duration in ms */
  duration?: number;
  /** Delay before animation in ms */
  delay?: number;
  /** Direct progress override (if not inside a Scene) */
  progress?: number;
  children: ReactNode;
  className?: string;
}

const HIDDEN_STYLES: Record<RevealAnimation, CSSProperties> = {
  fade: { opacity: 0 },
  "fade-up": { opacity: 0, transform: "translateY(40px)" },
  "fade-down": { opacity: 0, transform: "translateY(-40px)" },
  scale: { opacity: 0, transform: "scale(0.9)" },
  blur: { opacity: 0, filter: "blur(12px)" },
};

const VISIBLE_STYLES: Record<RevealAnimation, CSSProperties> = {
  fade: { opacity: 1 },
  "fade-up": { opacity: 1, transform: "translateY(0)" },
  "fade-down": { opacity: 1, transform: "translateY(0)" },
  scale: { opacity: 1, transform: "scale(1)" },
  blur: { opacity: 1, filter: "blur(0px)" },
};

function useProgress(propProgress?: number): number {
  const ctx = useSceneContextOptional();
  return propProgress ?? ctx?.progress ?? 0;
}

export function Reveal({
  at = 0,
  animation = "fade",
  duration = 600,
  delay = 0,
  progress: progressProp,
  children,
  className,
}: RevealProps) {
  const progress = useProgress(progressProp);
  const reducedMotion = usePrefersReducedMotion();
  const isVisible = progress >= at;

  if (reducedMotion) {
    return (
      <div className={className} style={VISIBLE_STYLES[animation]}>
        {children}
      </div>
    );
  }

  const style: CSSProperties = {
    ...(isVisible ? VISIBLE_STYLES[animation] : HIDDEN_STYLES[animation]),
    transition: `opacity ${duration}ms ease ${delay}ms, transform ${duration}ms ease ${delay}ms, filter ${duration}ms ease ${delay}ms`,
    willChange: "opacity, transform, filter",
  };

  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}
