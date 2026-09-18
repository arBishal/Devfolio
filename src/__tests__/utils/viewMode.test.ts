import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
    detectDevice,
    getInitialViewMode,
    getInitialViewState,
    persistViewMode,
} from '@/utils/viewMode';

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

describe('detectDevice', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('reports "mobile" on a narrow screen', () => {
        setNarrowScreen(true);
        expect(detectDevice()).toBe('mobile');
    });

    it('reports "desktop" on a wide screen', () => {
        setNarrowScreen(false);
        expect(detectDevice()).toBe('desktop');
    });
});

describe('getInitialViewState', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('auto-detects a mobile device into minimal mode from device source', () => {
        setNarrowScreen(true);
        expect(getInitialViewState()).toEqual({
            mode: 'minimal',
            device: 'mobile',
            source: 'device',
        });
    });

    it('auto-detects a desktop device into terminal mode from device source', () => {
        setNarrowScreen(false);
        expect(getInitialViewState()).toEqual({
            mode: 'terminal',
            device: 'desktop',
            source: 'device',
        });
    });

    it('reports source "saved" and the saved mode, while still detecting the real device', () => {
        setNarrowScreen(true); // physically a mobile device …
        localStorage.setItem('viewMode', 'terminal'); // … but the user chose terminal
        expect(getInitialViewState()).toEqual({
            mode: 'terminal',
            device: 'mobile',
            source: 'saved',
        });
    });

    it('treats an invalid saved value as no choice (source "device")', () => {
        setNarrowScreen(false);
        localStorage.setItem('viewMode', 'garbage');
        expect(getInitialViewState()).toEqual({
            mode: 'terminal',
            device: 'desktop',
            source: 'device',
        });
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
