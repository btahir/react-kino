import type { ProgressData, ScrollSubscriber } from "./types";
import { clamp } from "./clamp";

export class ScrollTracker {
  private subscribers: Set<ScrollSubscriber> = new Set();
  private rafId: number | null = null;
  private resizeTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private lastScrollY: number = -1;
  private lastViewportHeight: number = -1;
  private isRunning: boolean = false;
  private onScroll: () => void;
  private onResize: () => void;

  constructor() {
    this.onScroll = () => {
      if (this.rafId === null) {
        this.rafId = requestAnimationFrame(() => this.tick());
      }
    };

    this.onResize = () => {
      // Debounce bursts of resize events (window drags, mobile browser
      // URL-bar show/hide, etc.) then coalesce into a single rAF-scheduled
      // tick. Force-emit even if scrollY hasn't changed, since
      // viewport-dependent values (spacer heights, durations) may have.
      if (this.resizeTimeoutId !== null) {
        clearTimeout(this.resizeTimeoutId);
      }
      this.resizeTimeoutId = setTimeout(() => {
        this.resizeTimeoutId = null;
        if (this.rafId === null) {
          this.rafId = requestAnimationFrame(() => this.tick(true));
        }
      }, 100);
    };
  }

  /** Subscribe to scroll updates. Returns unsubscribe function. */
  subscribe(fn: ScrollSubscriber): () => void {
    this.subscribers.add(fn);
    return () => {
      this.subscribers.delete(fn);
    };
  }

  /** Start listening. Call this on client only (in useEffect). */
  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    window.addEventListener("scroll", this.onScroll, { passive: true });
    window.addEventListener("resize", this.onResize, { passive: true });
    // Emit initial state
    this.emit();
  }

  /** Stop listening and clean up. */
  stop(): void {
    if (!this.isRunning) return;
    this.isRunning = false;
    window.removeEventListener("scroll", this.onScroll);
    window.removeEventListener("resize", this.onResize);
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.resizeTimeoutId !== null) {
      clearTimeout(this.resizeTimeoutId);
      this.resizeTimeoutId = null;
    }
  }

  private tick(forceEmit: boolean = false): void {
    this.rafId = null;
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    if (
      forceEmit ||
      scrollY !== this.lastScrollY ||
      viewportHeight !== this.lastViewportHeight
    ) {
      this.lastScrollY = scrollY;
      this.lastViewportHeight = viewportHeight;
      this.emit();
    }
  }

  private emit(): void {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    const scrollHeight = document.documentElement.scrollHeight;
    const maxScroll = scrollHeight - viewportHeight;
    const progress = maxScroll > 0 ? clamp(scrollY / maxScroll, 0, 1) : 0;

    this.lastScrollY = scrollY;
    this.lastViewportHeight = viewportHeight;

    const data: ProgressData = {
      scrollY,
      viewportHeight,
      scrollHeight,
      progress,
    };

    this.subscribers.forEach((fn) => fn(data));
  }
}
