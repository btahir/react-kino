"use client";
import React, { type CSSProperties } from "react";
import { useScrollProgress } from "./hooks/use-scroll-progress";

type ProgressType = "bar" | "dots" | "ring";
type ProgressPosition = "top" | "bottom" | "left" | "right";

interface ProgressProps {
  type?: ProgressType;
  position?: ProgressPosition;
  /** Color of the progress indicator */
  color?: string;
  /** Track/background color */
  trackColor?: string;
  /** Override progress value (0-1). If not provided, reads page scroll progress */
  progress?: number;
  /** Number of dots (only used for "dots" type, default: 5) */
  dotCount?: number;
  /** Size of the ring in px (only used for "ring" type, default: 48) */
  ringSize?: number;
  className?: string;
}

function BarProgress({
  progress,
  position,
  color,
  trackColor,
}: {
  progress: number;
  position: ProgressPosition;
  color: string;
  trackColor: string;
}) {
  const isHorizontal = position === "top" || position === "bottom";

  const trackStyle: CSSProperties = {
    position: "fixed",
    zIndex: 9999,
    backgroundColor: trackColor,
    ...(position === "top" && { top: 0, left: 0, right: 0, height: "3px" }),
    ...(position === "bottom" && { bottom: 0, left: 0, right: 0, height: "3px" }),
    ...(position === "left" && { top: 0, left: 0, bottom: 0, width: "3px" }),
    ...(position === "right" && { top: 0, right: 0, bottom: 0, width: "3px" }),
  };

  const fillStyle: CSSProperties = {
    backgroundColor: color,
    transition: "width 100ms linear, height 100ms linear",
    ...(isHorizontal
      ? { height: "100%", width: `${progress * 100}%` }
      : { width: "100%", height: `${progress * 100}%` }),
    ...(!isHorizontal && position === "right" ? {} : {}),
  };

  return (
    <div style={trackStyle}>
      <div style={fillStyle} />
    </div>
  );
}

function DotsProgress({
  progress,
  position,
  color,
  trackColor,
  dotCount,
}: {
  progress: number;
  position: ProgressPosition;
  color: string;
  trackColor: string;
  dotCount: number;
}) {
  const isVertical = position === "left" || position === "right";
  const activeIndex = Math.min(
    Math.floor(progress * dotCount),
    dotCount - 1
  );

  const containerStyle: CSSProperties = {
    position: "fixed",
    zIndex: 9999,
    display: "flex",
    flexDirection: isVertical ? "column" : "row",
    gap: "8px",
    alignItems: "center",
    ...(position === "top" && { top: "12px", left: "50%", transform: "translateX(-50%)" }),
    ...(position === "bottom" && { bottom: "12px", left: "50%", transform: "translateX(-50%)" }),
    ...(position === "left" && { left: "12px", top: "50%", transform: "translateY(-50%)" }),
    ...(position === "right" && { right: "12px", top: "50%", transform: "translateY(-50%)" }),
  };

  return (
    <div style={containerStyle}>
      {Array.from({ length: dotCount }, (_, i) => {
        const isActive = i <= activeIndex;
        const dotStyle: CSSProperties = {
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: isActive ? color : trackColor,
          transition: "background-color 200ms ease",
        };
        return <div key={i} style={dotStyle} />;
      })}
    </div>
  );
}

function RingProgress({
  progress,
  position,
  color,
  trackColor,
  ringSize,
}: {
  progress: number;
  position: ProgressPosition;
  color: string;
  trackColor: string;
  ringSize: number;
}) {
  const strokeWidth = 3;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  const containerStyle: CSSProperties = {
    position: "fixed",
    zIndex: 9999,
    ...(position === "top" && { top: "12px", right: "12px" }),
    ...(position === "bottom" && { bottom: "12px", right: "12px" }),
    ...(position === "left" && { top: "12px", left: "12px" }),
    ...(position === "right" && { top: "12px", right: "12px" }),
  };

  return (
    <div style={containerStyle}>
      <svg
        width={ringSize}
        height={ringSize}
        viewBox={`0 0 ${ringSize} ${ringSize}`}
        style={{ transform: "rotate(-90deg)" }}
      >
        <circle
          cx={ringSize / 2}
          cy={ringSize / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={ringSize / 2}
          cy={ringSize / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 100ms linear" }}
        />
      </svg>
    </div>
  );
}

export function Progress({
  type = "bar",
  position = "top",
  color = "#3b82f6",
  trackColor = "transparent",
  progress: progressProp,
  dotCount = 5,
  ringSize = 48,
  className,
}: ProgressProps) {
  const scrollProgress = useScrollProgress();
  const progress = progressProp ?? scrollProgress;

  const sharedProps = { progress, position, color, trackColor };

  return (
    <div className={className}>
      {type === "bar" && <BarProgress {...sharedProps} />}
      {type === "dots" && <DotsProgress {...sharedProps} dotCount={dotCount} />}
      {type === "ring" && <RingProgress {...sharedProps} ringSize={ringSize} />}
    </div>
  );
}
