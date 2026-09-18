// ============================================================
// Command Registry — single source of truth for all commands
// ============================================================
// Each entry carries everything about a command: its name, help
// description, whether it's hidden, its handler, and any aliases.
// Every derived list — help/welcome (`COMMANDS`), autocomplete
// (`ALL_COMMAND_NAMES`), and the executor's dispatch table (`HANDLERS`)
// — is computed from this one array, so a command can never be advertised
// without a handler (or handled while invisible).
// ============================================================

import {
    renderAbout, renderSkills, renderProjects, renderExperience,
    renderPublications, renderInterests, handleResume, renderContact, renderBlog,
} from "@/commands/portfolio";
import { renderHelp } from "@/commands/help";
import { handleTheme, handleFun } from "@/commands/visuals";
import {
    renderLs, renderPwd, renderWhoami, renderDate, renderSudo,
    renderHack, renderExit, renderHello, renderHistory,
    handleCat, handleEcho, handleMeow,
} from "@/commands/misc";
import type { CommandHandler, CommandContext, OutputLine } from "@/types/terminal";

interface CommandEntry {
    name: string;
    description?: string;
    /** Hidden commands are excluded from help / welcome screen. */
    hidden: boolean;
    handler: CommandHandler;
    /** Extra names that dispatch to the same handler (e.g. "ls -la"). */
    aliases?: string[];
}

// Adapters that wrap a pure renderer as a handler pushing a single output line.
const asResult = (render: (ctx: CommandContext) => OutputLine["content"]): CommandHandler =>
    (_args, ctx) => ctx.push("result", render(ctx));
const asError = (render: () => OutputLine["content"]): CommandHandler =>
    (_args, ctx) => ctx.push("error", render());

const COMMAND_REGISTRY: CommandEntry[] = [
    // ── Public commands (shown in help + welcome screen) ──────────
    { name: "about",        description: "Learn about me",               hidden: false, handler: asResult(() => renderAbout()) },
    { name: "skills",       description: "View my technical skills",     hidden: false, handler: asResult(() => renderSkills()) },
    { name: "experience",   description: "View work experience",         hidden: false, handler: asResult(() => renderExperience()) },
    { name: "projects",     description: "Browse my projects",           hidden: false, handler: asResult(() => renderProjects()) },
    { name: "publications", description: "View my research publications", hidden: false, handler: asResult(() => renderPublications()) },
    { name: "interests",    description: "View my interests",            hidden: false, handler: asResult(() => renderInterests()) },
    { name: "resume",       description: "Download my resume",           hidden: false, handler: handleResume },
    { name: "contact",      description: "Get contact information",      hidden: false, handler: asResult(() => renderContact()) },
    { name: "blog",         description: "Read my articles",             hidden: false, handler: asResult(() => renderBlog()) },
    { name: "theme",        description: "Change terminal theme",        hidden: false, handler: handleTheme },
    { name: "fun",          description: "Visual effects",               hidden: false, handler: handleFun },
    { name: "help",         description: "Show this help message",       hidden: false, handler: asResult(() => renderHelp(COMMANDS)) },
    { name: "clear",        description: "Clear terminal",               hidden: false, handler: (_a, c) => { c.setHistory([]); c.setIsMeowActive(false); } },

    // ── Hidden (functional but not advertised) ─────────────────────
    {
        name: "hide", hidden: true,
        handler: (_a, c) => {
            c.setIsCommandsOpen(false);
            c.push("result", <p className="text-t-muted">Commands hidden. Type <span className="text-t-accent">show</span> to bring them back.</p>);
        },
    },
    {
        name: "show", hidden: true,
        handler: (_a, c) => {
            c.setIsCommandsOpen(true);
            c.push("result", <p className="text-t-muted">Commands visible.</p>);
        },
    },
    { name: "history", hidden: true, handler: asResult((c) => renderHistory(c.commandHistory)) },

    // ── Easter eggs / unix-style ───────────────────────────────────
    { name: "ls",     hidden: true, handler: asResult(() => renderLs()),    aliases: ["ls -la", "ls -l"] },
    { name: "pwd",    hidden: true, handler: asResult(() => renderPwd()) },
    { name: "whoami", hidden: true, handler: asResult(() => renderWhoami()) },
    { name: "date",   hidden: true, handler: asResult(() => renderDate()) },
    { name: "sudo",   hidden: true, handler: asError(() => renderSudo()),   aliases: ["sudo rm -rf /", "rm -rf /"] },
    { name: "hack",   hidden: true, handler: asResult(() => renderHack()),  aliases: ["hack the planet"] },
    { name: "exit",   hidden: true, handler: asResult(() => renderExit()),  aliases: ["quit"] },
    { name: "hello",  hidden: true, handler: asResult(() => renderHello()), aliases: ["hi"] },
    { name: "cat",    hidden: true, handler: handleCat },
    { name: "echo",   hidden: true, handler: handleEcho },
    { name: "meow",   hidden: true, handler: handleMeow },
];

// ── Derived exports ────────────────────────────────────────────────────────────

export interface CommandInfo {
    name: string;
    description: string;
}

/** Public commands with descriptions — used by help and welcome screen. */
export const COMMANDS: CommandInfo[] = COMMAND_REGISTRY
    .filter((c): c is CommandEntry & { description: string } => !c.hidden && !!c.description)
    .map(({ name, description }) => ({ name, description }));

/** All command names + aliases, sorted — used for autocomplete. */
export const ALL_COMMAND_NAMES: string[] = COMMAND_REGISTRY
    .flatMap((c) => [c.name, ...(c.aliases ?? [])])
    .sort();

/** Dispatch table: every name and alias mapped to its handler. */
export const HANDLERS: Record<string, CommandHandler> = Object.fromEntries(
    COMMAND_REGISTRY.flatMap((c) =>
        [c.name, ...(c.aliases ?? [])].map((key) => [key, c.handler] as const),
    ),
);
