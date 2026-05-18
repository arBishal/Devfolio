import { portfolioData } from "@/data/portfolioData";

export function AboutSection() {
  const { bio, location, education } = portfolioData.personal;
  return (
    <div className="space-y-4 text-sm md:text-base text-t-text">
      {bio.map((line, i) => (
        <p key={i}>{line}</p>
      ))}
      <div className="pt-2 md:pt-4 space-y-1">
        <p className="text-t-muted text-xs md:text-sm capitalize">location</p>
        <p>{location}</p>
      </div>
      <div className="space-y-1 md:space-y-2">
        <p className="text-t-muted text-xs md:text-sm capitalize">education</p>
        {education.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    </div>
  );
}
