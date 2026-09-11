import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { LoadingScreen } from '@/components/LoadingScreen';

/**
 * Override window.matchMedia so the reduced-motion query reports `reduce`.
 * With reduced motion on, the typewriter renders its full text immediately,
 * which keeps text assertions deterministic (no per-character timing).
 */
function setReducedMotion(reduce: boolean) {
    window.matchMedia = ((query: string) => ({
        matches: query.includes('prefers-reduced-motion') ? reduce : false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;
}

describe('LoadingScreen', () => {
    beforeEach(() => {
        setReducedMotion(true);
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    it('shows the device-detection copy for a detected desktop/terminal load', () => {
        render(
            <LoadingScreen mode="terminal" device="desktop" source="device" onComplete={() => {}} />
        );
        expect(
            screen.getByText('desktop detected. loading terminal mode...')
        ).toBeInTheDocument();
    });

    it('shows the device-detection copy for a detected mobile/minimal load', () => {
        render(
            <LoadingScreen mode="minimal" device="mobile" source="device" onComplete={() => {}} />
        );
        expect(
            screen.getByText('mobile detected. loading minimal mode...')
        ).toBeInTheDocument();
    });

    it('shows "welcome back" copy for a saved choice instead of a detection claim', () => {
        render(
            <LoadingScreen mode="terminal" device="mobile" source="saved" onComplete={() => {}} />
        );
        expect(
            screen.getByText('welcome back. loading terminal mode...')
        ).toBeInTheDocument();
        expect(screen.queryByText(/detected/)).not.toBeInTheDocument();
    });

    it('renders the terminal prompt for terminal mode (typewriter variant)', () => {
        render(
            <LoadingScreen mode="terminal" device="desktop" source="device" onComplete={() => {}} />
        );
        expect(screen.getByText('guest@portfolio:~$')).toBeInTheDocument();
    });

    it('renders a spinner (and no prompt) for minimal mode', () => {
        const { container } = render(
            <LoadingScreen mode="minimal" device="mobile" source="device" onComplete={() => {}} />
        );
        expect(screen.queryByText('guest@portfolio:~$')).not.toBeInTheDocument();
        // The spinner is an aria-hidden decorative span.
        expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
    });

    it('exposes the screen as a polite live status region', () => {
        render(
            <LoadingScreen mode="minimal" device="mobile" source="device" onComplete={() => {}} />
        );
        const status = screen.getByRole('status');
        expect(status).toHaveAttribute('aria-live', 'polite');
    });

    it('calls onComplete once after the visible + fade lifecycle', () => {
        vi.useFakeTimers();
        const onComplete = vi.fn();
        render(
            <LoadingScreen mode="terminal" device="desktop" source="device" onComplete={onComplete} />
        );

        expect(onComplete).not.toHaveBeenCalled();
        // VISIBLE_MS (1200) + FADE_MS (300) = 1500ms
        act(() => {
            vi.advanceTimersByTime(1500);
        });
        expect(onComplete).toHaveBeenCalledTimes(1);
    });
});
