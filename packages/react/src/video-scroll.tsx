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
import { useGatedScroll } from "./hooks/use-gated-scroll";
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
  const isClient = useIsClient();
  const reducedMotion = usePrefersReducedMotion();
  const { tracker, isOwned } = useScrollTracker();

  // Latest progress lives in a ref so the imperative scrub and the
  // loadedmetadata handler can read it without re-rendering.
  const progressRef = useRef(0);

  const isRenderProp = typeof children === "function";
  const isRenderPropRef = useRef(isRenderProp);
  isRenderPropRef.current = isRenderProp;
  const [renderProgress, setRenderProgress] = useState(0);

  const [viewportHeight, setViewportHeight] = useState(0);
  const lastVhRef = useRef(-1);

  useEffect(() => {
    if (!isClient) return;
    lastVhRef.current = window.innerHeight;
    setViewportHeight(window.innerHeight);
  }, [isClient]);

  const seek = () => {
    const video = videoRef.current;
    if (!video || reducedMotion) return;
    const dur = video.duration;
    if (!isFinite(dur) || dur === 0) return;
    video.currentTime = progressRef.current * dur;
  };

  useGatedScroll({
    ref: spacerRef,
    tracker,
    isOwned,
    enabled: isClient,
    deps: [isClient, duration, pin, reducedMotion],
    compute: ({ scrollY, viewportHeight: vh }) => {
      if (vh !== lastVhRef.current) {
        lastVhRef.current = vh;
        setViewportHeight(vh);
      }
      const spacer = spacerRef.current;
      if (!spacer) return;
      const rect = spacer.getBoundingClientRect();
      const offsetTop = rect.top + scrollY;
      const durationPx = parseDuration(duration, vh);
      const effectiveDuration = pin ? Math.max(1, durationPx - vh) : durationPx;
      const p = calcSceneProgress(scrollY, offsetTop, effectiveDuration);
      progressRef.current = p;
      if (isRenderPropRef.current) setRenderProgress(p);
      seek();
    },
  });

  // The scrub above bails until video.duration is known. Seek to the correct
  // frame as soon as metadata loads.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isClient || reducedMotion) return;
    const handleLoadedMetadata = () => {
      const dur = video.duration;
      if (!isFinite(dur) || dur === 0) return;
      video.currentTime = progressRef.current * dur;
    };
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    return () => video.removeEventListener("loadedmetadata", handleLoadedMetadata);
  }, [isClient, reducedMotion]);

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

  const resolvedChildren = isRenderProp
    ? (children as (progress: number) => ReactNode)(renderProgress)
    : children;

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
