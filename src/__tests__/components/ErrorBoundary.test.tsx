import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '@/components/ErrorBoundary';

/** A component that always throws during render. */
function Boom(): never {
    throw new Error('boom');
}

describe('ErrorBoundary', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders children when nothing throws', () => {
        render(
            <ErrorBoundary>
                <p>all good</p>
            </ErrorBoundary>
        );
        expect(screen.getByText('all good')).toBeInTheDocument();
    });

    it('renders the default fallback (not a blank screen) when a child throws', () => {
        // React logs the caught error to console.error — silence it for a clean run.
        vi.spyOn(console, 'error').mockImplementation(() => {});
        render(
            <ErrorBoundary>
                <Boom />
            </ErrorBoundary>
        );
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /reload/i })).toBeInTheDocument();
    });

    it('renders a custom fallback when provided', () => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
        render(
            <ErrorBoundary fallback={<p>custom fallback</p>}>
                <Boom />
            </ErrorBoundary>
        );
        expect(screen.getByText('custom fallback')).toBeInTheDocument();
    });
});
