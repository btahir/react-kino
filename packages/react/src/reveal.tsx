"use client";
import React, {
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import type { OffsetEntry } from "@react-kino/core";
import { useSceneProgressValueOptional } from "./scene";
import { useElementProgressValue } from "./hooks/use-element-progress";
import { usePrefersReducedMotion } from "./hooks/use-prefers-reduced-motion";

type RevealAnimation = "fade" | "fade-up" | "fade-down" | "scale" | "blur";

/**
 * What drives the reveal:
 * - `"scene"`: read progress from the enclosing `<Scene>`.
 * - `"visibility"`: animate based on the element's own viewport position
 *   (no `<Scene>`/pinning required).
 * - `"auto"` (default): use the `<Scene>` if present, otherwise fall back to
 *   the element's own visibility.
 */
type RevealTrigger = "scene" | "visibility" | "auto";

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
  /** What drives the reveal. Default: "auto". */
  trigger?: RevealTrigger;
  /**
   * Offset pairs used when driven by element visibility. Defaults to
   * `["start end", "end start"]`.
   */
  offset?: readonly OffsetEntry[];
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

export function Reveal({
  at = 0,
  animation = "fade",
  duration = 600,
  delay = 0,
  progress: progressProp,
  trigger = "auto",
  offset,
  children,
  className,
}: RevealProps) {
  const elRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const scenePv = useSceneProgressValueOptional();

  const controlled = progressProp != null;
  // Decide whether to derive progress from the element's own visibility.
  const wantElement =
    !controlled &&
    (trigger === "visibility" || (trigger !== "scene" && !scenePv));

  // Always call the hook (rules of hooks); it does nothing unless enabled.
  const elementPv = useElementProgressValue(elRef, {
    offset,
    enabled: wantElement && !reducedMotion,
  });

  const activePv = controlled ? null : wantElement ? elementPv : scenePv;

  const initialProgress = controlled
    ? (progressProp as number)
    : activePv
      ? activePv.get()
      : 0;
  const initiallyVisible = initialProgress >= at;

  useEffect(() => {
    if (reducedMotion || controlled || !activePv) return;
    const el = elRef.current;
    if (!el) return;
    const apply = (p: number) => {
      const styleSet = p >= at ? VISIBLE_STYLES[animation] : HIDDEN_STYLES[animation];
      if (styleSet.opacity != null) el.style.opacity = String(styleSet.opacity);
      if ("transform" in styleSet)
        el.style.transform = (styleSet.transform as string) ?? "";
      if ("filter" in styleSet) el.style.filter = (styleSet.filter as string) ?? "";
    };
    apply(activePv.get());
    return activePv.on(apply);
  }, [activePv, reducedMotion, controlled, at, animation]);

  if (reducedMotion) {
    return (
      <div ref={elRef} className={className} style={VISIBLE_STYLES[animation]}>
        {children}
      </div>
    );
  }

  const style: CSSProperties = {
    ...(initiallyVisible ? VISIBLE_STYLES[animation] : HIDDEN_STYLES[animation]),
    transition: `opacity ${duration}ms ease ${delay}ms, transform ${duration}ms ease ${delay}ms, filter ${duration}ms ease ${delay}ms`,
    willChange: "opacity, transform, filter",
  };

  return (
    <div ref={elRef} className={className} style={style}>
      {children}
    </div>
  );
}
