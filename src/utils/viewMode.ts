export type ViewMode = "terminal" | "minimal";

const STORAGE_KEY = "viewMode";

/**
 * Resolves the view mode to load on startup.
 *
 * Precedence:
 *   1. An explicit, previously persisted user choice (see {@link persistViewMode}).
 *   2. Device auto-detection — mobile (< md breakpoint) → "minimal", else "terminal".
 *
 * The auto-detected result is intentionally NOT persisted, so detection re-runs
 * on every visit until the user makes an explicit choice.
 */
export function getInitialViewMode(): ViewMode {
  let saved: string | null = null;
  try {
    saved = localStorage.getItem(STORAGE_KEY);
  } catch {
    // localStorage may be unavailable (e.g. some private-browsing modes)
  }
  if (saved === "terminal" || saved === "minimal") {
    return saved;
  }

  // Match the `md` breakpoint used by the minimal layout.
  return window.matchMedia("(max-width: 767px)").matches ? "minimal" : "terminal";
}

/**
 * Persists an explicit user choice so it sticks across visits. Write failures
 * (e.g. quota errors in private-browsing modes) are ignored.
 */
export function persistViewMode(mode: ViewMode): void {
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // Ignore write failures
  }
}
