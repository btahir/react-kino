"use client";
import React, {
  useEffect,
  useRef,
  type CSSProperties,
} from "react";
import { useSceneProgressValueOptional } from "./scene";
import { usePrefersReducedMotion } from "./hooks/use-prefers-reduced-motion";

type TextRevealMode = "word" | "char" | "line";

export interface TextRevealProps {
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
  /**
   * Color of unrevealed text. If unset, unrevealed tokens are dimmed via
   * `opacity: 0.15` instead (not a color derived from `currentColor`).
   */
  dimColor?: string;
  className?: string;
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

interface TokenMeta {
  token: string;
  /** whitespace tokens (word/char mode) are rendered but never styled */
  styled: boolean;
  threshold: number;
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
  const reducedMotion = usePrefersReducedMotion();
  const pv = useSceneProgressValueOptional();
  const lineMode = mode === "line";

  const tokens = splitTokens(children, mode);
  const contentTokens = tokens.filter((t) => t.trim().length > 0);
  const totalContent = contentTokens.length;

  // Refs to each styled span, keyed by token index, for imperative updates.
  const spanRefs = useRef<Record<number, HTMLSpanElement | null>>({});

  // Precompute per-token thresholds (mirrors the original render math exactly).
  const meta: TokenMeta[] = [];
  {
    let contentIndex = 0;
    tokens.forEach((token, i) => {
      if (lineMode) {
        const threshold =
          totalContent > 1 ? at + (i / (totalContent - 1)) * span : at;
        meta.push({ token, styled: true, threshold });
        return;
      }
      const isWhitespace = token.trim().length === 0;
      if (isWhitespace) {
        meta.push({ token, styled: false, threshold: 0 });
        return;
      }
      const threshold =
        totalContent > 1 ? at + (contentIndex / (totalContent - 1)) * span : at;
      contentIndex++;
      meta.push({ token, styled: true, threshold });
    });
  }

  const controlled = progressProp != null;
  const initialProgress = controlled
    ? (progressProp as number)
    : pv
      ? pv.get()
      : 0;

  const tokenStyle = (m: TokenMeta, progress: number): CSSProperties => {
    const isRevealed = progress >= m.threshold;
    return {
      color: isRevealed ? color || undefined : dimColor || undefined,
      opacity: isRevealed ? 1 : 0.15,
      transition: "color 0.15s, opacity 0.15s",
    };
  };

  // Imperative fast path: mutate existing span styles on scroll, no re-render.
  useEffect(() => {
    if (reducedMotion || controlled || !pv) return;
    const apply = (progress: number) => {
      meta.forEach((m, i) => {
        if (!m.styled) return;
        const el = spanRefs.current[i];
        if (!el) return;
        const isRevealed = progress >= m.threshold;
        el.style.color = isRevealed ? color || "" : dimColor || "";
        el.style.opacity = isRevealed ? "1" : "0.15";
      });
    };
    apply(pv.get());
    return pv.on(apply);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pv, reducedMotion, controlled, at, span, color, dimColor, mode, children]);

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
        {meta.map((m, i) => (
          <React.Fragment key={i}>
            <span
              ref={(el) => {
                spanRefs.current[i] = el;
              }}
              style={tokenStyle(m, initialProgress)}
              data-testid="text-reveal-token"
            >
              {m.token}
            </span>
            {i < meta.length - 1 && <br />}
          </React.Fragment>
        ))}
      </div>
    );
  }

  return (
    <div className={className} data-testid="text-reveal">
      {meta.map((m, i) => {
        if (!m.styled) {
          return (
            <span key={i} data-testid="text-reveal-token">
              {m.token}
            </span>
          );
        }
        return (
          <span
            key={i}
            ref={(el) => {
              spanRefs.current[i] = el;
            }}
            style={tokenStyle(m, initialProgress)}
            data-testid="text-reveal-token"
          >
            {m.token}
          </span>
        );
      })}
    </div>
  );
}
