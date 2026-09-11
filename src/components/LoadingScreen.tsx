import { useEffect, useMemo, useState } from "react";
import type { DeviceType, ViewMode, ViewModeSource } from "@/utils/viewMode";

interface LoadingScreenProps {
  mode: ViewMode;
  device: DeviceType;
  source: ViewModeSource;
  onComplete: () => void;
}

// How long the message stays fully visible before it fades out, and the
// fade-out duration itself (kept in sync with the `duration-300` class below).
const VISIBLE_MS = 1200;
const FADE_MS = 300;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * The first screen shown on startup. It announces how the initial view was
 * resolved (device detection or a saved choice) and previews the personality
 * of the view about to load: a typewriter for terminal mode, a spinner for
 * minimal mode.
 *
 * It self-schedules a single visible→fade→complete cycle and calls
 * {@link LoadingScreenProps.onComplete} when done.
 */
export function LoadingScreen({ mode, device, source, onComplete }: LoadingScreenProps) {
  const reduced = useMemo(prefersReducedMotion, []);

  const message = useMemo(() => {
    const prefix = source === "saved" ? "welcome back." : `${device} detected.`;
    return `${prefix} loading ${mode} mode...`;
  }, [source, device, mode]);

  const [fading, setFading] = useState(false);

  // Drive the visible → fade-out → complete lifecycle.
  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), VISIBLE_MS);
    const doneTimer = setTimeout(onComplete, VISIBLE_MS + FADE_MS);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-t-bg/60 text-t-text font-mono px-6 transition-opacity backdrop-blur-md duration-300 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      {mode === "terminal" ? (
        <TypewriterLine text={message} reduced={reduced} />
      ) : (
        <SpinnerLine text={message} reduced={reduced} />
      )}
    </div>
  );
}

const TYPE_DOTS = "...";

/**
 * Terminal preview: the sentence shows at once; only the trailing "..." types
 * out one dot at a time, with a blinking block cursor.
 */
function TypewriterLine({ text, reduced }: { text: string; reduced: boolean }) {
  // `text` always ends with TYPE_DOTS — split it so only the dots animate.
  const base = text.slice(0, -TYPE_DOTS.length);
  const [dots, setDots] = useState(reduced ? TYPE_DOTS.length : 0);

  useEffect(() => {
    if (reduced) return;
    // Spread the dots across the visible window for a paced "loading" feel.
    const step = Math.floor((VISIBLE_MS - 200) / (TYPE_DOTS.length + 1));
    const id = setInterval(() => {
      setDots((d) => {
        if (d >= TYPE_DOTS.length) {
          clearInterval(id);
          return d;
        }
        return d + 1;
      });
    }, step);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <p className="text-sm md:text-base">
      <span className="text-t-accent">guest@portfolio:~$</span>{" "}
      <span>{base}{TYPE_DOTS.slice(0, dots)}</span>
      <span className="text-t-accent animate-pulse">▊</span>
    </p>
  );
}

// Braille dot frames — the classic CLI "thinking" spinner.
const SPINNER_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

/** Minimal preview: full line at once with a terminal-style braille spinner. */
function SpinnerLine({ text, reduced }: { text: string; reduced: boolean }) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      setFrame((f) => (f + 1) % SPINNER_FRAMES.length);
    }, 80);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <p className="text-sm md:text-base flex items-center gap-3">
      <span className="text-t-accent w-[1ch] text-center" aria-hidden="true">
        {reduced ? "⠿" : SPINNER_FRAMES[frame]}
      </span>
      <span>{text}</span>
    </p>
  );
}
