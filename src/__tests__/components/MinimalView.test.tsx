import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MinimalView } from '@/components/minimal/MinimalView';
import { portfolioData } from '@/data/portfolioData';
import { downloadFile } from '@/utils/download';

vi.mock('@/utils/download', () => ({ downloadFile: vi.fn() }));

// The eight sections MinimalView composes, in render order.
const SECTION_TITLES = [
    'About', 'Experience', 'Skills', 'Projects',
    'Publications', 'Interests', 'Blog', 'Contact',
];

function setup(overrides: Partial<Parameters<typeof MinimalView>[0]> = {}) {
    const props = {
        currentThemeName: 'dark' as const,
        setCurrentThemeName: vi.fn(),
        currentEffect: null,
        setCurrentEffect: vi.fn(),
        clearEffect: vi.fn(),
        isMeowActive: false,
        setIsMeowActive: vi.fn(),
        onToggleView: vi.fn(),
        ...overrides,
    };
    render(<MinimalView {...props} />);
    return props;
}

describe('MinimalView', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders a heading for every section', () => {
        setup();
        for (const title of SECTION_TITLES) {
            expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
        }
    });

    it('renders content sourced from portfolioData (name, title, every project)', () => {
        setup();
        expect(screen.getByText(portfolioData.personal.fullName)).toBeInTheDocument();
        expect(screen.getByText(portfolioData.personal.title)).toBeInTheDocument();
        for (const project of portfolioData.projects) {
            expect(screen.getByText(project.name)).toBeInTheDocument();
        }
    });

    it('downloads the resume when the header button is clicked', () => {
        setup();
        fireEvent.click(screen.getByRole('button', { name: /download resume/i }));
        expect(downloadFile).toHaveBeenCalledWith(
            portfolioData.resume.filePath,
            portfolioData.resume.downloadFilename,
        );
    });

    it('calls onToggleView from the sidebar "switch to terminal" control', () => {
        const { onToggleView } = setup();
        fireEvent.click(screen.getByRole('button', { name: /switch to terminal mode/i }));
        expect(onToggleView).toHaveBeenCalledTimes(1);
    });

    it('exposes a skip link targeting the main content region', () => {
        setup();
        expect(screen.getByRole('link', { name: /skip to content/i }))
            .toHaveAttribute('href', '#main-content');
        expect(document.getElementById('main-content')?.tagName).toBe('MAIN');
    });
});
