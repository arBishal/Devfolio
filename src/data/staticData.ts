// ============================================================
// Static Data
// ============================================================
// Contains codebase constants that rarely need changing.
// ============================================================

// ----------------------------------------------------------
// Available Visual Effects
// ----------------------------------------------------------
export interface EffectInfo {
    name: string;
    status?: "done" | "planning";
}

// `as const satisfies` keeps the literal names (for EffectName) while still
// validating each entry against EffectInfo.
export const AVAILABLE_EFFECTS = [
    { name: "fireflies", status: "done" },
    { name: "matrix-rain", status: "done" },
    { name: "starfield", status: "done" },
] as const satisfies readonly EffectInfo[];

/** Union of valid effect names, derived from AVAILABLE_EFFECTS. */
export type EffectName = (typeof AVAILABLE_EFFECTS)[number]["name"];
