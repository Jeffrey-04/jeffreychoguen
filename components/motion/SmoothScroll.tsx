"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Défilement lissé, propulsé par Lenis.
 *
 * Remplace l'amortissement maison : Lenis normalise l'interpolation sur le
 * temps réel entre deux images, là où un lerp appliqué par frame dérive dès
 * que la fréquence d'affichage varie (120 Hz, onglet en arrière-plan, mode
 * économie d'énergie). Il gère aussi les ancres, les conteneurs imbriqués et
 * `prefers-reduced-motion`, que j'avais dû traiter à la main.
 */

/**
 * Intensité d'interpolation : PLUS BAS = glisse plus longue, donc plus lent.
 *
 * Asymétrie conservée — remonter la page est le moment où les animations se
 * défont, on laisse le temps de les voir. L'écart reste mesuré : un site qui
 * résiste au geste est ressenti comme cassé, pas comme premium.
 */
const LERP_DOWN = 0.085;
const LERP_UP = 0.065;

/** Instance unique, pour que la navigation puisse suspendre le défilement. */
let instance: Lenis | null = null;

export function getLenis(): Lenis | null {
  return instance;
}

export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: LERP_DOWN,
      // Distance native préservée : le lissage doit venir de l'interpolation,
      // jamais d'une course raccourcie.
      wheelMultiplier: 1,
      /*
       * syncTouch reste désactivé : sur mobile, l'inertie native du système
       * est meilleure que toute imitation, et la reprendre en JavaScript se
       * ressent immédiatement comme un retard.
       */
      syncTouch: false,
      // Les ancres passent par Lenis, sans quoi le lien « aller au contenu »
      // sauterait brutalement pendant que Lenis interpole encore.
      anchors: true,
      // Un conteneur qui défile pour son compte garde son comportement natif.
      allowNestedScroll: true,
      respectReducedMotion: true,
      autoRaf: true,
    });

    instance = lenis;

    /*
     * Lenis n'expose pas de réglage par direction : on ajuste l'interpolation
     * à chaque geste, avant qu'elle ne soit consommée par la frame suivante.
     */
    const offVirtual = lenis.on("virtual-scroll", ({ deltaY }) => {
      lenis.options.lerp = deltaY < 0 ? LERP_UP : LERP_DOWN;
    });

    return () => {
      offVirtual?.();
      lenis.destroy();
      instance = null;
    };
  }, []);

  return null;
}
