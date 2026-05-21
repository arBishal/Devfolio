import { portfolioData } from "@/data/portfolioData";

export function ProjectsSection() {
  return (
    <div className="space-y-6 md:space-y-10">
      {portfolioData.projects.map((project, i) => (
        <div key={project.name}>
          <div className="flex items-baseline justify-between gap-4 flex-wrap">
            <p className="text-t-accent2 text-sm md:text-base font-medium">{project.name}</p>
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-t-accent2 text-xs md:text-sm hover:underline flex-shrink-0"
            >
              view →
            </a>
          </div>
          <p className="text-t-text text-sm md:text-base mt-1 md:mt-2">{project.description}</p>
          <p className="text-t-muted text-xs md:text-sm mt-2 md:mt-3">{project.tech.join(" · ")}</p>
        </div>
      ))}
    </div>
  );
}
