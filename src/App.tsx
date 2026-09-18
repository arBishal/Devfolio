import { useState, Suspense, lazy } from "react";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useTheme } from "@/hooks/useTheme";
import { useActiveEffect } from "@/hooks/useActiveEffect";
import { getInitialViewState, persistViewMode } from "@/utils/viewMode";
import type { ViewMode } from "@/utils/viewMode";
import type { ThemeName } from "@/themes/themes";

// Lazy-load each view so only the active one is fetched on first load — the
// non-active view's code (e.g. the whole terminal command subsystem on mobile)
// is deferred until the user toggles to it.
const Terminal = lazy(() => import("@/components/terminal/Terminal").then(m => ({ default: m.Terminal })));
const MinimalView = lazy(() => import("@/components/minimal/MinimalView").then(m => ({ default: m.MinimalView })));

// Lazy-load heavy visual effects so they don't block the initial render
const FirefliesCanvas = lazy(() => import("@/components/FirefliesCanvas").then(m => ({ default: m.FirefliesCanvas })));
const MatrixRainCanvas = lazy(() => import("@/components/MatrixRainCanvas").then(m => ({ default: m.MatrixRainCanvas })));
const StarfieldCanvas = lazy(() => import("@/components/StarfieldCanvas").then(m => ({ default: m.StarfieldCanvas })));
const CatCompanion = lazy(() => import("@/components/CatCompanion").then(m => ({ default: m.CatCompanion })));

export type { ViewMode };

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
  // Resolve device/mode/source once, then show a brief loading screen that
  // previews the view being loaded before revealing it.
  const [initialView] = useState(getInitialViewState);
  const [viewMode, setViewMode] = useState<ViewMode>(initialView.mode);
  const [booting, setBooting] = useState(true);

  const toggleView = () =>
    setViewMode((v) => {
      const next = v === "terminal" ? "minimal" : "terminal";
      // Persist only the explicit user choice, so it sticks across visits.
      persistViewMode(next);
      return next;
    });

  // ── Shared theme & effect state ────────────────────────────────────────
  const { currentThemeName, currentThemeNameRef, setCurrentThemeName } = useTheme();
  const {
    currentEffect, currentEffectRef, setCurrentEffect, clearEffect,
    isMeowActive, setIsMeowActive,
  } = useActiveEffect();

  return (
    // data-theme on the root div so both views inherit the correct CSS variables
    <div data-theme={currentThemeName as ThemeName}>
      {/* ── Startup loading screen — overlays the view, then fades to reveal it ── */}
      {booting && (
        <LoadingScreen
          mode={initialView.mode}
          device={initialView.device}
          source={initialView.source}
          onComplete={() => setBooting(false)}
        />
      )}

      {/* ── Shared visual effect overlays — survive view switches ── */}
      <Suspense fallback={null}>
        {currentEffect === "fireflies" && <FirefliesCanvas onComplete={clearEffect} />}
        {currentEffect === "matrix-rain" && <MatrixRainCanvas onComplete={clearEffect} />}
        {currentEffect === "starfield" && <StarfieldCanvas onComplete={clearEffect} />}
        {isMeowActive && <CatCompanion />}
      </Suspense>

      {/* ── View routing (guarded so a throwing renderer degrades gracefully) ── */}
      {/* Suspense sits inside the boundary so a chunk-load failure degrades too;
          fallback is null because the booting LoadingScreen already covers the
          first paint while the active view's chunk streams in. */}
      <ErrorBoundary>
        <Suspense fallback={null}>
          {viewMode === "terminal" && (
            <Terminal
              currentThemeNameRef={currentThemeNameRef}
              setCurrentThemeName={setCurrentThemeName}
              currentEffectRef={currentEffectRef}
              setCurrentEffect={setCurrentEffect}
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
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
