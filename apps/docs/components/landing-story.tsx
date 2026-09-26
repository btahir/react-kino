"use client";
import { useRef, useState } from "react";
import { Story } from "react-kino/story";
import type { StoryDocument } from "react-kino/document";
const document: StoryDocument = {
  version: 1,
  title: "First light",
  scenes: [
    {
      id: "light",
      title: "A little perspective",
      duration: 250,
      layout: "stack",
      pin: true,
      background: "#1b2927",
      color: "#f7f1e4",
      layers: [
        {
          id: "title",
          kind: "heading",
          content: "A story worth slowing down for.",
          track: {
            start: 0,
            end: 0.6,
            from: { y: 55, opacity: 0.2 },
            to: { y: 0, opacity: 1 },
            easing: "ease-out",
          },
        },
        {
          id: "landscape",
          kind: "component",
          content: "Landscape",
          track: {
            start: 0.1,
            end: 0.9,
            from: { scale: 0.86, rotate: -3 },
            to: { scale: 1, rotate: 0 },
            easing: "ease-out",
          },
        },
      ],
    },
  ],
};
function Landscape() {
  return (
    <svg
      viewBox="0 0 800 250"
      role="img"
      aria-label="Original illustration of sunlight over layered hills"
      style={{ width: "100%", height: "auto", borderRadius: 12 }}
    >
      <defs>
        <linearGradient id="kino-sky" x2="0" y2="1">
          <stop stopColor="#d6c9a2" />
          <stop offset="1" stopColor="#eee7c8" />
        </linearGradient>
      </defs>
      <rect width="800" height="250" fill="url(#kino-sky)" />
      <circle cx="570" cy="65" r="39" fill="#fbf7d8" />
      <path
        d="M0 160 Q130 45 260 150 T540 110 T800 130 V250 H0"
        fill="#81978a"
      />
      <path d="M0 215 Q180 90 350 200 T800 165 V250 H0" fill="#426858" />
      <path d="M0 240 Q260 140 500 240 T800 190 V250 H0" fill="#1f463c" />
    </svg>
  );
}
export function LandingStory() {
  const [progress, setProgress] = useState(0.68);
  const root = useRef<HTMLDivElement>(null);
  return (
    <div className="kl-live">
      <div className="kl-live-header">
        <span>LIVE CANVAS / FIRST LIGHT</span>
        <span>{Math.round(progress * 100)}%</span>
      </div>
      <div ref={root} style={{ maxHeight: 650, overflow: "auto" }}>
        <Story
          document={document}
          components={{ Landscape: <Landscape /> }}
          root={root}
          progress={progress}
        />
      </div>
      <label className="kl-scrub">
        Drag to find the moment
        <input
          aria-label="Scrub the live story"
          type="range"
          min="0"
          max="1"
          step=".01"
          value={progress}
          onChange={(e) => setProgress(Number(e.target.value))}
        />
        <span>01 — 100</span>
      </label>
    </div>
  );
}
