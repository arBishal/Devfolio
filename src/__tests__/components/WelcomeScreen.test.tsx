import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WelcomeScreen } from '@/components/terminal/WelcomeScreen';
import { COMMANDS } from '@/data/commandRegistry';

function setup(overrides: Partial<Parameters<typeof WelcomeScreen>[0]> = {}) {
    const props = {
        onCommandClick: vi.fn(),
        isCommandsOpen: true,
        onToggleCommands: vi.fn(),
        onTogglePointerDown: vi.fn(),
        onToggleView: vi.fn(),
        ...overrides,
    };
    render(<WelcomeScreen {...props} />);
    return props;
}

describe('WelcomeScreen', () => {
    it('calls onToggleView when the "Minimal Mode" link is clicked', () => {
        const { onToggleView } = setup();
        fireEvent.click(screen.getByRole('button', { name: 'Minimal Mode' }));
        expect(onToggleView).toHaveBeenCalledTimes(1);
    });

    it('calls onCommandClick with the command name when a command button is clicked', () => {
        const { onCommandClick } = setup();
        fireEvent.click(screen.getByRole('button', { name: 'about' }));
        expect(onCommandClick).toHaveBeenCalledWith('about');
    });

    it('calls onToggleCommands when the collapse chevron is clicked', () => {
        const { onToggleCommands } = setup({ isCommandsOpen: true });
        fireEvent.click(screen.getByRole('button', { name: /collapse commands/i }));
        expect(onToggleCommands).toHaveBeenCalledTimes(1);
    });

    it('renders a clickable button for every public command', () => {
        setup();
        for (const cmd of COMMANDS) {
            expect(screen.getByRole('button', { name: cmd.name })).toBeInTheDocument();
        }
    });
});
