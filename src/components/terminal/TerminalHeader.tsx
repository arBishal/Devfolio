import { portfolioData } from "@/data/portfolioData";

interface TerminalHeaderProps {
  onClose: () => void;
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

export function TerminalHeader({ onClose }: TerminalHeaderProps) {
  return (
    <div className="px-4 pt-2 pb-1 flex-shrink-0 bg-t-header-bg border-b border-t-border relative">
      {/* Row 1 — always: title left, close right */}
      <div className="flex items-center justify-between">
        <div className="text-t-header-text text-sm">
          {portfolioData.personal.fullName}&apos;s Terminal Portfolio
        </div>

        <button
          onClick={onClose}
          className="text-t-muted hover:text-red-400 transition-colors"
          aria-label="Close terminal"
        >
          {closeIcon}
        </button>
      </div>

    </div>
  );
}
