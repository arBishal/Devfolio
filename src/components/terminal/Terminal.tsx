import { useState, useEffect, useRef, useCallback } from "react";
import { CommandLine } from "@/components/terminal/CommandLine";
import { TerminalOutput } from "@/components/terminal/TerminalOutput";
import { TerminalHeader } from "@/components/terminal/TerminalHeader";
import { WelcomeScreen } from "@/components/terminal/WelcomeScreen";
import { useCommandExecutor } from "@/hooks/useCommandExecutor";
import type { ThemeName } from "@/themes/themes";

interface TerminalProps {
  currentThemeName: ThemeName;
  currentThemeNameRef: React.MutableRefObject<ThemeName>;
  setCurrentThemeName: React.Dispatch<React.SetStateAction<ThemeName>>;
  currentEffect: string | null;
  currentEffectRef: React.MutableRefObject<string | null>;
  setCurrentEffect: React.Dispatch<React.SetStateAction<string | null>>;
  clearEffect: () => void;
  isMeowActive: boolean;
  setIsMeowActive: React.Dispatch<React.SetStateAction<boolean>>;
  onToggleView: () => void;
}

/**
 * Root terminal component — owns layout, scroll-to-latest logic,
 * and mobile focus/collapse handling. All theme/effect/meow state
 * is owned by App.tsx and passed in as props so it persists across
 * Terminal ↔ Minimal view switches.
 */
export function Terminal({
  currentThemeName,
  currentThemeNameRef,
  setCurrentThemeName,
  currentEffect,
  currentEffectRef,
  setCurrentEffect,
  clearEffect,
  isMeowActive,
  setIsMeowActive,
  onToggleView,
}: TerminalProps) {
  const [isClosed, setIsClosed] = useState(false);
  const [isCommandsOpen, setIsCommandsOpen] = useState(true);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Saves the commands open-state before a touch-focus collapse so we can restore it on blur
  const prevCommandsOpenRef = useRef(true);
  // Set on pointerdown of the chevron so blur handler knows to skip the restore
  const togglePressedRef = useRef(false);
  // Ref mirror of isCommandsOpen so handleFocusChange never needs it as a dep
  const isCommandsOpenRef = useRef(isCommandsOpen);

  useEffect(() => {
    isCommandsOpenRef.current = isCommandsOpen;
  }, [isCommandsOpen]);

  const {
    history,
    commandHistory,
    historyIndex,
    setHistoryIndex,
    executeCommand,
  } = useCommandExecutor({
    setIsCommandsOpen,
    currentThemeName,
    currentThemeNameRef,
    setCurrentThemeName,
    currentEffect,
    currentEffectRef,
    setCurrentEffect,
    clearEffect,
    isMeowActive,
    setIsMeowActive,
  });

  useEffect(() => {
    const pane = terminalRef.current;
    if (!pane) return;
    // Scroll the last typed command to the top of the pane so the user
    // reads output from its beginning. Uses [data-cmd] markers set by TerminalOutput.
    const cmds = pane.querySelectorAll("[data-cmd]");
    if (cmds.length > 0) {
      cmds[cmds.length - 1].scrollIntoView({ block: "start", behavior: "smooth" });
    } else {
      pane.scrollTop = 0;
    }
  }, [history]);

  // On touch devices (mobile/tablet), collapse commands on input focus and restore on blur.
  const handleFocusChange = useCallback((focused: boolean) => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (!isTouch) return;
    if (focused) {
      prevCommandsOpenRef.current = isCommandsOpenRef.current;
      setIsCommandsOpen(false);
    } else {
      // If the chevron was pressed (pointerdown fired before blur),
      // skip the restore and let the click handler do the toggle instead.
      if (togglePressedRef.current) {
        togglePressedRef.current = false;
        return;
      }
      setIsCommandsOpen(prevCommandsOpenRef.current);
    }
  }, []); // stable — reads isCommandsOpen via ref, no closure capture

  const handleTogglePointerDown = useCallback(() => {
    togglePressedRef.current = true;
  }, []);

  if (isClosed) {
    return (
      <div
        className="bg-t-bg text-t-text font-mono min-h-dvh h-dvh flex items-center justify-center"
      >
        <div className="text-center space-y-4">
          <p className="text-t-text text-xl">Terminal closed</p>
          <button
            onClick={() => setIsClosed(false)}
            className="px-4 py-2 bg-t-accent text-t-btn-text rounded hover:opacity-80 transition-colors"
          >
            Reopen Terminal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-t-bg text-t-text font-mono min-h-dvh">
      <div className="h-dvh flex flex-col">
        <TerminalHeader onClose={() => setIsClosed(true)} />
        <WelcomeScreen
          onCommandClick={executeCommand}
          isCommandsOpen={isCommandsOpen}
          onToggleCommands={() => setIsCommandsOpen((v) => !v)}
          onTogglePointerDown={handleTogglePointerDown}
        />

        {/* Scrollable terminal body */}
        <div
          ref={terminalRef}
          role="log"
          aria-label="Terminal output"
          aria-live="polite"
          className="p-4 flex-1 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-black bg-t-bg"
        >
          <TerminalOutput history={history} />
          <CommandLine
            onExecute={executeCommand}
            commandHistory={commandHistory}
            historyIndex={historyIndex}
            setHistoryIndex={setHistoryIndex}
            onFocusChange={handleFocusChange}
          />
        </div>

        {/* Footer */}
        <div className="px-4 py-2 text-t-muted text-sm bg-t-bg border-t border-t-border flex-shrink-0 flex items-center justify-between">
          {/* Desktop tip — hidden on mobile */}
          <p className="hidden md:block">
            Tip: ↑/↓ to navigate history • Tab for autocomplete
          </p>
          {/* Touch tip — hidden on mobile, hidden on desktop */}
          <p className="hidden">
            Tip: Double-tap for autocomplete
          </p>
          {/* Switch to stoick mode — icon + label on all sizes */}
          <button
            onClick={onToggleView}
            className="flex items-center gap-1.5 text-t-muted hover:text-t-text transition-colors text-sm cursor-pointer ml-auto md:ml-0"
            aria-label="Switch to stoick mode"
            title="Switch to stoick mode"
          >
            <svg width="18" height="18" viewBox="4 4 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="15" x2="16" y2="15" />
              <line x1="9" y1="9" x2="9" y2="9" strokeWidth="3" strokeLinecap="round" />
              <line x1="15" y1="9" x2="15" y2="9" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <span>switch to stoick mode</span>
          </button>
        </div>
      </div>
    </div>
  );
}
