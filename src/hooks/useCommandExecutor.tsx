import { useCallback } from "react";
import { themeNames } from "@/themes/themes";
import type { ThemeName } from "@/themes/themes";

// Command renderers and handlers
import {
  renderAbout, renderSkills, renderProjects, renderExperience,
  renderResume, renderContact, renderBlog,
} from "@/commands/portfolio";
import { downloadFile } from "@/utils/download";
import { portfolioData } from "@/data/portfolioData";
import { renderHelp } from "@/commands/help";
import { handleTheme, handleFun } from "@/commands/visuals";
import {
  renderLs, renderPwd, renderWhoami, renderDate, renderSudo,
  renderHack, renderExit, renderHello, renderHistory,
  handleCat, handleEcho, handleMeow,
} from "@/commands/misc";

import { useTerminalHistory } from "./useTerminalHistory";

import type { OutputLine, CommandContext, CommandHandler } from "@/types/terminal";

// Hoisted regex — avoids recreation on every command execution
const WHITESPACE_RE = /\s+/;

// Maximum number of output lines kept in memory.
// Oldest lines are trimmed when the limit is exceeded.
const MAX_HISTORY = 400;

// ── Handlers Registry (module-scoped — created once) ──────────────────────────
const HANDLERS: Record<string, CommandHandler> = {
  "theme": handleTheme,
  "fun": handleFun,
  "cat": handleCat,
  "echo": handleEcho,
  "meow": handleMeow,
  // Portfolio
  "help": (a, c) => c.push("result", renderHelp()),
  "about": (a, c) => c.push("result", renderAbout()),
  "skills": (a, c) => c.push("result", renderSkills()),
  "projects": (a, c) => c.push("result", renderProjects()),
  "experience": (a, c) => c.push("result", renderExperience()),
  "resume": (a, c) => { downloadFile(portfolioData.resume.filePath, portfolioData.resume.downloadFilename); c.push("result", renderResume()); },
  "contact": (a, c) => c.push("result", renderContact()),
  "blog": (a, c) => c.push("result", renderBlog()),
  // Terminal control
  "clear": (a, c) => { c.setHistory([]); c.setIsMeowActive(false); },
  "hide": (a, c) => { c.setIsCommandsOpen(false); c.push("result", <p className="text-t-muted">Commands hidden. Type <span className="text-t-accent">show</span> to bring them back.</p>); },
  "show": (a, c) => { c.setIsCommandsOpen(true); c.push("result", <p className="text-t-muted">Commands visible.</p>); },
  // Unix-style / easter eggs
  "ls": (a, c) => c.push("result", renderLs()),
  "pwd": (a, c) => c.push("result", renderPwd()),
  "whoami": (a, c) => c.push("result", renderWhoami()),
  "date": (a, c) => c.push("result", renderDate()),
  "sudo": (a, c) => c.push("error", renderSudo()),
  "hack": (a, c) => c.push("result", renderHack()),
  "exit": (a, c) => c.push("result", renderExit()),
  "quit": (a, c) => c.push("result", renderExit()),
  "hello": (a, c) => c.push("result", renderHello()),
  "hi": (a, c) => c.push("result", renderHello()),
  "history": (a, c) => c.push("result", renderHistory(c.commandHistory)),
};

// Aliases — point multi-word commands to their base handler
HANDLERS["ls -la"] = HANDLERS["ls"];
HANDLERS["ls -l"] = HANDLERS["ls"];
HANDLERS["sudo rm -rf /"] = HANDLERS["sudo"];
HANDLERS["rm -rf /"] = HANDLERS["sudo"];
HANDLERS["hack the planet"] = HANDLERS["hack"];

export interface CommandExecutorOptions {
  setIsCommandsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  // Shared state from App.tsx — owned externally so theme/effect persist across view switches
  currentThemeName: ThemeName;
  currentThemeNameRef: React.MutableRefObject<ThemeName>;
  setCurrentThemeName: React.Dispatch<React.SetStateAction<ThemeName>>;
  currentEffect: string | null;
  currentEffectRef: React.MutableRefObject<string | null>;
  setCurrentEffect: React.Dispatch<React.SetStateAction<string | null>>;
  clearEffect: () => void;
  isMeowActive: boolean;
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
  currentThemeName, currentThemeNameRef, setCurrentThemeName,
  currentEffect, currentEffectRef, setCurrentEffect,
  isMeowActive, setIsMeowActive,
}: CommandExecutorOptions): CommandExecutor {
  const {
    history, setHistory,
    commandHistory, commandHistoryRef, setCommandHistory,
    historyIndex, setHistoryIndex,
  } = useTerminalHistory();

  const executeCommand = useCallback((cmd: string) => {
    function push(type: OutputLine["type"], content: OutputLine["content"]) {
      setHistory((prev) => {
        const next = [...prev, { type, content }];
        return next.length > MAX_HISTORY ? next.slice(-MAX_HISTORY) : next;
      });
    }

    const trimmedCmd = cmd.trim().toLowerCase();
    if (trimmedCmd === "") return;

    setHistory((prev) => {
      const next: OutputLine[] = [...prev, { type: "command", content: cmd }];
      return next.length > MAX_HISTORY ? next.slice(-MAX_HISTORY) : next;
    });
    setCommandHistory((prev) => [...prev, cmd]);
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
      isMeowActive,
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
