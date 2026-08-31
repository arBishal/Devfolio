import { portfolioData } from "@/data/portfolioData";

export function ProjectsSection() {
  return (
    <div className="space-y-6 md:space-y-10">
      {portfolioData.projects.map((project, i) => (
        <div key={project.name}>
          <div className="flex items-baseline justify-between gap-4 flex-wrap">
            <p className="text-t-accent2 text-sm md:text-base font-medium">{project.name}</p>
            <div className="flex gap-3">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-t-accent2 hover:text-t-text transition-colors flex-shrink-0"
                  aria-label="GitHub Repository"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                  </svg>
                </a>
              )}
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-t-accent2 hover:text-t-text transition-colors flex-shrink-0"
                  aria-label="Live Demo"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              )}
            </div>
          </div>
          <p className="text-t-text text-sm md:text-base mt-1 md:mt-2">{project.description}</p>
          <p className="text-t-muted text-xs md:text-sm mt-2 md:mt-3">{project.tech.join(" · ")}</p>
        </div>
      ))}
    </div>
  );
}
