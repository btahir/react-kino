import { clamp } from "./clamp";

/**
 * A single edge reference. Named edges map to fractions of an element or the
 * viewport: `"start"` → 0, `"center"` → 0.5, `"end"` → 1. A bare number is
 * treated as a fraction (0→1). A percentage string like `"50%"` is also
 * accepted.
 */
export type OffsetEdge = "start" | "center" | "end" | number | string;

/**
 * An offset entry describing when a point on the tracked element aligns with a
 * point in the viewport. Either a Motion-style string like `"start end"`
 * (element-edge then viewport-edge) or an explicit `[elementEdge, viewportEdge]`
 * tuple.
 */
export type OffsetEntry = string | [OffsetEdge, OffsetEdge];

/** Geometry needed to resolve element-relative scroll progress. */
export interface ElementOffsetInfo {
  /** Element's top edge in document coordinates (rect.top + scrollY). */
  elementTop: number;
  /** Element's height in pixels. */
  elementHeight: number;
  /** Viewport height in pixels. */
  viewportHeight: number;
  /** Current window scroll position. */
  scrollY: number;
}

/**
 * The default offset used for element-relative reveals: progress is 0 when the
 * element's top edge reaches the bottom of the viewport (it starts entering)
 * and 1 when the element's bottom edge reaches the top of the viewport (it has
 * fully passed through). Matches Motion's `useScroll` default for elements.
 */
export const DEFAULT_ELEMENT_OFFSET: [OffsetEntry, OffsetEntry] = [
  "start end",
  "end start",
];

/** Convert a single named/numeric/percentage edge token into a fraction. */
export function edgeToFraction(token: OffsetEdge): number {
  if (typeof token === "number") return token;
  const t = token.trim().toLowerCase();
  if (t === "start") return 0;
  if (t === "center" || t === "middle") return 0.5;
  if (t === "end") return 1;
  if (t.endsWith("%")) {
    const pct = parseFloat(t);
    return isNaN(pct) ? 0 : pct / 100;
  }
  const num = parseFloat(t);
  return isNaN(num) ? 0 : num;
}

/**
 * Parse an offset entry into `[elementEdgeFraction, viewportEdgeFraction]`.
 * A string like `"start end"` is split on whitespace; a tuple is mapped
 * element-by-element. A single token (e.g. `"center"`) is treated as applying
 * to both the element and the viewport.
 */
export function parseOffsetEntry(entry: OffsetEntry): [number, number] {
  if (Array.isArray(entry)) {
    return [edgeToFraction(entry[0]), edgeToFraction(entry[1])];
  }
  const parts = entry.trim().split(/\s+/);
  if (parts.length === 1) {
    const f = edgeToFraction(parts[0]);
    return [f, f];
  }
  return [edgeToFraction(parts[0]), edgeToFraction(parts[1])];
}

/**
 * Resolve the scroll position (window.scrollY) at which a given offset entry is
 * satisfied — i.e. where the element edge aligns with the viewport edge.
 *
 * elementEdgePos(doc) = elementTop + elementEdge * elementHeight
 * viewportEdgePos(doc) = scrollY + viewportEdge * viewportHeight
 * They coincide when:
 *   scrollY = elementTop + elementEdge*elementHeight - viewportEdge*viewportHeight
 */
export function resolveOffsetScrollY(
  entry: OffsetEntry,
  info: Pick<ElementOffsetInfo, "elementTop" | "elementHeight" | "viewportHeight">
): number {
  const [elementEdge, viewportEdge] = parseOffsetEntry(entry);
  return (
    info.elementTop +
    elementEdge * info.elementHeight -
    viewportEdge * info.viewportHeight
  );
}

/**
 * Compute element-relative scroll progress in [0, 1].
 *
 * Each offset entry maps to a scroll position; progress is 0 at the first
 * entry, 1 at the last, and piecewise-linear between intermediate entries
 * (matching Motion's multi-offset behavior). Pure and framework-agnostic so it
 * can be unit-tested in isolation.
 */
export function calcElementProgress(
  offsets: readonly OffsetEntry[],
  info: ElementOffsetInfo
): number {
  const n = offsets.length;
  if (n === 0) return 0;

  const targets = offsets.map((entry) => resolveOffsetScrollY(entry, info));

  if (n === 1) {
    return info.scrollY >= targets[0] ? 1 : 0;
  }

  const first = targets[0];
  const last = targets[n - 1];
  const { scrollY } = info;

  if (scrollY <= first) return 0;
  if (scrollY >= last) return 1;

  for (let i = 0; i < n - 1; i++) {
    const a = targets[i];
    const b = targets[i + 1];
    if (scrollY >= a && scrollY <= b) {
      const localT = b === a ? 0 : (scrollY - a) / (b - a);
      return clamp((i + localT) / (n - 1), 0, 1);
    }
  }

  return 1;
}
