import { MinimalNav } from "@/components/minimal/MinimalNav";
import { MinimalSection } from "@/components/minimal/MinimalSection";
import { AboutSection } from "@/components/minimal/sections/AboutSection";
import { SkillsSection } from "@/components/minimal/sections/SkillsSection";
import { ProjectsSection } from "@/components/minimal/sections/ProjectsSection";
import { ExperienceSection } from "@/components/minimal/sections/ExperienceSection";
import { PublicationsSection } from "@/components/minimal/sections/PublicationsSection";
import { InterestsSection } from "@/components/minimal/sections/InterestsSection";
import { ContactSection } from "@/components/minimal/sections/ContactSection";
import { BlogSection } from "@/components/minimal/sections/BlogSection";
import { portfolioData } from "@/data/portfolioData";
import { downloadFile } from "@/utils/download";
import { FOCUS_CARET } from "@/utils/focusStyles";
import type { ThemeName } from "@/themes/themes";
import type { EffectName } from "@/data/staticData";
import type { Dispatch, SetStateAction } from "react";

interface MinimalViewProps {
  currentThemeName: ThemeName;
  setCurrentThemeName: Dispatch<SetStateAction<ThemeName>>;
  currentEffect: EffectName | null;
  setCurrentEffect: Dispatch<SetStateAction<EffectName | null>>;
  clearEffect: () => void;
  isMeowActive: boolean;
  setIsMeowActive: Dispatch<SetStateAction<boolean>>;
  onToggleView: () => void;
}

/**
 * Minimal portfolio view — a traditional, scroll-based layout reading
 * from the same portfolioData source as the terminal commands.
 *
 * Layout:
 *   Desktop (md+): fixed-width sidebar on the left + scrollable content on the right.
 *   Mobile: full-width scrollable content; sidebar opens via left-edge chevron tab.
 */
export function MinimalView({
  currentThemeName,
  setCurrentThemeName,
  currentEffect,
  setCurrentEffect,
  clearEffect,
  isMeowActive,
  setIsMeowActive,
  onToggleView,
}: MinimalViewProps) {
  const handleResumeDownload = () => {
    downloadFile(portfolioData.resume.filePath, portfolioData.resume.downloadFilename);
  };

  return (
    <div className="bg-t-bg text-t-text font-sans min-h-dvh">
      {/* Skip link — first tab stop; slides in on keyboard focus, bypasses the sidebar nav. */}
      <a
        href="#main-content"
        className="fixed top-2 left-2 z-[var(--z-overlay)] -translate-y-[150%] focus:translate-y-0 rounded border border-t-border bg-t-header-bg px-4 py-2 text-t-accent transition-transform focus:outline-none"
      >
        Skip to content
      </a>
      <MinimalNav
        currentThemeName={currentThemeName}
        setCurrentThemeName={setCurrentThemeName}
        currentEffect={currentEffect}
        setCurrentEffect={setCurrentEffect}
        clearEffect={clearEffect}
        isMeowActive={isMeowActive}
        setIsMeowActive={setIsMeowActive}
        onToggleView={onToggleView}
      />

      {/* md:ml-56 lg:ml-64 to clear the fixed sidebar */}
      <div className="md:ml-56 lg:ml-64 relative">

        {/* GitHub style Header */}
        <header className="sticky top-0 z-[var(--z-header)] bg-t-bg/95 backdrop-blur-sm border-b border-t-border px-6 ml-[6.67vw] md:ml-0 md:px-12 lg:px-20 h-16 flex items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-0 sm:gap-2 items-start sm:items-center text-sm md:text-base whitespace-nowrap overflow-hidden pr-4">
            <h1 className="text-t-text font-medium flex-shrink-0">{portfolioData.personal.fullName}</h1>
            <span className="text-t-text/80 flex-shrink-0 hidden sm:inline">/</span>
            <span className="text-t-text/80 font-medium truncate text-xs sm:text-base">{portfolioData.personal.title}</span>
          </div>
          <button
            onClick={handleResumeDownload}
            className={`text-xs md:text-sm bg-t-bg hover:bg-t-border text-t-text border border-t-border px-3 py-1.5 rounded transition-colors cursor-pointer font-medium flex items-center gap-1.5 shadow-sm flex-shrink-0 ${FOCUS_CARET}`}
          >
            <span className="md:hidden">Resume</span>
            <span className="hidden md:inline">Download Resume</span>
            <svg aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
          </button>
        </header>

        {/* Body prose is serif (Lora); section headings opt back into sans (see MinimalSection). */}
        {/* tabIndex=-1 makes this a programmatic focus target for the skip link. */}
        <main id="main-content" tabIndex={-1} className="px-6 ml-[6.67vw] md:ml-0 md:px-12 lg:px-20 font-serif focus:outline-none">

          <MinimalSection id="about" title="About">
            <AboutSection />
          </MinimalSection>

          <MinimalSection id="experience" title="Experience">
            <ExperienceSection />
          </MinimalSection>

          <MinimalSection id="skills" title="Skills">
            <SkillsSection />
          </MinimalSection>

          <MinimalSection id="projects" title="Projects">
            <ProjectsSection />
          </MinimalSection>

          <MinimalSection id="publications" title="Publications">
            <PublicationsSection />
          </MinimalSection>

          <MinimalSection id="interests" title="Interests">
            <InterestsSection />
          </MinimalSection>

          <MinimalSection id="blog" title="Blog">
            <BlogSection />
          </MinimalSection>

          <MinimalSection id="contact" title="Contact">
            <ContactSection />
          </MinimalSection>

        </main>
      </div>
    </div>
  );
}
