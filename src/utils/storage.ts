/**
 * Safe wrappers around `localStorage`.
 *
 * Access to `localStorage` can throw — it may be disabled, blocked, or (in some
 * private-browsing modes) present but quota-limited. These helpers swallow those
 * failures so persistence stays best-effort and never crashes the app.
 */

/** Reads a key, returning `null` if storage is unavailable or throws. */
export function getStorageItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** Writes a key, silently ignoring failures (quota, disabled storage, etc.). */
export function setStorageItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Best-effort persistence — ignore write failures.
  }
}
