import { portfolioData } from "@/data/portfolioData";

export function PublicationsSection() {
  return (
    <div className="space-y-6 md:space-y-10">
      {portfolioData.publications.map((pub, index) => (
        <div key={index}>
          <div className="flex items-center flex-wrap gap-3">
            <p className="text-t-accent2 text-sm md:text-base font-medium">{pub.title}</p>
            <span className="border border-t-muted text-t-muted px-2 py-0.5 rounded text-[10px] md:text-xs font-medium whitespace-nowrap flex-shrink-0">{pub.status}</span>
          </div>
          <p className="text-t-text text-sm md:text-base mt-1 md:mt-2">{pub.authors}</p>
          <p className="text-t-muted text-xs md:text-sm mt-2 md:mt-3">{pub.journal} • {pub.year}</p>
        </div>
      ))}
    </div>
  );
}
