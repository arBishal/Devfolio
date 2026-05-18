import { themeNames } from "@/themes/themes";
import { AVAILABLE_EFFECTS } from "@/data/staticData";
import { portfolioData } from "@/data/portfolioData";
import { useState } from "react";
import type { ThemeName } from "@/themes/themes";
import type { Dispatch, SetStateAction } from "react";

// ── Section nav config ────────────────────────────────────────────────────────
const NAV_SECTIONS = [
  {
    id: "about",
    label: "About",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
  {
    id: "skills",
    label: "Skills",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    id: "projects",
    label: "Projects",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    id: "experience",
    label: "Experience",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      </svg>
    ),
  },
  {
    id: "contact",
    label: "Contact",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16v13H4z" /><polyline points="22,4 12,13 2,4" />
      </svg>
    ),
  },
  {
    id: "blog",
    label: "Blog",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" /><path d="M16.5 3.5l4 4L7 21l-4 1 1-4Z" />
      </svg>
    ),
  },
];

interface MinimalNavProps {
  currentThemeName: ThemeName;
  setCurrentThemeName: Dispatch<SetStateAction<ThemeName>>;
  currentEffect: string | null;
  setCurrentEffect: Dispatch<SetStateAction<string | null>>;
  clearEffect: () => void;
  onToggleView: () => void;
}

/**
 * Sidebar navigation for the minimal portfolio view.
 *
 * Desktop (md+): fixed-width left sidebar with name, section links (icon + text),
 *   theme/effect pickers, and a "terminal mode" link at the bottom.
 * Mobile: sidebar is hidden off-screen; a chevron tab fixed at the left edge (vertically
 *   centered) peeks out to invite the user to open it.
 */
export function MinimalNav({
  currentThemeName,
  setCurrentThemeName,
  currentEffect,
  setCurrentEffect,
  clearEffect,
  onToggleView,
}: MinimalNavProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleEffectChange = (value: string) => {
    if (value === "") clearEffect();
    else setCurrentEffect(value);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ── Sidebar (Desktop fixed, Mobile slide-out) ──────────────────────── */}
      <aside
        className={`
          flex flex-col fixed top-0 left-0 h-dvh w-1/2 px-[5vw] pt-16 pb-8 md:px-8 border-r border-t-border bg-t-bg/60 backdrop-blur-md z-50
          transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-[90%] md:translate-x-0"}
          md:w-56 lg:w-64
        `}
      >
        {/* Drawer handle — mobile only, protrudes from right edge of sidebar */}
        <button
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className={`
            md:hidden absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2
            w-8 h-8
            border border-t-border
            bg-t-bg/80 backdrop-blur-sm
            rounded-full
            flex items-center justify-center
            text-t-muted hover:text-t-text
            cursor-pointer
          `}
          aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className={`transition-transform duration-300 ${isMobileMenuOpen ? "rotate-180" : ""}`}
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {/* Section links */}
        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-1 lg:space-y-2">
            {NAV_SECTIONS.map(({ id, label, icon }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-2 text-sm text-t-muted hover:text-t-text transition-colors"
                >
                  <span className="flex-shrink-0 opacity-70">{icon}</span>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Controls at bottom */}
        <div className="py-6 space-y-4">

          {/* Switch to terminal view */}
          <button
            onClick={onToggleView}
            className="w-full flex items-center gap-2 text-sm text-t-muted hover:text-t-text transition-colors cursor-pointer"
            aria-label="Switch to terminal view"
          >
            Terminal View
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" />
            </svg>
          </button>

          {/* Theme picker */}
          <div className="space-y-1">
            <p className="text-t-muted text-xs lg:text-sm opacity-60">theme</p>
            <select
              value={currentThemeName}
              onChange={(e) => { setCurrentThemeName(e.target.value as ThemeName); setIsMobileMenuOpen(false); }}
              className="w-full bg-transparent text-t-muted text-sm border-b border-t-border px-2 py-1 cursor-pointer hover:text-t-text transition-colors focus:outline-none"
            >
              {themeNames.map((t) => (
                <option key={t} value={t} className="bg-t-bg text-t-text">{t}</option>
              ))}
            </select>
          </div>

          {/* Effect picker */}
          <div className="space-y-1.5">
            <p className="text-t-muted text-xs lg:text-sm opacity-60">effect</p>
            <select
              value={currentEffect ?? ""}
              onChange={(e) => handleEffectChange(e.target.value)}
              className="w-full bg-transparent text-t-muted text-sm border-b border-t-border px-2 py-1 cursor-pointer hover:text-t-text transition-colors focus:outline-none"
            >
              <option value="" className="bg-t-bg text-t-text">none</option>
              {AVAILABLE_EFFECTS.map((e) => (
                <option key={e.name} value={e.name} className="bg-t-bg text-t-text">{e.name}</option>
              ))}
            </select>
          </div>

        </div>
      </aside>

    </>
  );
}
