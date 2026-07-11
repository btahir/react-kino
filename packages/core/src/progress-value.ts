/** Listener invoked whenever a {@link ProgressValue} changes. */
export type ProgressListener = (value: number) => void;

/**
 * A tiny, React-free "motion value" primitive.
 *
 * Holds a single numeric progress value (typically 0→1) and notifies
 * subscribers imperatively when it changes. This is the backbone of
 * react-kino's ref-based rendering engine: components subscribe with
 * {@link ProgressValue.on} and write to the DOM directly inside the callback,
 * bypassing React's render cycle entirely on the scroll hot path.
 *
 * Design notes:
 * - Zero dependencies (no React), so it can live in `@react-kino/core`.
 * - `set` is a no-op when the value is unchanged, so redundant scroll ticks
 *   never trigger DOM writes.
 * - Listeners are stored in a `Set`; `on` returns an unsubscribe function.
 */
export class ProgressValue {
  private value: number;
  private listeners: Set<ProgressListener> = new Set();

  constructor(initial: number = 0) {
    this.value = initial;
  }

  /** Read the current value synchronously. */
  get(): number {
    return this.value;
  }

  /**
   * Write a new value. Notifies all subscribers unless the value is
   * identical to the current one (avoids redundant DOM writes per frame).
   */
  set(next: number): void {
    if (next === this.value) return;
    this.value = next;
    // Iterate a snapshot so a listener unsubscribing during notification
    // doesn't skip a sibling listener (Set.forEach honors live deletions).
    for (const fn of Array.from(this.listeners)) {
      fn(next);
    }
  }

  /**
   * Subscribe to changes. The listener is NOT called immediately — read
   * {@link ProgressValue.get} first if you need to initialize.
   * @returns an unsubscribe function.
   */
  on(fn: ProgressListener): () => void {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  /** Number of active subscribers (useful for testing/diagnostics). */
  get listenerCount(): number {
    return this.listeners.size;
  }
}
