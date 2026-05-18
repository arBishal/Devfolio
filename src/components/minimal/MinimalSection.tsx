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
      className="py-10 md:py-14 border-t border-t-border first:border-t-0"
    >
      <h2 className="text-t-accent text-xs md:text-sm uppercase tracking-widest mb-6 md:mb-8">
        {title}
      </h2>
      {children}
    </section>
  );
}
