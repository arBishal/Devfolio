import type { CommandInfo } from "@/data/commandRegistry";

/**
 * Renders the help listing as plain, non-interactive text.
 * Interactive command buttons live in WelcomeScreen.
 *
 * The command list is passed in rather than imported so this stays a pure
 * renderer and doesn't import the registry — the registry references this
 * handler, and importing back would form a cycle. The type-only import above
 * is erased at build time, so it introduces no runtime dependency.
 */
export function renderHelp(commands: CommandInfo[]) {
    const sorted = [...commands].sort((a, b) => a.name.localeCompare(b.name));
    return (
        <div className="space-y-2">
            <p className="text-t-warning">Available commands:</p>
            <div className="pl-4 grid grid-cols-1 md:grid-cols-2">
                {sorted.map((cmd) => (
                    <div key={cmd.name}>
                        <span className="text-t-accent">{cmd.name}</span>
                        <span className="text-t-muted"> — {cmd.description}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
