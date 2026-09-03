interface TerminalFooterProps {
  onToggleView: () => void;
}

export function TerminalFooter({ onToggleView }: TerminalFooterProps) {
  return (
    <footer className="px-4 py-2 text-t-muted text-sm bg-t-bg border-t border-t-border flex-shrink-0 flex items-center justify-between">
      <p className="hidden md:block">
        Tip: ↑/↓ to navigate history • Tab for autocomplete
      </p>
      <p className="hidden">Tip: Double-tap for autocomplete</p>
      <button
        onClick={onToggleView}
        className="flex items-center gap-1.5 text-t-muted hover:text-t-accent transition-colors text-sm cursor-pointer ml-auto md:ml-0"
        aria-label="Switch to minimal mode"
        title="Switch to minimal mode"
      >
        <svg width="18" height="18" viewBox="4 4 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="15" x2="16" y2="15" />
          <line x1="9" y1="9" x2="9" y2="9" strokeWidth="3" strokeLinecap="round" />
          <line x1="15" y1="9" x2="15" y2="9" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <span>switch to minimal mode</span>
      </button>
    </footer>
  );
}
