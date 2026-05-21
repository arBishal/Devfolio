import { portfolioData } from "@/data/portfolioData";
import type { Skills } from "@/types/portfolio";

/** Maps camelCase skill keys to human-readable display labels. */
const SKILL_LABELS: Record<keyof Skills, string> = {
  programming: "Programming",
  webStack: "Web Stack",
  databases: "Databases",
  tools: "Tools",
  aiWorkflows: "AI Workflows",
  practices: "Practices",
};

export function SkillsSection() {
  const skills = portfolioData.skills;
  return (
    <div className="space-y-3 md:space-y-4 text-sm md:text-base">
      {(Object.keys(skills) as (keyof Skills)[]).map((key) => (
        <div key={key} className="flex flex-wrap gap-x-6 gap-y-1">
          <span className="text-t-muted text-xs md:text-sm w-24 md:w-32 flex-shrink-0 pt-0.5 md:pt-1">{SKILL_LABELS[key]}</span>
          <span className="text-t-text flex-1">{skills[key].join(" · ")}</span>
        </div>
      ))}
    </div>
  );
}
