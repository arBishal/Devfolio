import { portfolioData } from "@/data/portfolioData";

export function ExperienceSection() {
  return (
    <div className="space-y-6 md:space-y-10">
      {portfolioData.experience.map((job, index) => (
        <div key={`${job.company}-${index}`} className={index !== 0 ? "pt-6 md:pt-10 border-t border-t-border" : ""}>
          <div className="flex items-baseline justify-between gap-4 flex-wrap">
            <p className="text-t-accent2 text-sm md:text-lg font-medium">{job.title}</p>
            <p className="text-t-muted text-xs md:text-sm flex-shrink-0">{job.period}</p>
          </div>
          <p className="text-t-muted text-xs md:text-sm mt-0.5 md:mt-1">{job.company}</p>
          <ul className="mt-2 md:mt-4 space-y-1 md:space-y-2 text-t-text text-sm md:text-base">
            {job.achievements.map((achievement, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-t-border flex-shrink-0 select-none">–</span>
                <span>{achievement}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
