import { describe, it, expect, afterEach, vi } from 'vitest';
import { getStorageItem, setStorageItem } from '@/utils/storage';

describe('getStorageItem', () => {
    afterEach(() => {
        vi.restoreAllMocks();
        localStorage.clear();
    });

    it('returns the stored value when present', () => {
        localStorage.setItem('k', 'v');
        expect(getStorageItem('k')).toBe('v');
    });

    it('returns null for a missing key', () => {
        expect(getStorageItem('nope')).toBeNull();
    });

    it('returns null (does not throw) when localStorage throws', () => {
        vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
            throw new Error('unavailable');
        });
        expect(getStorageItem('k')).toBeNull();
    });
});

describe('setStorageItem', () => {
    afterEach(() => {
        vi.restoreAllMocks();
        localStorage.clear();
    });

    it('writes a value that can be read back', () => {
        setStorageItem('k', 'v');
        expect(localStorage.getItem('k')).toBe('v');
    });

    it('does not throw when localStorage throws', () => {
        vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
            throw new Error('quota exceeded');
        });
        expect(() => setStorageItem('k', 'v')).not.toThrow();
    });
});
