import type { ReactNode } from "react";

interface MinimalSectionProps {
  id: string;
  title: string;
  children: ReactNode;
}

/**
 * Reusable section wrapper for the minimal portfolio view.
 * Each section gets an id for anchor-scroll navigation, a consistent
 * heading style, and generous vertical spacing with a thin top border
 * separating it from the previous section.
 */
export function MinimalSection({ id, title, children }: MinimalSectionProps) {
  return (
    <section
      id={id}
      className="py-6 md:py-8 scroll-mt-16"
    >
      <div className="flex items-center gap-4 mb-6 md:mb-8">
        <h2 className="text-t-accent text-sm md:text-base uppercase tracking-widest whitespace-nowrap">
          {title}
        </h2>
        <div className="h-px bg-t-border flex-1"></div>
      </div>
      {children}
    </section>
  );
}
