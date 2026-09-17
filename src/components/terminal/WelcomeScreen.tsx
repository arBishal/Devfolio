import { COMMANDS } from "@/data/commandRegistry";
import { asciiArt } from "@/data/asciiArt";
import { FOCUS_CARET, FOCUS_TINT } from "@/utils/focusStyles";

const SORTED_COMMANDS = [...COMMANDS].sort((a, b) =>
  a.name.localeCompare(b.name),
);

interface WelcomeScreenProps {
  onCommandClick: (command: string) => void;
  isCommandsOpen: boolean;
  onToggleCommands: () => void;
  onTogglePointerDown: () => void;
  onToggleView: () => void;
}

export function WelcomeScreen({
  onCommandClick,
  isCommandsOpen,
  onToggleCommands,
  onTogglePointerDown,
  onToggleView,
}: WelcomeScreenProps) {
  return (
    <div className="border-b bg-t-bg border-t-border">
      <div className="p-4 space-y-3">
        <pre className="text-t-accent text-sm leading-tight">
          {asciiArt}
        </pre>
        <p className="text-t-muted text-sm">
          Switch to the{" "}
          <button
            onClick={onToggleView}
            className={`text-t-accent/75 hover:text-t-accent focus-visible:text-t-accent cursor-pointer transition-colors ${FOCUS_CARET}`}
          >
            Minimal Mode
          </button>{" "}
          if you're tired of looking into terminals. Cheers!
        </p>


        <div className="space-y-2">
          {/* "Available commands" row with inline chevron toggle */}
          <div className="flex items-center gap-2">
            <p className="text-t-warning">Available commands:</p>
            <button
              onClick={onToggleCommands}
              onPointerDown={onTogglePointerDown}
              className={`text-t-muted hover:opacity-80 focus-visible:opacity-100 transition-colors text-xs leading-none ${FOCUS_TINT}`}
              aria-label={isCommandsOpen ? "Collapse commands" : "Expand commands"}
              title={isCommandsOpen ? "Collapse commands" : "Expand commands"}
            >
              {isCommandsOpen ? "▲" : "▼"}
            </button>
          </div>

          {/*
            Commands grid — collapses when isCommandsOpen=false.
            Mobile focus collapse is handled in Terminal via state.
          */}
          <div
            className={`
              overflow-hidden transition-all duration-300 ease-in-out
              ${isCommandsOpen ? "max-h-96" : "max-h-0"}
            `}
          >
            <div className="grid grid-cols-2 lg:grid-cols-3">
              {SORTED_COMMANDS.map((cmd) => (
                <div key={cmd.name}>
                  <button
                    onClick={() => onCommandClick(cmd.name)}
                    className={`text-t-accent hover:opacity-80 hover:underline focus-visible:opacity-80 focus-visible:underline cursor-pointer transition-colors ${FOCUS_CARET}`}
                  >
                    {cmd.name}
                  </button>
                  <span className="text-t-header-text hidden sm:inline">
                    {" "}- {cmd.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
