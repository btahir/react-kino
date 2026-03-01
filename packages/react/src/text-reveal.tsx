"use client";
import React, { useEffect, useState, type CSSProperties } from "react";
import { useSceneContext } from "./scene";

type TextRevealMode = "word" | "char" | "line";

interface TextRevealProps {
  /** The text to reveal */
  children: string;
  /** Reveal mode: word by word, char by char, or line by line. Default: "word" */
  mode?: TextRevealMode;
  /** Progress value 0-1. If inside Scene, reads from context. */
  progress?: number;
  /** Progress value (0-1) when reveal starts. Default: 0 */
  at?: number;
  /** How much progress the full reveal spans. Default: 0.8 */
  span?: number;
  /** Color of revealed text. Default: currentColor */
  color?: string;
  /** Color of unrevealed text. Default: rgba(currentColor, 0.15) */
  dimColor?: string;
  className?: string;
}

function useProgress(propProgress?: number): number {
  try {
    const ctx = useSceneContext();
    return propProgress ?? ctx.progress;
  } catch {
    return propProgress ?? 0;
  }
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);
  return reduced;
}

function splitTokens(text: string, mode: TextRevealMode): string[] {
  switch (mode) {
    case "char":
      return text.split("");
    case "line":
      return text.split("\n");
    case "word":
    default:
      return text.split(/(\s+)/).filter((t) => t.length > 0);
  }
}

export function TextReveal({
  children,
  mode = "word",
  progress: progressProp,
  at = 0,
  span = 0.8,
  color,
  dimColor,
  className,
}: TextRevealProps) {
  const progress = useProgress(progressProp);
  const reducedMotion = usePrefersReducedMotion();
  const lineMode = mode === "line";

  const tokens = splitTokens(children, mode);
  // Only count non-whitespace tokens for threshold calculation
  const contentTokens = tokens.filter((t) => t.trim().length > 0);
  const totalContent = contentTokens.length;

  if (reducedMotion) {
    return (
      <div
        className={className}
        data-testid="text-reveal"
        style={lineMode ? { whiteSpace: "pre-line" } : undefined}
      >
        {children}
      </div>
    );
  }

  if (lineMode) {
    return (
      <div className={className} data-testid="text-reveal">
        {tokens.map((line, i) => {
          const threshold =
            totalContent > 1 ? at + (i / (totalContent - 1)) * span : at;
          const isRevealed = progress >= threshold;
          const lineStyle: CSSProperties = {
            color: isRevealed ? color || undefined : dimColor || undefined,
            opacity: isRevealed ? 1 : 0.15,
            transition: "color 0.15s, opacity 0.15s",
          };

          return (
            <React.Fragment key={i}>
              <span style={lineStyle} data-testid="text-reveal-token">
                {line}
              </span>
              {i < tokens.length - 1 && <br />}
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  let contentIndex = 0;

  return (
    <div className={className} data-testid="text-reveal">
      {tokens.map((token, i) => {
        const isWhitespace = token.trim().length === 0;

        if (isWhitespace) {
          return (
            <span key={i} data-testid="text-reveal-token">
              {token}
            </span>
          );
        }

        const threshold =
          totalContent > 1
            ? at + (contentIndex / (totalContent - 1)) * span
            : at;
        contentIndex++;
        const isRevealed = progress >= threshold;

        const tokenStyle: CSSProperties = {
          color: isRevealed ? color || undefined : dimColor || undefined,
          opacity: isRevealed ? 1 : 0.15,
          transition: "color 0.15s, opacity 0.15s",
        };

        return (
          <span key={i} style={tokenStyle} data-testid="text-reveal-token">
            {token}
          </span>
        );
      })}
    </div>
  );
}
