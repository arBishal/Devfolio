import { useState, useEffect, Suspense, lazy } from "react";
import { Terminal } from "@/components/terminal/Terminal";
import { MinimalView } from "@/components/minimal/MinimalView";
import { useTheme } from "@/hooks/useTheme";
import { useActiveEffect } from "@/hooks/useActiveEffect";
import type { ThemeName } from "@/themes/themes";

// Lazy-load heavy visual effects so they don't block the initial render
const FirefliesCanvas = lazy(() => import("@/components/FirefliesCanvas").then(m => ({ default: m.FirefliesCanvas })));
const MatrixRainCanvas = lazy(() => import("@/components/MatrixRainCanvas").then(m => ({ default: m.MatrixRainCanvas })));
const StarfieldCanvas = lazy(() => import("@/components/StarfieldCanvas").then(m => ({ default: m.StarfieldCanvas })));
const CatCompanion = lazy(() => import("@/components/CatCompanion").then(m => ({ default: m.CatCompanion })));

export type ViewMode = "terminal" | "minimal";

/**
 * App is the top-level orchestrator. It owns all state that must persist
 * across view switches (theme, active effect, meow, and view mode), then
 * passes it down to whichever view is currently active.
 *
 * Visual effect overlays (canvas animations, CatCompanion) are rendered here
 * so they survive a Terminal ↔ Minimal toggle without unmounting.
 */
export default function App() {
  // ── View mode ─────────────────────────────────────────────────────────
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const savedViewMode = localStorage.getItem("viewMode");
    if (savedViewMode === "terminal" || savedViewMode === "minimal") {
      return savedViewMode;
    }

    // Match the `md` breakpoint used by the minimal layout.
    return window.matchMedia("(max-width: 767px)").matches
      ? "minimal"
      : "terminal";
  });

  useEffect(() => {
    localStorage.setItem("viewMode", viewMode);
  }, [viewMode]);

  const toggleView = () =>
    setViewMode((v) => (v === "terminal" ? "minimal" : "terminal"));

  // ── Shared theme & effect state ────────────────────────────────────────
  const { currentThemeName, currentThemeNameRef, setCurrentThemeName } = useTheme();
  const {
    currentEffect, currentEffectRef, setCurrentEffect, clearEffect,
    isMeowActive, setIsMeowActive,
  } = useActiveEffect();

  return (
    // data-theme on the root div so both views inherit the correct CSS variables
    <div data-theme={currentThemeName as ThemeName}>
      {/* ── Shared visual effect overlays — survive view switches ── */}
      <Suspense fallback={null}>
        {currentEffect === "fireflies" && <FirefliesCanvas onComplete={clearEffect} />}
        {currentEffect === "matrix-rain" && <MatrixRainCanvas onComplete={clearEffect} />}
        {currentEffect === "starfield" && <StarfieldCanvas onComplete={clearEffect} />}
        {isMeowActive && <CatCompanion />}
      </Suspense>

      {/* ── View routing ──────────────────────────────────────────── */}
      {viewMode === "terminal" && (
        <Terminal
          currentThemeName={currentThemeName}
          currentThemeNameRef={currentThemeNameRef}
          setCurrentThemeName={setCurrentThemeName}
          currentEffect={currentEffect}
          currentEffectRef={currentEffectRef}
          setCurrentEffect={setCurrentEffect}
          clearEffect={clearEffect}
          isMeowActive={isMeowActive}
          setIsMeowActive={setIsMeowActive}
          onToggleView={toggleView}
        />
      )}

      {viewMode === "minimal" && (
        <MinimalView
          currentThemeName={currentThemeName}
          setCurrentThemeName={setCurrentThemeName}
          currentEffect={currentEffect}
          setCurrentEffect={setCurrentEffect}
          clearEffect={clearEffect}
          isMeowActive={isMeowActive}
          setIsMeowActive={setIsMeowActive}
          onToggleView={toggleView}
        />
      )}
    </div>
  );
}
