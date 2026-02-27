import type { ProgressData, ScrollSubscriber } from "./types";
import { clamp } from "./clamp";

export class ScrollTracker {
  private subscribers: Set<ScrollSubscriber> = new Set();
  private rafId: number | null = null;
  private lastScrollY: number = -1;
  private isRunning: boolean = false;
  private onScroll: () => void;

  constructor() {
    this.onScroll = () => {
      if (this.rafId === null) {
        this.rafId = requestAnimationFrame(() => this.tick());
      }
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
    // Emit initial state
    this.emit();
  }

  /** Stop listening and clean up. */
  stop(): void {
    if (!this.isRunning) return;
    this.isRunning = false;
    window.removeEventListener("scroll", this.onScroll);
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private tick(): void {
    this.rafId = null;
    const scrollY = window.scrollY;
    if (scrollY !== this.lastScrollY) {
      this.lastScrollY = scrollY;
      this.emit();
    }
  }

  private emit(): void {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    const scrollHeight = document.documentElement.scrollHeight;
    const maxScroll = scrollHeight - viewportHeight;
    const progress = maxScroll > 0 ? clamp(scrollY / maxScroll, 0, 1) : 0;

    const data: ProgressData = {
      scrollY,
      viewportHeight,
      scrollHeight,
      progress,
    };

    this.subscribers.forEach((fn) => fn(data));
  }
}
