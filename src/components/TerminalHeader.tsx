import { portfolioData } from "@/data/portfolioData";

interface TerminalHeaderProps {
  onClose: () => void;
  onToggleView: () => void;
}

// Hoisted static JSX — avoids re-creation on every render (rendering-hoist-jsx)
const closeIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export function TerminalHeader({ onClose, onToggleView }: TerminalHeaderProps) {
  return (
    <div className="px-4 pt-2 pb-1 flex-shrink-0 bg-t-header-bg border-b border-t-border relative">
      {/* Row 1 — always: title left, close right */}
      <div className="flex items-center justify-between">
        <div className="text-t-header-text text-sm">
          {portfolioData.personal.fullName}&apos;s Terminal Portfolio
        </div>

        {/* Desktop: centered toggle lives here via absolute positioning */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2">
          <button
            onClick={onToggleView}
            className="text-t-muted hover:text-t-text transition-colors text-xs cursor-pointer"
            aria-label="Switch to minimal view"
            title="Switch to minimal view"
          >
            switch to minimal mode
          </button>
        </div>

        <button
          onClick={onClose}
          className="text-t-muted hover:text-red-400 transition-colors"
          aria-label="Close terminal"
        >
          {closeIcon}
        </button>
      </div>

      {/* Row 2 — mobile only: toggle below the title row */}
      <div className="flex justify-start pb-1 md:hidden">
        <button
          onClick={onToggleView}
          className="text-t-muted hover:text-t-text transition-colors text-xs cursor-pointer"
          aria-label="Switch to minimal view"
          title="Switch to minimal view"
        >
          switch to minimal mode
        </button>
      </div>
    </div>
  );
}
