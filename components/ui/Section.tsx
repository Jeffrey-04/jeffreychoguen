import type { ReactNode } from "react";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/motion/Reveal";
import { revealDelay } from "@/components/motion/motion";

/** Enveloppe standard : container 1200px, padding vertical 96px (design.md §3). */
export function Section({
  id,
  children,
  className = "",
  labelledBy,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  labelledBy?: string;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`section-pad ${className}`}>
      <div className="container-page">{children}</div>
    </section>
  );
}

/**
 * En-tête de section — gap interne 12px, badge↔titre 8px,
 * largeur max 560px en version centrée (design.md §3).
 */
export function SectionHeader({
  badge,
  title,
  description,
  id,
  align = "center",
}: {
  badge: string;
  title: string;
  description?: string;
  id?: string;
  align?: "center" | "left" | "split";
}) {
  if (align === "split") {
    return (
      <div className="mb-16 grid gap-6 md:grid-cols-2 md:items-end">
        <Reveal delay={revealDelay.title}>
          <div className="flex flex-col items-start gap-3">
            <Badge>{badge}</Badge>
            <h2 id={id} className="t-h2 balanced">
              {title}
            </h2>
          </div>
        </Reveal>
        {description ? (
          <Reveal delay={revealDelay.content}>
            <p className="t-body-lg balanced md:text-right">{description}</p>
          </Reveal>
        ) : null}
      </div>
    );
  }

  const alignment =
    align === "center" ? "items-center text-center mx-auto max-w-[560px]" : "items-start";

  return (
    <Reveal delay={revealDelay.title}>
      <div className={`mb-16 flex flex-col gap-3 ${alignment}`}>
        <Badge>{badge}</Badge>
        <h2 id={id} className="t-h2 balanced">
          {title}
        </h2>
        {description ? <p className="t-body-lg balanced">{description}</p> : null}
      </div>
    </Reveal>
  );
}
