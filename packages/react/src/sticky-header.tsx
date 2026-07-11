"use client";
import React, { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { usePrefersReducedMotion } from "./hooks/use-prefers-reduced-motion";

export interface StickyHeaderProps {
  /** Scroll distance (px) before the header becomes solid. Default: 80 */
  threshold?: number;
  /** Background color when scrolled. Default: rgba(0,0,0,0.8) */
  background?: string;
  /** Whether to apply backdrop blur when scrolled. Default: true */
  blur?: boolean;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function StickyHeader({
  threshold = 80,
  background = "rgba(0,0,0,0.8)",
  blur = true,
  children,
  className,
  style,
}: StickyHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > threshold);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  const transition = reducedMotion
    ? "none"
    : "background 0.3s ease, backdrop-filter 0.3s ease, border-color 0.3s ease";

  const headerStyle: CSSProperties = {
    ...style,
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    background: scrolled ? background : "transparent",
    backdropFilter: scrolled && blur ? "blur(12px)" : "none",
    WebkitBackdropFilter: scrolled && blur ? "blur(12px)" : "none",
    borderBottom: scrolled ? "1px solid rgba(255,255,255,0.1)" : "1px solid transparent",
    transition,
  };

  return (
    <header className={className} style={headerStyle}>
      {children}
    </header>
  );
}
