"use client";

import { useCallback, useRef } from "react";

/**
 * Survol 3D des cartes — override `HoverCardMove` du projet Framer (design.md §7.4).
 * Paramètres d'origine : maxTilt 10°, maxMove 14px, scale 1.04, perspective 900.
 * Neutralisé sur appareils tactiles et sous prefers-reduced-motion.
 */
const MAX_TILT = 10;
const MAX_MOVE = 14;
const HOVER_SCALE = 1.04;
const PERSPECTIVE = 900;

export function useHoverCardMove<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  const enabled = useCallback(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia("(hover: hover)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  const onPointerEnter = useCallback(() => {
    const el = ref.current;
    if (!el || !enabled()) return;
    el.style.willChange = "transform";
    el.style.transformStyle = "preserve-3d";
    el.style.transition = "transform 140ms ease-out";
    el.style.transform = `perspective(${PERSPECTIVE}px) scale(${HOVER_SCALE})`;
  }, [enabled]);

  const onPointerMove = useCallback(
    (event: React.PointerEvent<T>) => {
      const el = ref.current;
      if (!el || !enabled()) return;
      const rect = el.getBoundingClientRect();
      // Position du pointeur normalisée sur -1..1, centrée.
      const cx = (event.clientX - rect.left) / rect.width - 0.5;
      const cy = (event.clientY - rect.top) / rect.height - 0.5;
      el.style.transition = "transform 40ms linear";
      el.style.transform =
        `perspective(${PERSPECTIVE}px) ` +
        `translate3d(${(cx * MAX_MOVE * 2).toFixed(2)}px, ${(cy * MAX_MOVE * 2).toFixed(2)}px, 0) ` +
        `rotateX(${(-cy * MAX_TILT * 2).toFixed(2)}deg) rotateY(${(cx * MAX_TILT * 2).toFixed(2)}deg) ` +
        `scale(${HOVER_SCALE})`;
    },
    [enabled],
  );

  const onPointerLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform 180ms ease-out";
    el.style.transform = `perspective(${PERSPECTIVE}px) translate3d(0,0,0) rotateX(0) rotateY(0) scale(1)`;
    el.style.willChange = "auto";
  }, []);

  return { ref, handlers: { onPointerEnter, onPointerMove, onPointerLeave } };
}
