import { useCallback } from "react";
import type { ThemeName } from "@/themes/themes";
import { HANDLERS } from "@/data/commandRegistry";
import { useTerminalHistory } from "./useTerminalHistory";
import type { OutputLine, CommandContext } from "@/types/terminal";
import type { EffectName } from "@/data/staticData";

// Hoisted regex — avoids recreation on every command execution
const WHITESPACE_RE = /\s+/;

// Maximum number of entries kept in the output history and command history.
// Oldest entries are trimmed when the limit is exceeded.
const MAX_HISTORY = 400;

// Appends an item to a list, trimming the oldest entries past MAX_HISTORY.
function appendCapped<T>(list: T[], item: T): T[] {
  const next = [...list, item];
  return next.length > MAX_HISTORY ? next.slice(-MAX_HISTORY) : next;
}

export interface CommandExecutorOptions {
  setIsCommandsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  // Shared state from App.tsx — owned externally so theme/effect persist across
  // view switches. The executor reads current values via the refs; the setters
  // apply changes from command handlers.
  currentThemeNameRef: React.MutableRefObject<ThemeName>;
  setCurrentThemeName: React.Dispatch<React.SetStateAction<ThemeName>>;
  currentEffectRef: React.MutableRefObject<EffectName | null>;
  setCurrentEffect: React.Dispatch<React.SetStateAction<EffectName | null>>;
  setIsMeowActive: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface CommandExecutor {
  history: OutputLine[];
  commandHistory: string[];
  historyIndex: number;
  setHistoryIndex: (index: number) => void;
  executeCommand: (cmd: string) => void;
}

/**
 * Core terminal business logic.
 * Composes useTerminalHistory, useTheme, and useActiveEffect into a single
 * interface and wires up the command executor. 
 * 
 * It acts as a Command Dispatcher: parsing incoming strings and routing
 * them to the appropriate `CommandHandler` in the registry, injecting a
 * unified `CommandContext` to keep the handlers modular and decoupled.
 */
export function useCommandExecutor({
  setIsCommandsOpen,
  currentThemeNameRef, setCurrentThemeName,
  currentEffectRef, setCurrentEffect,
  setIsMeowActive,
}: CommandExecutorOptions): CommandExecutor {
  const {
    history, setHistory,
    commandHistory, commandHistoryRef, setCommandHistory,
    historyIndex, setHistoryIndex,
  } = useTerminalHistory();

  const executeCommand = useCallback((cmd: string) => {
    function push(type: OutputLine["type"], content: OutputLine["content"]) {
      setHistory((prev) => appendCapped(prev, { type, content }));
    }

    const trimmedCmd = cmd.trim().toLowerCase();
    if (trimmedCmd === "") return;

    setHistory((prev) => appendCapped<OutputLine>(prev, { type: "command", content: cmd }));
    setCommandHistory((prev) => appendCapped(prev, cmd));
    setHistoryIndex(-1);

    // Build context
    const ctx: CommandContext = {
      push,
      executeCommand,
      setHistory,
      setIsCommandsOpen,
      commandHistory: commandHistoryRef.current,
      currentThemeName: currentThemeNameRef.current,
      setCurrentThemeName,
      currentEffect: currentEffectRef.current,
      setCurrentEffect,
      setIsMeowActive,
    };

    // Parse command and args
    const [commandName, ...argsArray] = trimmedCmd.split(WHITESPACE_RE);
    const args = argsArray;

    // rawArgs preserves casing and spacing for commands like echo
    const firstSpaceIdx = cmd.trimStart().indexOf(" ");
    const rawArgs = firstSpaceIdx !== -1 ? cmd.trimStart().slice(firstSpaceIdx + 1) : "";

    // ── Dispatch ─────────────────────────────────────────────────────────────
    if (HANDLERS[trimmedCmd]) {
      HANDLERS[trimmedCmd]([], ctx, "");
    } else if (HANDLERS[commandName]) {
      HANDLERS[commandName](args, ctx, rawArgs);
    } else {
      ctx.push("error", `Command not found: ${cmd}. Type 'help' for available commands.`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { history, commandHistory, historyIndex, setHistoryIndex, executeCommand };
}
