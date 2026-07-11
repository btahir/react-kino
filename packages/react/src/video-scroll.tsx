"use client";
import React, {
  useRef,
  useState,
  useEffect,
  type ReactNode,
  type CSSProperties,
} from "react";
import { calcSceneProgress, parseDuration } from "@react-kino/core";
import { useIsClient } from "./hooks/use-is-client";
import { useScrollTracker } from "./hooks/use-scroll-tracker";
import { usePrefersReducedMotion } from "./hooks/use-prefers-reduced-motion";

export interface VideoScrollProps {
  /** URL of the video file (MP4 recommended, no audio needed) */
  src: string;
  /** Scroll distance. Default: "300vh" */
  duration?: string;
  /** Whether to pin while scrubbing. Default: true */
  pin?: boolean;
  /** Overlay content rendered on top of the video */
  children?: ReactNode | ((progress: number) => ReactNode);
  className?: string;
  /** Poster image shown before video loads */
  poster?: string;
}

export function VideoScroll({
  src,
  duration = "300vh",
  pin = true,
  children,
  className,
  poster,
}: VideoScrollProps) {
  const spacerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const isClient = useIsClient();
  const reducedMotion = usePrefersReducedMotion();
  const { tracker, isOwned } = useScrollTracker();

  useEffect(() => {
    if (!isClient) return;

    setViewportHeight(window.innerHeight);

    const unsub = tracker.subscribe(({ scrollY, viewportHeight: vh }) => {
      // Re-derive from the freshly emitted viewport height on every tick
      // (rather than a value captured when the effect ran) so a window
      // resize keeps progress and the spacer height correct.
      setViewportHeight(vh);
      if (!spacerRef.current) return;
      const rect = spacerRef.current.getBoundingClientRect();
      const offsetTop = rect.top + scrollY;
      const durationPx = parseDuration(duration, vh);
      const effectiveDuration = pin ? Math.max(1, durationPx - vh) : durationPx;
      setProgress(calcSceneProgress(scrollY, offsetTop, effectiveDuration));
    });

    if (isOwned) tracker.start();
    return () => {
      unsub();
      if (isOwned) tracker.stop();
    };
  }, [isClient, duration, pin, tracker, isOwned]);

  // Scrub the video based on scroll progress
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isClient || reducedMotion) return;

    const dur = video.duration;
    if (!isFinite(dur) || dur === 0) return;

    video.currentTime = progress * dur;
  }, [progress, isClient, reducedMotion]);

  // The scrub effect above bails out when `video.duration` isn't known yet
  // (NaN/0 before metadata loads), and never re-runs once it becomes
  // available since `progress` may not change afterwards. Listen for
  // `loadedmetadata` so the video seeks to the correct frame as soon as its
  // duration is known, fixing first-frame sync on slow-loading videos.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isClient || reducedMotion) return;

    const handleLoadedMetadata = () => {
      const dur = video.duration;
      if (!isFinite(dur) || dur === 0) return;
      video.currentTime = progress * dur;
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    return () => video.removeEventListener("loadedmetadata", handleLoadedMetadata);
  }, [isClient, reducedMotion, progress]);

  const durationPx = isClient ? parseDuration(duration, viewportHeight) : 0;

  const spacerStyle: CSSProperties = {
    position: "relative",
    height: isClient ? `${durationPx}px` : duration,
  };

  const stickyStyle: CSSProperties = pin
    ? {
        position: "sticky",
        top: 0,
        height: "100vh",
        overflow: "hidden",
      }
    : {};

  const videoStyle: CSSProperties = {
    width: "100%",
    height: "100vh",
    objectFit: "cover",
    display: "block",
  };

  const overlayStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    pointerEvents: "auto",
  };

  const resolvedChildren =
    typeof children === "function" ? children(progress) : children;

  return (
    <div ref={spacerRef} style={spacerStyle} className={className}>
      <div style={stickyStyle}>
        <video
          ref={videoRef}
          src={src}
          preload="auto"
          muted
          playsInline
          autoPlay={false}
          poster={poster}
          style={videoStyle}
        />
        {resolvedChildren && <div style={overlayStyle}>{resolvedChildren}</div>}
      </div>
    </div>
  );
}
