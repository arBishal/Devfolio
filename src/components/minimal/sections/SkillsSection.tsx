import { portfolioData } from "@/data/portfolioData";

export function SkillsSection() {
  const skills = portfolioData.skills;
  return (
    <div className="space-y-3 md:space-y-4 text-sm md:text-base">
      {(Object.entries(skills) as [string, string[]][]).map(([category, items]) => (
        <div key={category} className="flex flex-wrap gap-x-6 gap-y-1">
          <span className="text-t-muted text-xs md:text-sm w-24 md:w-32 flex-shrink-0 pt-0.5 md:pt-1 capitalize">{category}</span>
          <span className="text-t-text flex-1">{items.join(" · ")}</span>
        </div>
      ))}
    </div>
  );
}
