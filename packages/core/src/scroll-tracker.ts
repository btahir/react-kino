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
  private resizeObserver: ResizeObserver | null = null;
  private listeningRoot: HTMLElement | Window | null = null;

  getRoot(): HTMLElement | null {
    return this.resolveRoot();
  }

  snapshot(): ProgressData {
    const root = this.getRoot();
    const scrollY = root ? root.scrollTop : window.scrollY;
    const viewportHeight = root ? root.clientHeight : window.innerHeight;
    const scrollHeight = root
      ? root.scrollHeight
      : document.documentElement.scrollHeight;
    return {
      scrollY,
      viewportHeight,
      scrollHeight,
      progress:
        scrollHeight > viewportHeight
          ? clamp(scrollY / (scrollHeight - viewportHeight), 0, 1)
          : 0,
    };
  }

  offsetTop(element: HTMLElement, scrollY = this.snapshot().scrollY): number {
    const root = this.getRoot();
    return (
      element.getBoundingClientRect().top -
      (root ? root.getBoundingClientRect().top + root.clientTop : 0) +
      scrollY
    );
  }

  /** Invalidate after fonts, images, or application layout changes. */
  refresh(): void {
    if (this.isRunning) this.emit();
  }

  constructor(
    private readonly resolveRoot: () => HTMLElement | null = () => null,
  ) {
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
    this.listeningRoot = this.getRoot() ?? window;
    this.listeningRoot.addEventListener("scroll", this.onScroll, {
      passive: true,
    });
    if (typeof ResizeObserver !== "undefined") {
      this.resizeObserver = new ResizeObserver(this.onResize);
      this.resizeObserver.observe(this.getRoot() ?? document.documentElement);
    }
    window.addEventListener("resize", this.onResize, { passive: true });
    // Emit initial state
    this.emit();
  }

  /** Stop listening and clean up. */
  stop(): void {
    if (!this.isRunning) return;
    this.isRunning = false;
    this.listeningRoot?.removeEventListener("scroll", this.onScroll);
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.listeningRoot = null;
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
    const { scrollY, viewportHeight } = this.snapshot();
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
    const data = this.snapshot();
    this.lastScrollY = data.scrollY;
    this.lastViewportHeight = data.viewportHeight;
    this.subscribers.forEach((fn) => fn(data));
  }
}
