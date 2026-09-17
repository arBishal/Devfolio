import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import App from '@/App';

// Stub downloadFile so the minimal view's resume button doesn't touch the DOM.
vi.mock('@/utils/download', () => ({ downloadFile: vi.fn() }));

/**
 * The startup LoadingScreen overlays the resolved view and self-dismisses after
 * VISIBLE_MS (1200) + FADE_MS (300). Advancing past that reveals the view.
 * matchMedia is stubbed (setup.ts) to report `matches: false`, so device
 * detection resolves to desktop → terminal unless a saved choice overrides it.
 */
function finishBoot() {
    act(() => {
        vi.advanceTimersByTime(1500);
    });
}

describe('App — boot & view routing', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it('shows the loading screen on boot, then reveals the view', () => {
        render(<App />);
        // The loading overlay is a polite live status region.
        expect(screen.getByRole('status')).toBeInTheDocument();
        finishBoot();
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    it('routes to the terminal view by default (desktop detection)', () => {
        render(<App />);
        finishBoot();
        // TerminalHeader renders the "<name>'s Terminal Portfolio" title.
        expect(screen.getByText(/Terminal Portfolio/i)).toBeInTheDocument();
        // A minimal-only affordance is absent.
        expect(screen.queryByText('Download Resume')).not.toBeInTheDocument();
    });

    it('routes to the minimal view when a saved "minimal" choice exists', () => {
        localStorage.setItem('viewMode', 'minimal');
        render(<App />);
        finishBoot();
        // Minimal view header action is present…
        expect(screen.getByText('Download Resume')).toBeInTheDocument();
        // …and terminal chrome is not.
        expect(screen.queryByText(/Terminal Portfolio/i)).not.toBeInTheDocument();
    });
});
