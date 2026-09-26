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
  /** Accessible description of the visual content. */
  label?: string;
  preload?: "none" | "metadata" | "auto";
  fallback?: ReactNode;
}

export function VideoScroll(props: VideoScrollProps) {
  return <VideoScrollMedia key={props.src} {...props} />;
}

function VideoScrollMedia({
  src,
  duration = "300vh",
  pin = true,
  children,
  className,
  poster,
  label = "Scroll-linked video",
  preload = "metadata",
  fallback,
}: VideoScrollProps) {
  const [mediaState, setMediaState] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const spacerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isClient = useIsClient();
  const reducedMotion = usePrefersReducedMotion();
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    setMediaState(
      video.error ? "error" : video.readyState >= 2 ? "ready" : "loading",
    );
  }, [src, isClient, reducedMotion]);
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
    if (!video || reducedMotion || video.seeking) return;
    const dur = video.duration;
    if (!isFinite(dur) || dur === 0) return;
    const nextTime = Math.min(
      Math.max(0, dur - 0.001),
      progressRef.current * dur,
    );
    if (Math.abs(video.currentTime - nextTime) > 0.016)
      video.currentTime = nextTime;
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
      const offsetTop = tracker.offsetTop(spacer, scrollY);
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
    return () =>
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
  }, [isClient, reducedMotion]);

  const durationPx = isClient ? parseDuration(duration, viewportHeight) : 0;

  const spacerStyle: CSSProperties = {
    position: "relative",
    height:
      reducedMotion || mediaState === "error"
        ? "auto"
        : isClient
          ? `${durationPx}px`
          : duration,
  };

  const stickyStyle: CSSProperties =
    pin && !reducedMotion && mediaState !== "error"
      ? {
          position: "sticky",
          top: 0,
          height: viewportHeight ? `${viewportHeight}px` : "100vh",
          overflow: "hidden",
        }
      : {};

  const videoStyle: CSSProperties = {
    width: "100%",
    height:
      reducedMotion || mediaState === "error"
        ? "auto"
        : viewportHeight
          ? `${viewportHeight}px`
          : "100vh",
    aspectRatio: "16 / 9",
    objectFit: "cover",
    display: "block",
  };

  const overlayStyle: CSSProperties = {
    position: reducedMotion || mediaState === "error" ? "relative" : "absolute",
    inset: 0,
    pointerEvents: "auto",
  };

  const resolvedChildren = isRenderProp
    ? (children as (progress: number) => ReactNode)(renderProgress)
    : children;

  return (
    <div ref={spacerRef} style={spacerStyle} className={className}>
      <div style={stickyStyle}>
        {mediaState === "error" ? (
          <div role="status" style={{ padding: 32, minHeight: 200 }}>
            {fallback ?? (
              <>
                <p>{label} is unavailable.</p>
                {poster && (
                  <img src={poster} alt={label} style={{ maxWidth: "100%" }} />
                )}
                <p>Continue reading the story below.</p>
              </>
            )}
          </div>
        ) : (
          <video
            key={src}
            ref={videoRef}
            src={isClient && !reducedMotion ? src : undefined}
            aria-label={label}
            preload={reducedMotion ? "none" : preload}
            onLoadedData={() => setMediaState("ready")}
            onError={() => setMediaState("error")}
            onSeeked={seek}
            muted
            playsInline
            autoPlay={false}
            poster={poster}
            style={videoStyle}
          />
        )}
        {!reducedMotion && mediaState === "loading" && (
          <span
            role="status"
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              background: "#171c20",
              color: "#fff",
              padding: "4px 8px",
              borderRadius: 4,
            }}
          >
            Loading video…
          </span>
        )}
        {resolvedChildren && <div style={overlayStyle}>{resolvedChildren}</div>}
      </div>
    </div>
  );
}
