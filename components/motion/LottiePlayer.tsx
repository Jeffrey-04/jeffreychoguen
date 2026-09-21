"use client";

import { useEffect, useRef } from "react";
// Import de TYPE seulement : effacé à la compilation, il ne charge pas le moteur.
import type { AnimationItem } from "lottie-web";

/**
 * Lecteur Lottie, chargé et joué uniquement quand il sert.
 *
 * Trois paresses se cumulent, et c'est ce cumul qui rend l'ajout indolore :
 *
 * 1. Le MOTEUR (45 Ko gzip) n'est importé qu'à l'approche de la section. Une
 *    page qui ne descend jamais jusqu'aux piliers ne le télécharge jamais.
 * 2. Le JSON est récupéré au même moment, pas au chargement de la page.
 * 3. La lecture s'ARRÊTE dès que l'animation sort du champ. Une boucle de 275
 *    images qui tourne dans un onglet invisible consomme pour rien, et se voit
 *    sur l'autonomie d'un portable.
 *
 * La marge de 200px déclenche le chargement juste avant que l'utilisateur
 * n'arrive : il voit l'animation démarrer, pas se charger.
 */
export function LottiePlayer({
  src,
  className = "",
  ariaLabel,
}: {
  /** Chemin du JSON dans public/, ex. « /assets/lottie/backend.json ». */
  src: string;
  className?: string;
  /** Décrit l'animation, ou vide si elle est purement décorative. */
  ariaLabel?: string;
}) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = host.current;
    if (!node) return;

    let animation: AnimationItem | null = null;
    let cancelled = false;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    async function load() {
      const lottie = (await import("lottie-web/build/player/lottie_light")).default;
      if (cancelled || !node) return;

      animation = lottie.loadAnimation({
        container: node,
        renderer: "svg",
        loop: true,
        autoplay: !reduced,
        path: src,
        rendererSettings: { progressiveLoad: true, preserveAspectRatio: "xMidYMid meet" },
      });

      /*
       * Sous mouvement réduit, on fige une image de la COMPOSITION, pas la
       * première : beaucoup d'animations partent d'un écran vide et se
       * construisent. Figer l'image 0 afficherait une carte blanche — c'est
       * exactement ce que faisait l'animation « backend ». Le milieu de la
       * boucle montre la scène complète.
       */
      if (reduced) {
        const item = animation;
        item.addEventListener("DOMLoaded", () => {
          item.goToAndStop(Math.floor(item.totalFrames * 0.55), true);
        });
      }
    }

    // Deux observateurs pour deux rôles : l'un déclenche le chargement en
    // avance, l'autre suit la visibilité réelle pour jouer ou mettre en pause.
    const loader = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        loader.disconnect();
        void load();
      },
      { rootMargin: "200px" },
    );

    const visibility = new IntersectionObserver(
      (entries) => {
        if (!animation || reduced) return;
        for (const entry of entries) {
          if (entry.isIntersecting) animation.play();
          else animation.pause();
        }
      },
      { threshold: 0 },
    );

    loader.observe(node);
    visibility.observe(node);

    return () => {
      cancelled = true;
      loader.disconnect();
      visibility.disconnect();
      animation?.destroy();
    };
  }, [src]);

  return (
    <div
      ref={host}
      className={className}
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
    />
  );
}
