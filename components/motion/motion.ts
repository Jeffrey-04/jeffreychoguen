/**
 * Jetons de mouvement — source unique de vérité.
 *
 * L'uniformité perçue d'un site ne vient pas de la beauté d'une animation
 * isolée, mais du fait que TOUTES partagent la même courbe, la même durée et
 * le même rythme. Toute animation du site puise donc ici.
 */

/**
 * Entrée : expo-out. Démarre franchement puis s'installe très doucement.
 * C'est cette longue décélération qui donne la sensation « posée » — bien plus
 * que la durée elle-même.
 */
export const EASE_IN = "cubic-bezier(0.16, 1, 0.3, 1)";

/**
 * Sortie : expo-out plus doux encore que l'entrée. Le mouvement s'éteint
 * au lieu de s'arrêter.
 */
export const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";

/**
 * Asymétrie VOLONTAIRE, et à contre-courant de l'usage : la sortie dure
 * presque deux fois l'entrée.
 *
 * Descendre une page est un geste banal, l'œil connaît déjà l'animation
 * d'arrivée. Remonter et voir le contenu se défaire ne l'est pas : c'est ce
 * moment-là qu'il faut laisser durer, parce que c'est le seul que le visiteur
 * n'a jamais vu ailleurs.
 */
export const DUR_IN = 1150;
export const DUR_OUT = 1700;

/** Distance de translation par défaut, en pixels. */
export const DISTANCE = 48;

/**
 * Pas de cascade entre éléments d'un même groupe, en millisecondes.
 * Suit l'allongement de l'entrée : avec une courbe plus longue, un pas trop
 * court ferait arriver les éléments ensemble et effacerait la hiérarchie.
 */
export const STAGGER = 110;

/**
 * Délai d'un élément dans une cascade. Plafonné : au-delà de ~6 éléments,
 * l'attente devient perceptible comme une lenteur, non comme une élégance.
 */
export function stagger(index: number, step = STAGGER, max = 6): number {
  return Math.min(index, max) * step;
}

/** Ordre d'entrée d'une section, repris du projet Framer (design.md §7.1). */
export const ORDER = {
  title: 0,
  content: 1,
  visual: 2,
  actions: 3,
  cards: 4,
  decor: 5,
} as const;

/**
 * Rythme d'entrée d'une section. Valeurs plus espacées que dans le projet
 * Framer d'origine : avec une courbe d'entrée longue, une cascade trop serrée
 * fait arriver tout ensemble et efface la hiérarchie.
 */
export const revealDelay = {
  nav: 0,
  title: 0,
  content: 0.09,
  visual: 0.18,
  secondary: 0.18,
  actions: 0.27,
  cards: 0.27,
  icons: 0.36,
  decor: 0.45,
} as const;

/** Délai d'un élément dans une grille ou une liste, en secondes. */
export function staggerDelay(index: number, base = 0): number {
  return base + stagger(index) / 1000;
}

/**
 * Temps d'attente après la première carte, avant que les suivantes ne
 * s'enchaînent. C'est ce silence qui crée l'effet d'empilement : une carte se
 * pose, on la voit se poser, puis le reste la rejoint.
 */
export const LEAD = 0.3;

/**
 * Cascade d'un groupe qui s'empile — ET se désempile dans l'ordre inverse.
 *
 * À l'entrée : la première carte arrive seule, marque un temps, puis les
 * autres suivent.
 * À la sortie : l'ordre s'inverse. Celle qui est arrivée en dernier repart en
 * premier, celle qui s'était posée en premier disparaît en dernier — comme on
 * retire une pile par le haut.
 */
export function stackDelays(index: number, count: number, step = 0.13) {
  const enter = index === 0 ? 0 : LEAD + (index - 1) * step;
  const last = count - 1;
  const reversed = last - index;
  const exit = reversed === 0 ? 0 : LEAD * 0.45 + (reversed - 1) * step * 0.7;
  return { delay: enter, exitDelay: exit };
}
