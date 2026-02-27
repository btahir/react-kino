import { clamp } from "./clamp";

/**
 * Calculate scroll progress through a pinned scene (0->1).
 * @param scrollY - current window.scrollY
 * @param offsetTop - the spacer element's offsetTop from document top
 * @param duration - the spacer's height in pixels (scroll distance of scene)
 * @returns progress clamped to [0, 1]
 */
export function calcSceneProgress(
  scrollY: number,
  offsetTop: number,
  duration: number
): number {
  if (duration <= 0) return 0;
  return clamp((scrollY - offsetTop) / duration, 0, 1);
}

/**
 * Parse a CSS-like duration string into pixels.
 * Supports: "200vh", "300px", "2.5" (treated as vh)
 * @param duration - string like "200vh" or "1500px"
 * @param viewportHeight - window.innerHeight in pixels
 */
export function parseDuration(
  duration: string,
  viewportHeight: number
): number {
  const trimmed = duration.trim();

  if (trimmed.endsWith("px")) {
    return parseFloat(trimmed);
  }

  if (trimmed.endsWith("vh")) {
    return (parseFloat(trimmed) / 100) * viewportHeight;
  }

  // Bare number treated as vh
  const num = parseFloat(trimmed);
  if (!isNaN(num)) {
    return (num / 100) * viewportHeight;
  }

  return 0;
}

/**
 * Determine if a scene is currently active (in progress).
 */
export function isSceneActive(
  scrollY: number,
  offsetTop: number,
  duration: number
): boolean {
  return scrollY >= offsetTop && scrollY <= offsetTop + duration;
}
