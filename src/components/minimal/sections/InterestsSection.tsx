import { portfolioData } from "@/data/portfolioData";

export function InterestsSection() {
  return (
    <div className="space-y-4 text-sm md:text-base">
      <p>
        <span className="text-t-accent2 block mb-1">Research Focus</span>
        <span className="text-t-text">{portfolioData.interests.researchFocus}</span>
      </p>
      <p>
        <span className="text-t-accent2 block mb-1">Creative Pursuits</span>
        <span className="text-t-text">{portfolioData.interests.creativePursuits}</span>
      </p>
    </div>
  );
}
