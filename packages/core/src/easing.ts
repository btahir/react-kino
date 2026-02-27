import type { EasingFn } from "./types";

export function linear(t: number): number {
  return t;
}

export function easeIn(t: number): number {
  return t * t;
}

export function easeOut(t: number): number {
  return t * (2 - t);
}

export function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

export function easeInCubic(t: number): number {
  return t * t * t;
}

export function easeOutCubic(t: number): number {
  const t1 = t - 1;
  return t1 * t1 * t1 + 1;
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function easeInQuart(t: number): number {
  return t * t * t * t;
}

export function easeOutQuart(t: number): number {
  const t1 = t - 1;
  return 1 - t1 * t1 * t1 * t1;
}

export function easeInOutQuart(t: number): number {
  return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
}

export const EASINGS: Record<string, EasingFn> = {
  linear,
  "ease-in": easeIn,
  "ease-out": easeOut,
  "ease-in-out": easeInOut,
  "ease-in-cubic": easeInCubic,
  "ease-out-cubic": easeOutCubic,
  "ease-in-out-cubic": easeInOutCubic,
  "ease-in-quart": easeInQuart,
  "ease-out-quart": easeOutQuart,
  "ease-in-out-quart": easeInOutQuart,
};
