import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getInitialViewMode, persistViewMode } from '@/utils/viewMode';

/** Override window.matchMedia so "(max-width: 767px)" reports the given match. */
function setNarrowScreen(isNarrow: boolean) {
    window.matchMedia = ((query: string) => ({
        matches: isNarrow,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;
}

describe('getInitialViewMode', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('auto-detects "minimal" on a narrow (mobile) screen when nothing is saved', () => {
        setNarrowScreen(true);
        expect(getInitialViewMode()).toBe('minimal');
    });

    it('auto-detects "terminal" on a wide (desktop) screen when nothing is saved', () => {
        setNarrowScreen(false);
        expect(getInitialViewMode()).toBe('terminal');
    });

    it('a saved "terminal" choice overrides the mobile screen', () => {
        setNarrowScreen(true);
        localStorage.setItem('viewMode', 'terminal');
        expect(getInitialViewMode()).toBe('terminal');
    });

    it('a saved "minimal" choice overrides the desktop screen', () => {
        setNarrowScreen(false);
        localStorage.setItem('viewMode', 'minimal');
        expect(getInitialViewMode()).toBe('minimal');
    });

    it('falls back to detection when the saved value is invalid', () => {
        setNarrowScreen(true);
        localStorage.setItem('viewMode', 'garbage');
        expect(getInitialViewMode()).toBe('minimal');
    });

    it('does NOT persist the auto-detected default', () => {
        setNarrowScreen(true);
        getInitialViewMode();
        expect(localStorage.getItem('viewMode')).toBeNull();
    });

    it('falls back to detection if reading localStorage throws', () => {
        setNarrowScreen(false);
        vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
            throw new Error('localStorage unavailable');
        });
        expect(getInitialViewMode()).toBe('terminal');
    });
});

describe('persistViewMode', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('writes an explicit choice to localStorage', () => {
        persistViewMode('minimal');
        expect(localStorage.getItem('viewMode')).toBe('minimal');
    });

    it('does not throw if writing to localStorage fails', () => {
        vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
            throw new Error('quota exceeded');
        });
        expect(() => persistViewMode('terminal')).not.toThrow();
    });
});
