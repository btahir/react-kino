"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { ScrollTracker } from "@react-kino/core";

interface KinoContextValue {
  tracker: ScrollTracker;
}

const KinoContext = createContext<KinoContextValue | null>(null);

export function useKino(): KinoContextValue {
  const ctx = useContext(KinoContext);
  if (!ctx) throw new Error("<Kino> provider is required");
  return ctx;
}

/**
 * Non-throwing variant of {@link useKino}. Returns `null` instead of
 * throwing when used outside a `<Kino>` provider, so callers can branch on
 * the result rather than relying on try/catch around a hook call.
 */
export function useKinoOptional(): KinoContextValue | null {
  return useContext(KinoContext);
}

interface KinoProps {
  children: ReactNode;
}

export function Kino({ children }: KinoProps) {
  // Lazy init: useRef(new ScrollTracker()) would allocate a tracker on
  // every render even though only the first one is ever used. Passing a
  // function to useState-style lazy init isn't available for useRef, so we
  // guard the assignment instead.
  const trackerRef = useRef<ScrollTracker | null>(null);
  if (trackerRef.current === null) {
    trackerRef.current = new ScrollTracker();
  }

  useEffect(() => {
    const tracker = trackerRef.current!;
    tracker.start();
    return () => tracker.stop();
  }, []);

  return (
    <KinoContext.Provider value={{ tracker: trackerRef.current! }}>
      {children}
    </KinoContext.Provider>
  );
}

