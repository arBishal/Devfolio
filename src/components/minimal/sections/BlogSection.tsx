import { portfolioData } from "@/data/portfolioData";

export function BlogSection() {
  const { tagline, links } = portfolioData.blog;
  return (
    <div className="space-y-3 md:space-y-4 text-sm md:text-base">
      <p className="text-t-muted text-xs md:text-sm mb-4 md:mb-6">{tagline}</p>
      {links.map((item) => (
        <div key={item.label} className="flex gap-3 md:gap-4 items-baseline">
          <span className="text-t-accent2 text-xs md:text-sm w-16 md:w-24 flex-shrink-0">{item.label.toLowerCase()}</span>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-t-text hover:text-t-accent2 hover:underline transition-colors"
          >
            {item.display}
          </a>
        </div>
      ))}
    </div>
  );
}
