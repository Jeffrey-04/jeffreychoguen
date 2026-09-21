import type { ReactNode } from "react";

/** design.md §5.2 — pastille de section, rayon 999px. */
export function Badge({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-[14px] font-medium leading-5 tracking-[-0.01em] text-gray-900 ${className}`}
    >
      {children}
    </span>
  );
}

/** Pastille « disponible » — seul emploi de l'accent vert (design.md §2.1). */
export function AvailabilityDot() {
  return (
    <span className="relative flex h-2 w-2" aria-hidden="true">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-500 opacity-60 motion-reduce:hidden" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-500" />
    </span>
  );
}
