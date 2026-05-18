import { MinimalNav } from "@/components/minimal/MinimalNav";
import { MinimalSection } from "@/components/minimal/MinimalSection";
import { AboutSection } from "@/components/minimal/sections/AboutSection";
import { SkillsSection } from "@/components/minimal/sections/SkillsSection";
import { ProjectsSection } from "@/components/minimal/sections/ProjectsSection";
import { ExperienceSection } from "@/components/minimal/sections/ExperienceSection";
import { ContactSection } from "@/components/minimal/sections/ContactSection";
import { BlogSection } from "@/components/minimal/sections/BlogSection";
import { portfolioData } from "@/data/portfolioData";
import { downloadFile } from "@/utils/download";
import type { ThemeName } from "@/themes/themes";
import type { Dispatch, SetStateAction } from "react";

interface MinimalViewProps {
  currentThemeName: ThemeName;
  setCurrentThemeName: Dispatch<SetStateAction<ThemeName>>;
  currentEffect: string | null;
  setCurrentEffect: Dispatch<SetStateAction<string | null>>;
  clearEffect: () => void;
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
  onToggleView,
}: MinimalViewProps) {
  const handleResumeDownload = () => {
    downloadFile(portfolioData.resume.filePath, portfolioData.resume.downloadFilename);
  };

  return (
    <div className="bg-t-bg text-t-text font-mono min-h-dvh">
      <MinimalNav
        currentThemeName={currentThemeName}
        setCurrentThemeName={setCurrentThemeName}
        currentEffect={currentEffect}
        setCurrentEffect={setCurrentEffect}
        clearEffect={clearEffect}
        onToggleView={onToggleView}
      />

      {/* md:ml-56 lg:ml-64 to clear the fixed sidebar */}
      <div className="md:ml-56 lg:ml-64 relative">

        {/* GitHub style Header */}
        <header className="md:sticky top-0 z-30 bg-t-bg/95 backdrop-blur-sm border-b border-t-border px-6 ml-[5vw] md:ml-0 md:px-12 lg:px-20 h-16 flex items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-0 sm:gap-2 items-start sm:items-center text-sm md:text-base whitespace-nowrap overflow-hidden pr-4">
            <span className="text-t-text font-medium flex-shrink-0">{portfolioData.personal.fullName}</span>
            <span className="text-t-muted flex-shrink-0 hidden sm:inline">/</span>
            <span className="text-t-muted font-medium truncate text-xs sm:text-base">{portfolioData.personal.title}</span>
          </div>
          <button
            onClick={handleResumeDownload}
            className="text-xs bg-t-bg hover:bg-t-border text-t-text border border-t-border px-3 py-1.5 rounded transition-colors cursor-pointer font-medium flex items-center gap-1.5 shadow-sm flex-shrink-0"
          >
            <span className="inline">Resume</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
          </button>
        </header>

        <main className="px-6 ml-[5vw] md:ml-0 md:px-12 lg:px-20">

          <MinimalSection id="about" title="About">
            <AboutSection />
          </MinimalSection>

          <MinimalSection id="skills" title="Skills">
            <SkillsSection />
          </MinimalSection>

          <MinimalSection id="projects" title="Projects">
            <ProjectsSection />
          </MinimalSection>

          <MinimalSection id="experience" title="Experience">
            <ExperienceSection />
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
