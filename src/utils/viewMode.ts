import { getStorageItem, setStorageItem } from "@/utils/storage";

export type ViewMode = "terminal" | "minimal";
export type DeviceType = "mobile" | "desktop";

const STORAGE_KEY = "viewMode";

/** How the startup view mode was resolved. */
export type ViewModeSource = "saved" | "device";

export interface InitialViewState {
  mode: ViewMode;
  device: DeviceType;
  source: ViewModeSource;
}

/**
 * ⚠️ TEMPORARY dev testing override.
 * Force a device class so you can preview each startup path without resizing:
 *   "mobile"  → minimal mode + spinner loader
 *   "desktop" → terminal mode + typewriter loader
 *   null      → real viewport detection
 * Set back to `null` (or delete) before shipping. Ignored under test so the
 * unit tests keep exercising real detection.
 */
const FORCE_DEVICE: DeviceType | null = null;

/**
 * Detects the device class from the viewport width, matching the `md`
 * breakpoint used by the minimal layout.
 */
/** The active forced device, or null when forcing is off (always off under test). */
function forcedDevice(): DeviceType | null {
  const mode = (import.meta as unknown as { env?: { MODE?: string } }).env?.MODE;
  return FORCE_DEVICE && mode !== "test" ? FORCE_DEVICE : null;
}

export function detectDevice(): DeviceType {
  return forcedDevice() ?? (window.matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop");
}

function readSavedMode(): ViewMode | null {
  const saved = getStorageItem(STORAGE_KEY);
  if (saved === "terminal" || saved === "minimal") return saved;
  return null;
}

/**
 * Resolves the full startup view state: the mode to load, the detected device,
 * and whether the mode came from a saved choice or fresh device detection.
 *
 * Precedence:
 *   1. An explicit, previously persisted user choice (see {@link persistViewMode}).
 *   2. Device auto-detection — mobile (< md breakpoint) → "minimal", else "terminal".
 *
 * The auto-detected result is intentionally NOT persisted, so detection re-runs
 * on every visit until the user makes an explicit choice.
 */
export function getInitialViewState(): InitialViewState {
  const device = detectDevice();
  // While forcing a device (dev testing), ignore any saved choice so the knob
  // drives the entire startup path.
  const saved = forcedDevice() ? null : readSavedMode();
  if (saved) {
    return { mode: saved, device, source: "saved" };
  }
  return {
    mode: device === "mobile" ? "minimal" : "terminal",
    device,
    source: "device",
  };
}

/**
 * Resolves the view mode to load on startup. Thin wrapper over
 * {@link getInitialViewState} for callers that only need the mode.
 */
export function getInitialViewMode(): ViewMode {
  return getInitialViewState().mode;
}

/**
 * Persists an explicit user choice so it sticks across visits. Write failures
 * (e.g. quota errors in private-browsing modes) are ignored.
 */
export function persistViewMode(mode: ViewMode): void {
  setStorageItem(STORAGE_KEY, mode);
}
