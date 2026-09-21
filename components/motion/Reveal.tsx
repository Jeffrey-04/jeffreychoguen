"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { DISTANCE, STAGGER } from "./motion";
import { register } from "./reveal-engine";

type Tag = "div" | "section" | "li" | "article" | "header" | "ol" | "ul" | "figure";

/**
 * Apparition au scroll, réversible.
 *
 * L'élément monte et se pose en descendant la page ; en remontant, il se
 * défait doucement et repart d'où il venait. L'état est piloté par l'attribut
 * data-reveal, les transitions vivent en CSS (app/globals.css) : le JavaScript
 * ne fait que basculer un attribut, jamais animer image par image.
 */
export function Reveal({
  children,
  delay = 0,
  exitDelay = 0,
  y = DISTANCE,
  x = 0,
  className = "",
  style,
  as: Tag = "div",
}: {
  children: ReactNode;
  /** Délai d'entrée, en secondes. */
  delay?: number;
  /** Délai de sortie, en secondes. Permet de défaire dans l'ordre inverse. */
  exitDelay?: number;
  y?: number;
  x?: number;
  className?: string;
  style?: CSSProperties;
  as?: Tag;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return register(el, y, x);
  }, [y, x]);

  return (
    <Tag
      ref={ref as never}
      data-reveal="out"
      className={className}
      style={
        {
          "--rv-delay": `${delay}s`,
          "--rv-delay-out": `${exitDelay}s`,
          "--rv-y": `${y}px`,
          "--rv-x": `${x}px`,
          ...style,
        } as CSSProperties
      }
    >
      {children}
    </Tag>
  );
}
