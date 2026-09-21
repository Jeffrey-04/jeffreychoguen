"use client";

import { DISTANCE } from "./motion";

/**
 * Moteur d'apparition au scroll, bidirectionnel.
 *
 * Deux observateurs plutôt qu'un, pour créer une large zone morte :
 *  - ENTRÉE : l'élément croise la bande centrale du viewport (70 %).
 *  - SORTIE : l'élément a quitté le viewport ENTIÈREMENT.
 *
 * Cet écart volontaire entre les deux seuils est ce qui empêche le
 * scintillement. Avec un seuil unique, un élément posé pile sur la limite
 * bascule en boucle entre les deux états à chaque pixel de scroll.
 *
 * Un seul couple d'observateurs est partagé par toute la page : instancier un
 * IntersectionObserver par élément coûte cher dès quelques dizaines de nœuds.
 */

type Entry = { el: HTMLElement; dx: number; dy: number };

const registry = new Map<HTMLElement, Entry>();
let enterObserver: IntersectionObserver | null = null;
let exitObserver: IntersectionObserver | null = null;
let lastScrollY = 0;

function reveal(el: HTMLElement) {
  el.dataset.reveal = "in";
}

function conceal(el: HTMLElement, entry: Entry) {
  /*
   * CONTINUITÉ DU MOUVEMENT.
   *
   * Un élément ne doit jamais rebrousser chemin : il poursuit la direction
   * qu'il avait en arrivant. S'il est monté pour se mettre en place, il
   * continue de monter pour sortir par le haut ; s'il est venu de la droite,
   * il repart vers la gauche. En remontant la page, tout s'inverse : il
   * redescend et revient par la droite.
   *
   * D'où un simple changement de signe, appliqué aux DEUX axes : sortie par le
   * haut, on inverse l'offset d'entrée ; sortie par le bas, on le conserve.
   * L'offset de sortie devient l'offset de la prochaine entrée, ce qui garantit
   * qu'un aller-retour repasse exactement par le même chemin.
   */
  const rect = el.getBoundingClientRect();
  const leavingUpwards = rect.top < 0;
  const sign = leavingUpwards ? -1 : 1;
  el.style.setProperty("--rv-y", `${sign * entry.dy}px`);
  el.style.setProperty("--rv-x", `${sign * entry.dx}px`);
  el.dataset.reveal = "out";
}

function ensureObservers() {
  if (enterObserver || typeof IntersectionObserver === "undefined") return;

  enterObserver = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const el = e.target as HTMLElement;
        const entry = registry.get(el);
        if (entry) reveal(el);
      }
    },
    // Bande centrale : l'élément s'anime quand il atteint le regard,
    // pas dès qu'un pixel affleure le bas de l'écran.
    { rootMargin: "-15% 0px -15% 0px", threshold: 0 },
  );

  exitObserver = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) continue;
        const el = e.target as HTMLElement;
        const entry = registry.get(el);
        if (entry) conceal(el, entry);
      }
    },
    { rootMargin: "0px", threshold: 0 },
  );
}

export function register(el: HTMLElement, dy = DISTANCE, dx = 0) {
  if (typeof window === "undefined") return () => {};

  // Mouvement réduit : on affiche, définitivement, sans jamais observer.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.dataset.reveal = "in";
    el.style.setProperty("--rv-y", "0px");
    el.style.setProperty("--rv-x", "0px");
    return () => {};
  }

  ensureObservers();
  if (!enterObserver || !exitObserver) {
    el.dataset.reveal = "in";
    return () => {};
  }

  const entry: Entry = { el, dx, dy };
  registry.set(el, entry);
  el.style.setProperty("--rv-y", `${dy}px`);
  el.style.setProperty("--rv-x", `${dx}px`);

  /*
   * Contrôle géométrique SYNCHRONE, avant toute observation.
   *
   * Filet de sécurité : puisque le CSS masque par défaut, tout retard ou toute
   * défaillance du callback laisserait la page blanche. On révèle donc
   * immédiatement ce qui est déjà dans la bande visible, sans rien attendre.
   */
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || 0;
  const band = vh * 0.15;
  if (rect.top < vh - band && rect.bottom > band) reveal(el);

  enterObserver.observe(el);
  exitObserver.observe(el);
  lastScrollY = window.scrollY;

  return () => {
    registry.delete(el);
    enterObserver?.unobserve(el);
    exitObserver?.unobserve(el);
  };
}

export { lastScrollY };
