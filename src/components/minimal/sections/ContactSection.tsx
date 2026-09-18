import { portfolioData } from "@/data/portfolioData";
import { FOCUS_CARET } from "@/utils/focusStyles";

export function ContactSection() {
  const { email, links, note } = portfolioData.contact;
  return (
    <div className="space-y-2 md:space-y-4 text-sm md:text-base">
      <div className="flex gap-3 md:gap-4 items-baseline">
        <span className="text-t-accent2 text-xs md:text-sm w-16 md:w-24 flex-shrink-0 capitalize">email</span>
        <a href={`mailto:${email}`} className={`text-t-text hover:text-t-accent2 hover:underline transition-colors break-all ${FOCUS_CARET}`}>
          {email}
        </a>
      </div>
      {links.map((item) => (
        <div key={item.label} className="flex gap-3 md:gap-4 items-baseline">
          <span className="text-t-accent2 text-xs md:text-sm w-16 md:w-24 flex-shrink-0 capitalize">{item.label}</span>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-t-text hover:text-t-accent2 hover:underline transition-colors ${FOCUS_CARET}`}
          >
            {item.display}
          </a>
        </div>
      ))}
      <p className="text-t-text/80 text-xs md:text-sm pt-3 md:pt-6">{note}</p>
    </div>
  );
}
