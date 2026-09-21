"use client";

import type { ReactNode } from "react";
import { useHoverCardMove } from "@/components/motion/useHoverCardMove";

/**
 * design.md §5.3 — carte claire : blanc, bordure 1px gray-200, rayon 16px.
 * Le template n'utilise aucune ombre portée : la séparation vient de la bordure.
 */
export function Card({
  children,
  className = "",
  dark = false,
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  dark?: boolean;
  interactive?: boolean;
}) {
  const { ref, handlers } = useHoverCardMove<HTMLDivElement>();
  const surface = dark
    ? "card-dark border border-white/20 text-white"
    : "bg-white border border-gray-200";

  return (
    <div
      ref={interactive ? ref : undefined}
      {...(interactive ? handlers : {})}
      className={`rounded-[16px] ${surface} ${className}`}
    >
      {children}
    </div>
  );
}

/** Contenu interne standard : padding 32px, gap 8px (design.md §5.3). */
export function CardBody({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`flex flex-col gap-2 p-8 ${className}`}>{children}</div>;
}
