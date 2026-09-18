import { describe, it, expect, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTheme } from '@/hooks/useTheme';
import { defaultTheme, themeNames } from '@/themes/themes';

describe('useTheme', () => {
    afterEach(() => {
        vi.restoreAllMocks();
        localStorage.clear();
    });

    it('initialises with the default theme', () => {
        const { result } = renderHook(() => useTheme());
        expect(result.current.currentThemeName).toBe(defaultTheme);
    });

    it('falls back to the default theme when reading localStorage throws', () => {
        vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
            throw new Error('localStorage unavailable');
        });
        const { result } = renderHook(() => useTheme());
        expect(result.current.currentThemeName).toBe(defaultTheme);
    });

    it('does not throw if persisting the theme fails', () => {
        vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
            throw new Error('quota exceeded');
        });
        expect(() => {
            const { result } = renderHook(() => useTheme());
            act(() => {
                result.current.setCurrentThemeName('light');
            });
        }).not.toThrow();
    });

    it('currentThemeNameRef mirrors currentThemeName on mount', () => {
        const { result } = renderHook(() => useTheme());
        expect(result.current.currentThemeNameRef.current).toBe(defaultTheme);
    });

    it('setCurrentThemeName updates the theme', () => {
        const { result } = renderHook(() => useTheme());
        act(() => {
            result.current.setCurrentThemeName('light');
        });
        expect(result.current.currentThemeName).toBe('light');
    });

    it('currentThemeNameRef stays in sync after theme change', () => {
        const { result } = renderHook(() => useTheme());
        act(() => {
            result.current.setCurrentThemeName('ubuntu-gnome');
        });
        expect(result.current.currentThemeNameRef.current).toBe('ubuntu-gnome');
    });

    it('accepts all valid theme names without type errors', () => {
        const { result } = renderHook(() => useTheme());
        for (const theme of themeNames) {
            act(() => {
                result.current.setCurrentThemeName(theme);
            });
            expect(result.current.currentThemeName).toBe(theme);
        }
    });
});
