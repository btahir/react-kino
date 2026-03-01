"use client";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useSceneContext } from "./scene";

interface CompareSliderProps {
  before: ReactNode;
  after: ReactNode;
  /** If true, slider follows scroll progress (0-1) instead of drag */
  scrollDriven?: boolean;
  /** When scrollDriven, what progress value (0-1) to use. If inside Scene, reads from context. */
  progress?: number;
  /** Initial slider position 0-1 (default: 0.5) */
  initialPosition?: number;
  className?: string;
}

function useProgress(propProgress?: number): number | null {
  try {
    const ctx = useSceneContext();
    return propProgress ?? ctx.progress;
  } catch {
    return propProgress ?? null;
  }
}

export function CompareSlider({
  before,
  after,
  scrollDriven = false,
  progress: progressProp,
  initialPosition = 0.5,
  className,
}: CompareSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragPosition, setDragPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const sceneProgress = useProgress(progressProp);

  const position = scrollDriven && sceneProgress != null ? sceneProgress : dragPosition;

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (scrollDriven) return;
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      setIsDragging(true);
      const rect = containerRef.current!.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      setDragPosition(Math.max(0, Math.min(1, x)));
    },
    [scrollDriven]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging || scrollDriven) return;
      const rect = containerRef.current!.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      setDragPosition(Math.max(0, Math.min(1, x)));
    },
    [isDragging, scrollDriven]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const rightClip = 100 - position * 100;

  const containerStyle: CSSProperties = {
    position: "relative",
    overflow: "hidden",
    width: "100%",
    cursor: scrollDriven ? "default" : "ew-resize",
    userSelect: "none",
    touchAction: "pan-y",
  };

  const layerStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
  };

  const afterStyle: CSSProperties = {
    ...layerStyle,
    clipPath: `inset(0 ${rightClip}% 0 0)`,
  };

  const handleContainerStyle: CSSProperties = {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: `${position * 100}%`,
    transform: "translateX(-50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    pointerEvents: "none",
  };

  const lineStyle: CSSProperties = {
    width: "2px",
    flexGrow: 1,
    backgroundColor: "white",
    boxShadow: "0 0 4px rgba(0,0,0,0.5)",
  };

  const circleStyle: CSSProperties = {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "white",
    boxShadow: "0 0 6px rgba(0,0,0,0.4)",
    border: "2px solid rgba(0,0,0,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  };

  const arrowStyle: CSSProperties = {
    color: "#333",
    fontSize: "14px",
    fontWeight: "bold",
    lineHeight: 1,
  };

  return (
    <div
      ref={containerRef}
      className={className}
      style={containerStyle}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Before layer — position relative so it establishes container height */}
      <div style={{ ...layerStyle, position: "relative" }}>{before}</div>

      {/* After layer — clipped to reveal from left */}
      <div style={afterStyle}>{after}</div>

      {/* Handle */}
      <div style={handleContainerStyle}>
        <div style={lineStyle} />
        <div style={circleStyle}>
          <span style={arrowStyle}>&#x25C0;&#x25B6;</span>
        </div>
        <div style={lineStyle} />
      </div>
    </div>
  );
}
