import { describe, it, expect } from 'vitest';
import { ALL_COMMAND_NAMES, COMMANDS, HANDLERS } from '@/data/commandRegistry';

/**
 * COMMANDS, ALL_COMMAND_NAMES and HANDLERS are all derived from a single
 * COMMAND_REGISTRY array, so name↔handler drift is impossible by construction.
 * What is still worth guarding: a duplicate name/alias would silently collide
 * in HANDLERS (last write wins) and produce a duplicate in autocomplete.
 */
describe('command registry', () => {
    it('has no duplicate command names or aliases', () => {
        const seen = new Map<string, number>();
        for (const name of ALL_COMMAND_NAMES) {
            seen.set(name, (seen.get(name) ?? 0) + 1);
        }
        const duplicates = [...seen.entries()].filter(([, n]) => n > 1).map(([name]) => name);
        expect(duplicates).toEqual([]);
    });

    it('maps every command name (including aliases) to a handler', () => {
        const missing = ALL_COMMAND_NAMES.filter((name) => !HANDLERS[name]);
        expect(missing).toEqual([]);
        expect(Object.keys(HANDLERS).sort()).toEqual([...ALL_COMMAND_NAMES].sort());
    });

    it('gives every public command a non-empty description', () => {
        const missing = COMMANDS.filter((c) => !c.description.trim()).map((c) => c.name);
        expect(missing).toEqual([]);
    });
});
